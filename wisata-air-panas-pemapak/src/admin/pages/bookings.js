// src/admin/pages/bookings.js
import React from 'react';
import AdminLayout from '../components/AdminLayout';
import BookingList from '../components/BookingList';
import '../styles/admin.css';

const BookingsPage = () => {
  return (
    <AdminLayout>
      <BookingList />
    </AdminLayout>
  );
};

export default BookingsPage;