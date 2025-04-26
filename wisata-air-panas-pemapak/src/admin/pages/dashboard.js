// src/admin/pages/dashboard.js
import React from 'react';
import AdminLayout from '../components/AdminLayout';
import Dashboard from '../components/Dashboard';
import '../styles/admin.css';

const DashboardPage = () => {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
};

export default DashboardPage;