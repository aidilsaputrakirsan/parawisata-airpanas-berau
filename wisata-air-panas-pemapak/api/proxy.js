// URL Google Apps Script - Pastikan sudah di-deploy sebagai web app dengan akses publik
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxTrjJUI-GSVYMpnQdZI-obROfxHw01I3zO4mQZQUyDmx55X9acU5SzAZIJiPbGh5UxfA/exec';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Handle preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    console.log(`Processing ${req.method} request to ${GOOGLE_APPS_SCRIPT_URL}`);
    
    let response;
    
    if (req.method === 'GET') {
      // Forward GET request with query params
      const queryString = new URLSearchParams(req.query).toString();
      console.log(`Sending GET request to: ${GOOGLE_APPS_SCRIPT_URL}?${queryString}`);
      
      // Gunakan fetch API untuk menghindari masalah dengan axios di lingkungan serverless
      const fetchResponse = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!fetchResponse.ok) {
        throw new Error(`HTTP error! Status: ${fetchResponse.status}`);
      }
      
      const data = await fetchResponse.json();
      return res.status(200).json(data);
      
    } else if (req.method === 'POST') {
      console.log('Processing POST request');
      
      // Verifikasi req.body tidak kosong
      if (!req.body) {
        return res.status(400).json({
          status: 'error',
          message: 'Request body is empty'
        });
      }
      
      console.log(`Request body size: ${JSON.stringify(req.body).length} bytes`);
      
      // Periksa apakah ini adalah permintaan booking dengan file bukti pembayaran
      const hasPaymentProof = req.body.paymentProof && req.body.paymentProof.base64Data;
      if (hasPaymentProof) {
        console.log(`Booking request with payment proof: ${req.body.paymentProof.name}`);
        
        // Verifikasi ukuran base64 tidak terlalu besar
        const base64Size = (req.body.paymentProof.base64Data || '').length;
        console.log(`Base64 data size: ${base64Size} chars`);
        
        if (base64Size > 5000000) { // ~5MB dalam bentuk base64
          return res.status(413).json({
            status: 'error',
            message: 'File terlalu besar, maksimal 3MB'
          });
        }
      }
      
      // Gunakan fetch API untuk mengirim POST
      const fetchResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      });
      
      if (!fetchResponse.ok) {
        const errorText = await fetchResponse.text();
        console.error(`Error response from Apps Script: ${fetchResponse.status}`, errorText);
        throw new Error(`HTTP error! Status: ${fetchResponse.status}, Detail: ${errorText}`);
      }
      
      const data = await fetchResponse.json();
      return res.status(200).json(data);
      
    } else {
      // Method not supported
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    // Catat informasi error yang lengkap
    let errorDetail = {
      message: error.message || 'Unknown error occurred',
      stack: error.stack,
      isAxiosError: !!error.isAxiosError
    };
    
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
      errorDetail.status = error.response.status;
      errorDetail.data = error.response.data;
    } else if (error.request) {
      console.error('No response received from the request');
      errorDetail.noResponse = true;
    }
    
    console.error('Detailed error:', JSON.stringify(errorDetail, null, 2));
    
    // Beri respons dengan informasi error yang jelas
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat memproses permintaan',
      detail: error.message,
      hint: 'Pastikan Google Apps Script sudah benar dan hubungi admin untuk bantuan'
    });
  }
}