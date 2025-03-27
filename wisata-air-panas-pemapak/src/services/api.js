import axios from 'axios';

// URL dari web app yang dibuat dengan Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwsaRuE3f0RPzL1E9JGADfi7G0jU5CQ5HChp9lzTgE45sFO6x0ndGKtmPinvhAzpaapAw/exec';

/**
 * Service untuk mengirim data pemesanan ke Google Sheets dan file ke Google Drive
 */
const bookingService = {
  /**
   * Mengirim data pemesanan dan file bukti pembayaran
   * 
   * @param {Object} formData - Data form pemesanan
   * @param {File} paymentProofFile - File bukti pembayaran
   * @returns {Promise} - Promise yang mengembalikan response dari server
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
      
      // Kirim data ke Google Apps Script
      const response = await axios.post(GOOGLE_APPS_SCRIPT_URL, dataToSend);
      return response.data;
    } catch (error) {
      console.error('Error submitting booking:', error);
      throw error;
    }
  },
  
  /**
   * Mendapatkan data ketersediaan / slot booking dari Google Sheets
   * 
   * @returns {Promise} - Promise yang mengembalikan data ketersediaan
   */
  getAvailability: async () => {
    try {
      const response = await axios.get(`${GOOGLE_APPS_SCRIPT_URL}?action=getAvailability`);
      return response.data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  }
};

/**
 * Mengkonversi File ke Base64 string
 * 
 * @param {File} file - File yang akan dikonversi
 * @returns {Promise<string>} - Promise yang mengembalikan string Base64
 */
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export default bookingService;