// api/proxy.js
import axios from 'axios';

// URL Google Apps Script - Update dengan URL hasil deployment baru
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
    let response;
    
    if (req.method === 'GET') {
      // Forward GET request with query params
      const queryString = new URLSearchParams(req.query).toString();
      console.log('Forwarding GET request to:', `${GOOGLE_APPS_SCRIPT_URL}?${queryString}`);
      
      response = await axios.get(`${GOOGLE_APPS_SCRIPT_URL}?${queryString}`, {
        timeout: 30000 // 30 detik timeout
      });
    } else if (req.method === 'POST') {
      console.log('Forwarding POST request to Google Apps Script');
      
      // Check if request body is too large
      const contentLength = parseInt(req.headers['content-length'] || '0', 10);
      if (contentLength > 10485760) { // 10MB limit
        return res.status(413).json({ 
          error: 'Request entity too large',
          message: 'Maximum allowed size is 10MB'
        });
      }
      
      // Forward POST request with body
      response = await axios.post(GOOGLE_APPS_SCRIPT_URL, req.body, {
        timeout: 120000, // 120 detik timeout (ditingkatkan dari 60s)
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Method not supported
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    console.log('Response received from Google Apps Script:', response.status);
    
    // Return response from Google Apps Script
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    // Log detail error untuk debugging
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from the request');
    }
    
    // Detailed error response
    return res.status(500).json({
      status: 'error',
      error: 'Proxy error',
      message: error.message || 'Unknown error occurred',
      details: error.response?.data || 'No additional details available',
      hint: 'Pastikan Google Apps Script sudah di-deploy sebagai web app dengan akses publik'
    });
  }
}