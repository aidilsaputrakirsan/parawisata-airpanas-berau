import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert, Spinner, Table, Badge } from 'react-bootstrap';
import { API_URL } from '../../config/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}?action=getAllBookings`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.status === 'success') {
          const bookings = data.data || [];
          
          // Calculate stats
          const pending = bookings.filter(b => !b.Status || b.Status === 'Pending').length;
          const confirmed = bookings.filter(b => b.Status === 'Confirmed').length;
          const cancelled = bookings.filter(b => b.Status === 'Cancelled').length;
          const completed = bookings.filter(b => b.Status === 'Completed').length;
          
          // Get 5 most recent bookings
          const recentBookings = [...bookings]
            .sort((a, b) => {
              // Convert to date objects if not already
              const dateA = a.Timestamp instanceof Date ? a.Timestamp : new Date(a.Timestamp);
              const dateB = b.Timestamp instanceof Date ? b.Timestamp : new Date(b.Timestamp);
              return dateB - dateA;
            })
            .slice(0, 5);
            
          setStats({
            total: bookings.length,
            pending,
            confirmed,
            cancelled,
            completed,
            recentBookings
          });
        } else {
          setError('Failed to load data: ' + (data.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Error loading data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

   // Format date for display
   const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('id-ID');
    } catch (e) {
      return dateString;
    }
  };

  // Get badge variant based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      case 'Completed':
        return 'info';
      case 'Pending':
      default:
        return 'warning';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <h3 className="text-primary">{stats.total}</h3>
              <Card.Title>Total Bookings</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100 shadow-sm border-warning">
            <Card.Body>
              <h3 className="text-warning">{stats.pending}</h3>
              <Card.Title>Pending</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100 shadow-sm border-success">
            <Card.Body>
              <h3 className="text-success">{stats.confirmed}</h3>
              <Card.Title>Confirmed</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100 shadow-sm border-info">
            <Card.Body>
              <h3 className="text-info">{stats.completed}</h3>
              <Card.Title>Completed</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <h4 className="mb-3">Pemesanan Terbaru</h4>
      {stats.recentBookings.length === 0 ? (
        <Alert variant="info">Belum ada pemesanan</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="bg-light">
              <tr>
                <th>Tanggal</th>
                <th>Nama</th>
                <th>Tgl Kunjungan</th>
                <th>Waktu</th>
                <th>Jumlah</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((booking, index) => (
                <tr key={index}>
                  <td>{formatDate(booking.Timestamp)}</td>
                  <td>{booking['Full Name']}</td>
                  <td>{formatDate(booking['Visit Date'])}</td>
                  <td>{booking['Visit Time']}</td>
                  <td>{booking.Adults} dewasa, {booking.Children} anak</td>
                  <td>Rp {typeof booking['Total Amount'] === 'number' ? booking['Total Amount'].toLocaleString() : booking['Total Amount']}</td>
                  <td>
                    <Badge bg={getStatusBadge(booking.Status)}>
                      {booking.Status || 'Pending'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;