import axios from 'axios';

// Deteksi environment
const isDevelopment = process.env.NODE_ENV === 'development';

// URL untuk API
// Di Vercel, kita gunakan path relatif ke serverless function
const API_URL = '/api/proxy';

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
      
      // Mengubah file menjadi Base64 dengan kompresi tambahan jika perlu
      const base64File = await convertFileToBase64(fileToProcess);
      console.log(`Ukuran base64: ${base64File.length} karakter`);
      
      // Tambahkan pengecekan ukuran file base64
      if (base64File.length > 5000000) { // 5MB dalam base64
        throw new Error('Ukuran file terlalu besar setelah kompresi. Mohon gunakan file dengan ukuran lebih kecil.');
      }
      
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
      
      // Kirim data melalui fetch API untuk kompatibilitas yang lebih baik
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
      
      // Periksa status HTTP
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response: ${response.status}`, errorText);
        
        let errorMessage = `Gagal mengirim data (${response.status})`;
        try {
          // Coba parse error sebagai JSON jika memungkinkan
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage += `: ${errorJson.message}`;
          }
        } catch (e) {
          // Jika bukan JSON, gunakan teks error sebagai pesan
          if (errorText && errorText.length < 100) {
            errorMessage += `: ${errorText}`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log("Response dari server:", data);
      
      // Handle potential error responses with success status
      if (data && data.status === 'error') {
        throw new Error(data.message || 'Terjadi kesalahan pada server');
      }
      
      return data;
    } catch (error) {
      console.error('Error submitting booking:', error);
      
      // Provide more detailed error info
      const errorDetails = {
        message: error.message || 'Unknown error',
        isNetworkError: error.message && error.message.includes('network')
      };
      
      console.error('Detailed error info:', errorDetails);
      
      // Rethrow with more context
      throw {
        ...error,
        details: errorDetails,
        userMessage: error.message || 'Terjadi kesalahan saat mengirim data. Silakan coba lagi atau hubungi admin.'
      };
    }
  },
  
  /**
   * Mendapatkan data ketersediaan / slot booking dari Google Sheets
   */
  getAvailability: async () => {
    try {
      console.log("Mengambil data availability dari:", `${API_URL}?action=getAvailability`);
      
      const response = await fetch(`${API_URL}?action=getAvailability`);
      
      // Periksa status HTTP
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response: ${response.status}`, errorText);
        throw new Error(`Gagal mengambil data (${response.status})`);
      }
      
      const data = await response.json();
      
      // Handle potential error responses with success status
      if (data && data.status === 'error') {
        throw new Error(data.message || 'Terjadi kesalahan pada server');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw {
        ...error,
        userMessage: error.message || 'Gagal mengambil data ketersediaan. Silakan coba lagi nanti.'
      };
    }
  },
  
  /**
   * Test connection to the server
   */
  testConnection: async () => {
    try {
      const response = await fetch(`${API_URL}?action=test`);
      const data = await response.json();
      return {
        success: true,
        data: data
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
        
        // Jika gambar terlalu besar, kurangi ukurannya lebih agresif
        const MAX_WIDTH = 800; // Turunkan dari 1200 ke 800
        const MAX_HEIGHT = 800; // Turunkan dari 1200 ke 800
        
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
        
        // Konversi ke blob dengan kualitas 0.5 (50%)
        canvas.toBlob((blob) => {
          // Buat file baru dari blob
          const newFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(newFile);
        }, 'image/jpeg', 0.5); // Reduced quality to 50% for smaller file size
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default bookingService;