import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, ADMIN_CREDENTIALS } from '../../config/api';

const AuthContext = createContext();

// Deteksi environment
const isDevelopment = process.env.NODE_ENV === 'development';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      console.log("Mencoba login dengan username:", username);
      
      // SOLUSI UNTUK DEVELOPMENT: Validasi login secara lokal
      if (isDevelopment) {
        // Kredensial admin dari konfigurasi
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
          // Generate token sederhana
          const token = 'admin_dev_' + Math.random().toString(36).substring(2, 15);
          localStorage.setItem('adminToken', token);
          setToken(token);
          return { success: true };
        } else {
          return { 
            success: false, 
            message: "Kredensial tidak valid" 
          };
        }
      }
      
      // Kode asli untuk production di Vercel
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          password,
          action: 'admin_auth'
        }),
      });
      
      // Debug response
      if (!response.ok) {
        console.error(`Login error status: ${response.status} ${response.statusText}`);
        try {
          const errorText = await response.text();
          console.error("Error response content:", errorText);
        } catch (e) {
          console.error("Could not read error response");
        }
        return { success: false, message: `Server error: ${response.status}` };
      }
      
      // Parse JSON response
      try {
        const data = await response.json();
        console.log("Login response data:", data);
        
        if (data.status === 'success') {
          localStorage.setItem('adminToken', data.token);
          setToken(data.token);
          return { success: true };
        } else {
          return { 
            success: false, 
            message: data.message || "Login gagal dengan respon yang tidak diketahui" 
          };
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        return { success: false, message: "Format respons server tidak valid" };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login gagal. Periksa koneksi jaringan atau hubungi administrator.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    navigate('/admin/login');
  };

  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);