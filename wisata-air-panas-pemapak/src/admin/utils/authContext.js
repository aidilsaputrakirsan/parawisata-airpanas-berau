import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

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
      // Log untuk debugging
      console.log("Mencoba login dengan username:", username);
      
      // Tambahkan parameter action=auth untuk memudahkan identifikasi di proxy
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          password,
          action: 'auth' // Tambahkan parameter ini untuk identifikasi di proxy.js
        }),
      });
  
      // Debug respons mentah
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        return { success: false, message: `Server error: ${response.status}` };
      }
      
      // Coba parse JSON
      try {
        const data = await response.json();
        
        if (data.status === 'success') {
          localStorage.setItem('adminToken', data.token);
          setToken(data.token);
          return { success: true };
        } else {
          return { success: false, message: data.message || "Login gagal" };
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        return { success: false, message: "Format respons server tidak valid" };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login gagal. Periksa koneksi jaringan atau hubungi administrator.' };
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