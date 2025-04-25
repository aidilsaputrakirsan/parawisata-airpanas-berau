import axios from 'axios';

// Deteksi environment
const isDevelopment = process.env.NODE_ENV === 'development';

// URL untuk proxy
const API_URL = isDevelopment
  ? 'http://localhost:8080/https://script.google.com/macros/s/AKfycbxTrjJUI-GSVYMpnQdZI-obROfxHw01I3zO4mQZQUyDmx55X9acU5SzAZIJiPbGh5UxfA/exec' // URL untuk development dengan CORS proxy
  : '/api/proxy'; // URL relatif ke serverless function di Vercel

/**
 * Service untuk mengirim data pemesanan ke Google Sheets dan file ke Google Drive
 */
const bookingService = {
  /**
   * Mengirim data pemesanan dan file bukti pembayaran
   */
  submitBooking: async (formData, paymentProofFile) => {
    try {
      console.log("Mulai proses submit booking");
      
      // Kompresi gambar jika ukurannya terlalu besar
      let fileToProcess = paymentProofFile;
      if (paymentProofFile.size > 1000000) { // 1MB
        console.log("File terlalu besar, melakukan kompresi");
        fileToProcess = await compressImage(paymentProofFile);
        console.log(`Ukuran file setelah kompresi: ${fileToProcess.size} bytes`);
      }
      
      // Mengubah file menjadi Base64
      const base64File = await convertFileToBase64(fileToProcess);
      
      // Menyiapkan data untuk dikirim
      const dataToSend = {
        ...formData,
        paymentProof: {
          name: paymentProofFile.name,
          type: fileToProcess.type,
          base64Data: base64File
        },
        timestamp: new Date().toISOString()
      };
      
      console.log("Mengirim data ke:", API_URL);
      
      // Kirim data melalui proxy yang sesuai dengan timeout yang lebih panjang
      const response = await axios.post(API_URL, dataToSend, {
        timeout: 120000, // 120 detik timeout untuk file upload (ditingkatkan dari 60s)
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Response dari server:", response.status);
      
      // Handle potential error responses with success status
      if (response.data && response.data.status === 'error') {
        throw new Error(response.data.message || 'Unknown error from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error submitting booking:', error);
      
      // Provide more detailed error info
      const errorDetails = {
        message: error.message || 'Unknown error',
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : null,
        isNetworkError: error.request && !error.response
      };
      
      console.error('Detailed error info:', errorDetails);
      
      // Rethrow with more context
      throw {
        ...error,
        details: errorDetails,
        userMessage: 'Terjadi kesalahan saat mengirim data. Silakan coba lagi atau hubungi admin.'
      };
    }
  },
  
  /**
   * Mendapatkan data ketersediaan / slot booking dari Google Sheets
   */
  getAvailability: async () => {
    try {
      console.log("Mengambil data availability dari:", `${API_URL}?action=getAvailability`);
      const response = await axios.get(`${API_URL}?action=getAvailability`, {
        timeout: 30000 // 30 detik timeout
      });
      
      // Handle potential error responses with success status
      if (response.data && response.data.status === 'error') {
        throw new Error(response.data.message || 'Unknown error from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw {
        ...error,
        userMessage: 'Gagal mengambil data ketersediaan. Silakan coba lagi nanti.'
      };
    }
  },
  
  /**
   * Test connection to the server
   */
  testConnection: async () => {
    try {
      const response = await axios.get(`${API_URL}?action=test`, {
        timeout: 10000
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Connection test failed:', error);
      return {
        success: false,
        error: error
      };
    }
  }
};

// Helper function untuk konversi file ke Base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function untuk kompresi gambar
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        // Buat canvas untuk kompresi
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Jika gambar terlalu besar, kurangi ukurannya
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Konversi ke blob dengan kualitas 0.7 (70%)
        canvas.toBlob((blob) => {
          // Buat file baru dari blob
          const newFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(newFile);
        }, 'image/jpeg', 0.6); // Reduced quality to 60% for smaller file size
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default bookingService;