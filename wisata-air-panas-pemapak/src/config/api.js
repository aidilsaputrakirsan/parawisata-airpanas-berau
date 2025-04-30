// src/config/api.js
// File konfigurasi untuk URL API

// Deteksi environment
const isDevelopment = process.env.NODE_ENV === 'development';

// URL Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwR5JQ81weAzLl4L4AAQbXigbkg_0OBsj-ptezyED6_gy_gDEITspQa0JGs3Zp2uzkd/exec';

// URL untuk API - gunakan CORS proxy di localhost
export const API_URL = isDevelopment 
  ? `http://localhost:8080/${GOOGLE_APPS_SCRIPT_URL}` 
  : '/api/proxy';

// Kredensial admin
export const ADMIN_CREDENTIALS = {
  username: "admin@wisataairpemapak.com",
  password: "wisataairpemapakberau"
};