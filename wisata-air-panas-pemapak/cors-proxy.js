const corsAnywhere = require('cors-anywhere');
const http = require('http');
const url = require('url');

// Admin credentials
const ADMIN_USERNAME = "admin@wisataairpemapak.com";
const ADMIN_PASSWORD = "wisataairpemapakberau";

// Google Apps Script URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxaUdPsnQnth_JO1WZsSUXfarbjn0p0YA_Tf2b02JcrBGGSQTtPAV7Ewf3W7H1yZj1W/exec';

const host = 'localhost';
const port = 8080;

// Create a custom HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;
  
  console.log(`Received request: ${req.method} ${path}`);
  
  // Set CORS headers for all responses
  setCorsHeaders(res);
  
  // Handle OPTIONS requests (pre-flight)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle admin auth endpoint
  if (path === '/api/admin/auth') {
    handleAdminAuth(req, res);
    return;
  }
  
  // Handle admin bookings endpoint
  if (path === '/api/admin/bookings') {
    handleAdminBookings(req, res, query);
    return;
  }
  
  // Handle direct proxy request
  if (path === '/api/proxy') {
    handleProxyRequest(req, res, query);
    return;
  }
  
  // Default response for other paths
  const corsProxy = corsAnywhere.createServer({
    originWhitelist: [],
    requireHeader: [],
    removeHeaders: ['cookie', 'cookie2']
  });
  
  // Use the CORS Anywhere handler for other paths
  corsProxy.emit('request', req, res);
});

// Handle admin authentication
function handleAdminAuth(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'error', message: 'Method not allowed' }));
    return;
  }
  
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      
      console.log('Auth request data:', data);
      
      if (!data.username || !data.password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Username and password are required' }));
        return;
      }
      
      if (data.username === ADMIN_USERNAME && data.password === ADMIN_PASSWORD) {
        const token = 'admin_' + Math.random().toString(36).substring(2, 15) + 
                      '_' + new Date().getTime().toString(36);
        
        console.log('Login successful for:', data.username);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          message: 'Login successful',
          token: token
        }));
      } else {
        console.log('Login failed - invalid credentials');
        
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'error',
          message: 'Invalid credentials'
        }));
      }
    } catch (error) {
      console.error('Error processing admin auth:', error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'error',
        message: 'Invalid request format'
      }));
    }
  });
}

// Handle admin bookings requests
function handleAdminBookings(req, res, query) {
  if (req.method === 'GET') {
    // Forward to Google Apps Script for bookings data
    console.log('Fetching bookings data from GAS');
    
    const targetUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=getAllBookings`;
    
    fetch(targetUrl)
      .then(response => response.json())
      .then(data => {
        console.log('Received bookings data');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'error',
          message: 'Failed to fetch bookings: ' + error.message
        }));
      });
  } else if (req.method === 'POST') {
    // Handle booking status update
    console.log('Updating booking status');
    
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        
        if (!data.rowIndex || !data.status) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'error',
            message: 'Row index and status are required'
          }));
          return;
        }
        
        // Forward the update request to Google Apps Script
        fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'updateBookingStatus',
            rowIndex: data.rowIndex,
            status: data.status
          })
        })
        .then(response => response.json())
        .then(data => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        })
        .catch(error => {
          console.error('Error updating booking status:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'error',
            message: 'Failed to update booking status: ' + error.message
          }));
        });
      } catch (error) {
        console.error('Error parsing update request:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'error',
          message: 'Invalid request format'
        }));
      }
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'error', message: 'Method not allowed' }));
  }
}

// Handle general proxy requests with action parameter
function handleProxyRequest(req, res, query) {
  const action = query.action;
  
  console.log('Proxy request with action:', action);
  
  if (req.method === 'GET' && action === 'getAllBookings') {
    // Redirect to the bookings handler
    handleAdminBookings(req, res, query);
    return;
  }
  
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        
        // Check for admin auth request
        if (data.action === 'admin_auth') {
          // Process as admin auth request
          if (data.username === ADMIN_USERNAME && data.password === ADMIN_PASSWORD) {
            const token = 'admin_' + Math.random().toString(36).substring(2, 15) + 
                          '_' + new Date().getTime().toString(36);
            
            console.log('Login successful via proxy');
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              status: 'success',
              message: 'Login successful',
              token: token
            }));
          } else {
            console.log('Login failed via proxy - invalid credentials');
            
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              status: 'error',
              message: 'Invalid credentials'
            }));
          }
          return;
        }
        
        // Check for booking status update
        if (data.action === 'updateBookingStatus') {
          if (!data.rowIndex || !data.status) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              status: 'error',
              message: 'Row index and status are required'
            }));
            return;
          }
          
          // Forward to Google Apps Script
          fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              action: 'updateBookingStatus',
              rowIndex: data.rowIndex,
              status: data.status
            })
          })
          .then(response => response.json())
          .then(responseData => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(responseData));
          })
          .catch(error => {
            console.error('Error updating booking status via proxy:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              status: 'error',
              message: 'Failed to update booking status: ' + error.message
            }));
          });
          return;
        }
        
        // Forward other POST requests to Google Apps Script
        fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(responseData => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(responseData));
        })
        .catch(error => {
          console.error('Error forwarding POST request:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'error',
            message: 'Failed to process request: ' + error.message
          }));
        });
      } catch (error) {
        console.error('Error parsing proxy request:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'error',
          message: 'Invalid request format'
        }));
      }
    });
  } else {
    // Forward GET requests with other actions to Google Apps Script
    const queryString = Object.entries(query)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    const targetUrl = `${GOOGLE_APPS_SCRIPT_URL}?${queryString}`;
    
    fetch(targetUrl)
      .then(response => response.json())
      .then(data => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      })
      .catch(error => {
        console.error('Error forwarding GET request:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'error',
          message: 'Failed to process request: ' + error.message
        }));
      });
  }
}

// Set CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
}

// Start the server
server.listen(port, host, () => {
  console.log(`Custom CORS proxy running on ${host}:${port}`);
});