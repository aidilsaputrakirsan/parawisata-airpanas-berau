import axios from 'axios';

// URL dari web app yang dibuat dengan Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzo4RGroUsjbJy_olv8udNxb89oeZ8f_SR-c_vUwRivlwFI7WP9dbuNjeSnOza_AU_ctg/exec';
// CORS Proxy URL
const CORS_PROXY = 'http://localhost:8080/';

/**
 * Service untuk mengirim data pemesanan ke Google Sheets dan file ke Google Drive
 */
const bookingService = {
  /**
   * Mengirim data pemesanan dan file bukti pembayaran
   */
  submitBooking: async (formData, paymentProofFile) => {
    try {
      // Mengubah file menjadi Base64
      const base64File = await convertFileToBase64(paymentProofFile);
      
      // Menyiapkan data untuk dikirim
      const dataToSend = {
        ...formData,
        paymentProof: {
          name: paymentProofFile.name,
          type: paymentProofFile.type,
          base64Data: base64File
        },
        timestamp: new Date().toISOString()
      };
      
      // Kirim data ke Google Apps Script melalui CORS proxy
      const response = await axios.post(CORS_PROXY + GOOGLE_APPS_SCRIPT_URL, dataToSend);
      return response.data;
    } catch (error) {
      console.error('Error submitting booking:', error);
      throw error;
    }
  },
  
  /**
   * Mendapatkan data ketersediaan / slot booking dari Google Sheets
   */
  getAvailability: async () => {
    try {
      const response = await axios.get(CORS_PROXY + `${GOOGLE_APPS_SCRIPT_URL}?action=getAvailability`);
      return response.data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  }
};

// Helper function remains the same
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export default bookingService;