//email innosys
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzza1HHc2FgU9aqyAk6NoXrV9szTPxuPQz6arjFbwXf-SMuoik2kjuCWT5qIZUk7zKs/exec';

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

    if (req.method === 'GET') {
      // Forward GET request with query params
      const queryString = new URLSearchParams(req.query).toString();
      console.log(`Sending GET request to: ${GOOGLE_APPS_SCRIPT_URL}?${queryString}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 detik timeout
      try {
        const fetchResponse = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?${queryString}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text();
          throw new Error(`HTTP error! Status: ${fetchResponse.status}, Detail: ${errorText}`);
        }

        const data = await fetchResponse.json();
        return res.status(200).json(data);
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } else if (req.method === 'POST') {
      console.log('Processing POST request');

      // Verifikasi req.body tidak kosong
      if (!req.body) {
        return res.status(400).json({
          status: 'error',
          message: 'Request body is empty'
        });
      }

      // Log metadata tanpa data sensitif
      console.log('Request body metadata:', {
        fullName: req.body.fullName,
        email: req.body.email,
        hasPaymentProof: !!req.body.paymentProof
      });

      // Periksa apakah ini adalah permintaan booking dengan file bukti pembayaran
      const hasPaymentProof = req.body.paymentProof && req.body.paymentProof.base64Data;
      if (hasPaymentProof) {
        console.log(`Booking request with payment proof: ${req.body.paymentProof.name}`);
        const base64Size = (req.body.paymentProof.base64Data || '').length;
        console.log(`Base64 data size: ${base64Size} chars`);

        if (base64Size > 2000000) { // ~2MB dalam base64, ~1.5MB file asli
          return res.status(413).json({
            status: 'error',
            message: 'File terlalu besar, maksimal 1.5MB'
          });
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 detik timeout
      try {
        const fetchResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req.body),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text();
          console.error(`Error response from Apps Script: ${fetchResponse.status}`, errorText);
          throw new Error(`HTTP error! Status: ${fetchResponse.status}, Detail: ${errorText}`);
        }

        const data = await fetchResponse.json();
        return res.status(200).json(data);
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } else {
      // Method not supported
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Proxy error:', error.message);
    let errorDetail = {
      message: error.message || 'Unknown error occurred',
      stack: error.stack
    };
    if (error.name === 'AbortError') {
      errorDetail.message = 'Request timed out while contacting Google Apps Script';
    }

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat memproses permintaan',
      detail: errorDetail.message,
      hint: 'Pastikan Google Apps Script sudah benar dan hubungi admin untuk bantuan'
    });
  }
}