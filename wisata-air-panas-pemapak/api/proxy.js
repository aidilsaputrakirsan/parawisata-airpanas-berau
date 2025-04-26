//email innosys
// URL Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweRBA2DbyK3WdUurKRgpsGgJ_gPJ8Z7VECWVmTKNpgLIjlALQzoHkwraPg0fRpcXlD/exec';

// Hardcoded credentials untuk admin
const ADMIN_USERNAME = "admin@wisataairpemapak.com";
const ADMIN_PASSWORD = "wisataairpemapakberau";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Cek path URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  
  // Handle Admin Auth - perbaikan deteksi permintaan auth
  if (path === '/api/admin/auth' || 
    (req.method === 'POST' && req.body && 
    ((req.body.username && req.body.password) || req.body.action === 'auth'))) {

  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Username dan password wajib diisi'
        });
      }
      
      console.log("Mencoba verifikasi kredensial untuk:", username);
      
      // Simple credential validation
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Generate simple token
        const token = 'admin_' + Math.random().toString(36).substring(2, 15) + 
                    '_' + new Date().getTime().toString(36);
        
        const responseData = {
          status: 'success',
          message: 'Login berhasil',
          token: token
        };
        
        console.log("Login berhasil, mengirim respons:", JSON.stringify(responseData));
        
        // Pastikan respons berformat JSON yang valid
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(responseData);
      } else {
        const responseData = {
          status: 'error',
          message: 'Kredensial tidak valid'
        };
        
        console.log("Login gagal, mengirim respons:", JSON.stringify(responseData));
        
        // Pastikan respons berformat JSON yang valid
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json(responseData);
      }
    } catch (error) {
      console.error('Admin auth error:', error);
      
      // Pastikan respons berformat JSON yang valid
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        status: 'error',
        message: 'Autentikasi gagal: ' + (error.message || 'Unknown error')
      });
    }
  } else {
    // Pastikan respons berformat JSON yang valid
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({ 
      status: 'error',
      message: 'Metode tidak diizinkan' 
    });
  }
  }
  
  // Handle Admin Bookings API
  else if (path === '/api/admin/bookings') {
    if (req.method === 'GET') {
      // Fetch all bookings
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        try {
          const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getAllBookings`, { 
            signal: controller.signal 
          });
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          return res.status(200).json(data);
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Failed to fetch bookings: ' + (error.message || 'Unknown error')
        });
      }
    }
    // Update booking status
    else if (req.method === 'POST') {
      try {
        const { rowIndex, status } = req.body;
        
        if (!rowIndex || !status) {
          return res.status(400).json({
            status: 'error',
            message: 'Row index and status are required'
          });
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        try {
          const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              action: 'updateBookingStatus',
              rowIndex: rowIndex,
              status: status
            }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          return res.status(200).json(data);
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      } catch (error) {
        console.error('Error updating booking:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Failed to update booking: ' + (error.message || 'Unknown error')
        });
      }
    } else {
      return res.status(405).json({ 
        status: 'error',
        message: 'Method not allowed' 
      });
    }
  }
  
  // Handle original proxy.js functionality
  else {
    try {
      let response;
      
      if (req.method === 'GET') {
        // Forward GET request with query params
        const queryString = new URLSearchParams(req.query).toString();
        console.log(`Sending GET request to: ${GOOGLE_APPS_SCRIPT_URL}?${queryString}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // Increased timeout
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
            let errorText;
            try {
              errorText = await fetchResponse.text();
            } catch (textError) {
              errorText = 'Could not read error response';
            }
            console.error(`HTTP error in GET request: ${fetchResponse.status}`, errorText);
            throw new Error(`HTTP error! Status: ${fetchResponse.status}, Detail: ${errorText}`);
          }

          let data;
          try {
            data = await fetchResponse.json();
          } catch (jsonError) {
            console.error('JSON parse error:', jsonError);
            throw new Error(`Invalid JSON response from server`);
          }
          
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
  
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased timeout
        try {
          const fetchResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(req.body),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (!fetchResponse.ok) {
            let errorText;
            try {
              errorText = await fetchResponse.text();
            } catch (textError) {
              errorText = 'Could not read error response';
            }
            console.error(`Error response from Apps Script: ${fetchResponse.status}`, errorText);
            throw new Error(`HTTP error! Status: ${fetchResponse.status}, Detail: ${errorText}`);
          }

          let data;
          try {
            data = await fetchResponse.json();
          } catch (jsonError) {
            console.error('JSON parse error:', jsonError);
            throw new Error(`Invalid JSON response from server`);
          }
          
          return res.status(200).json(data);
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      } else {
        // Method not supported
        return res.status(405).json({ 
          status: 'error', 
          message: 'Method not allowed' 
        });
      }
    } catch (error) {
      console.error('Proxy error:', error.message);
      
      // Catat informasi error yang lengkap
      let errorDetail = {
        message: error.message || 'Unknown error occurred',
        stack: error.stack,
        isAxiosError: !!error.isAxiosError
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
}