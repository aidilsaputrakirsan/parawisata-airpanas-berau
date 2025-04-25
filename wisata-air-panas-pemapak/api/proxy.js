// api/proxy.js
import axios from 'axios';

// URL Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzo4RGroUsjbJy_olv8udNxb89oeZ8f_SR-c_vUwRivlwFI7WP9dbuNjeSnOza_AU_ctg/exec';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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
      response = await axios.get(`${GOOGLE_APPS_SCRIPT_URL}?${queryString}`);
    } else if (req.method === 'POST') {
      // Forward POST request with body
      response = await axios.post(GOOGLE_APPS_SCRIPT_URL, req.body);
    } else {
      // Method not supported
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Return response from Google Apps Script
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    // Return error details
    return res.status(500).json({
      error: 'Proxy error',
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}