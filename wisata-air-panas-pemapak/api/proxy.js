//email innosys
// URL Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0UYfeBqBYlUN4MpOljAdx_sxoexTobELxWUTGdrPYSCrH3-w5urMl2tBwtrg_kiuY/exec';

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
  
  // Handle Admin Auth
  if (path === '/api/admin/auth') {
    if (req.method === 'POST') {
      try {
        const { username, password } = req.body;
        
        if (!username || !password) {
          return res.status(400).json({
            status: 'error',
            message: 'Username and password are required'
          });
        }
        
        // Simple credential validation
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          // Generate simple token
          const token = 'admin_' + Math.random().toString(36).substring(2, 15) + 
                       '_' + new Date().getTime().toString(36);
          
          return res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token: token
          });
        } else {
          return res.status(401).json({
            status: 'error',
            message: 'Invalid credentials'
          });
        }
      } catch (error) {
        console.error('Admin auth error:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Authentication failed: ' + (error.message || 'Unknown error')
        });
      }
    } else {
      return res.status(405).json({ 
        status: 'error',
        message: 'Method not allowed' 
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
        const timeoutId = setTimeout(() => controller.abort(), 8000);
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
  
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
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