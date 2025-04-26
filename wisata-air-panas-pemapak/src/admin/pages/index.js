// src/admin/pages/index.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/authContext';
import '../styles/admin.css';

const AdminIndexPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated()) {
        navigate('/admin/dashboard');
      } else {
        navigate('/admin/login');
      }
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="text-center py-5">
      <p>Redirecting...</p>
    </div>
  );
};

export default AdminIndexPage;