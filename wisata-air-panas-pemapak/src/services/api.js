// Deteksi environment
const isDevelopment = process.env.NODE_ENV === 'development';

// URL untuk API
const API_URL = isDevelopment ? 'http://localhost:3000/api/proxy' : '/api/proxy';

// Helper function untuk menangani respons Fetch
const handleFetchResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `Gagal mengirim data (${response.status})`;
    
    try {
      const errorText = await response.text();
      try {
        // Try to parse as JSON
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          errorMessage += `: ${errorJson.message}`;
        }
      } catch (parseError) {
        // If not valid JSON, use the raw text if it's not too long
        if (errorText && errorText.length < 100) {
          errorMessage += `: ${errorText}`;
        }
      }
    } catch (e) {
      // If reading response fails
      console.error("Error reading response:", e);
    }
    
    throw new Error(errorMessage);
  }
  
  try {
    const data = await response.json();
    if (data && data.status === 'error') {
      throw new Error(data.message || 'Terjadi kesalahan pada server');
    }
    return data;
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    throw new Error(`Invalid JSON response: ${parseError.message}`);
  }
};

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
      if (paymentProofFile.size > 500000) { // 500KB sebelum kompresi
        console.log("File terlalu besar, melakukan kompresi");
        fileToProcess = await compressImage(paymentProofFile);
        console.log(`Ukuran file setelah kompresi: ${fileToProcess.size} bytes`);
      }

      // Mengubah file menjadi Base64
      const base64File = await convertFileToBase64(fileToProcess);
      console.log(`Ukuran base64: ${base64File.length} karakter`);

      // Pengecekan ukuran file base64
      if (base64File.length > 2000000) { // ~2MB dalam base64, ~1.5MB file asli
        throw new Error('Ukuran file terlalu besar setelah kompresi. Maksimal 1.5MB.');
      }

      // Menyiapkan data untuk dikirim
      const dataToSend = {
        ...formData,
        paymentProof: {
          name: fileToProcess.name,
          type: fileToProcess.type,
          base64Data: base64File
        },
        timestamp: new Date().toISOString()
      };

      console.log("Mengirim data ke:", API_URL);

      // Kirim data dengan timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased timeout to 15 seconds
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        return await handleFetchResponse(response);
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. The server is taking too long to respond.');
        }
        throw error;
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      const errorDetails = {
        message: error.message || 'Unknown error',
        isNetworkError: error.message && error.message.includes('network')
      };
      console.error('Detailed error info:', errorDetails);
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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 detik timeout
      try {
        const response = await fetch(`${API_URL}?action=getAvailability`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        });
        clearTimeout(timeoutId);
        
        // Check if response is OK before attempting to parse
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        try {
          const data = await response.json();
          return data;
        } catch (parseError) {
          console.error("Failed to parse JSON response:", parseError);
          throw new Error(`Failed to parse server response as JSON. The server might be returning an error.`);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 detik timeout
      try {
        const response = await fetch(`${API_URL}?action=test`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        try {
          const data = await response.json();
          return {
            success: true,
            data: data
          };
        } catch (parseError) {
          throw new Error('Invalid JSON response from server');
        }
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
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
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 800;   // Increased from 600
        const MAX_HEIGHT = 800;  // Increased from 600

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

        canvas.toBlob((blob) => {
          const newFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(newFile);
        }, 'image/jpeg', 0.6); // Increased quality from 0.3 to 0.6
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default bookingService;