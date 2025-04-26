import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Badge, Alert, Spinner } from 'react-bootstrap';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState({});

  // Status options for dropdown
  const statusOptions = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        console.log("Fetching bookings data...");
        const response = await fetch('/api/admin/bookings');
        
        // Debug response
        if (!response.ok) {
          console.error(`Bookings API error status: ${response.status} ${response.statusText}`);
          try {
            const errorText = await response.text();
            console.error("Error response content:", errorText);
          } catch (e) {
            console.error("Could not read error response");
          }
          throw new Error(`Failed to load bookings: ${response.status} ${response.statusText}`);
        }
        
        // Try to parse response as JSON
        try {
          const data = await response.json();
          console.log("Bookings data received:", data);
          
          if (data.status === 'success') {
            if (Array.isArray(data.data)) {
              setBookings(data.data);
            } else {
              console.warn("Response data is not an array:", data);
              setBookings([]);
            }
          } else {
            throw new Error('Failed to load bookings: ' + (data.message || 'Unknown error'));
          }
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          throw new Error(`Invalid response format: ${parseError.message}`);
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
        setError('Error loading data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle status change
  const handleStatusChange = async (booking, newStatus) => {
    // Don't do anything if status hasn't changed
    if (booking.Status === newStatus) return;
    
    try {
      setUpdateLoading({...updateLoading, [booking.rowIndex]: true});
      
      console.log(`Updating booking ${booking.rowIndex} status to ${newStatus}`);
      const response = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rowIndex: booking.rowIndex,
          status: newStatus
        }),
      });

      // Debug response
      if (!response.ok) {
        console.error(`Status update error: ${response.status} ${response.statusText}`);
        try {
          const errorText = await response.text();
          console.error("Error response content:", errorText);
        } catch (e) {
          console.error("Could not read error response");
        }
        throw new Error(`Failed to update status: ${response.status} ${response.statusText}`);
      }

      try {
        const data = await response.json();
        console.log("Status update response:", data);

        if (data.status === 'success') {
          // Update local state to reflect the change
          setBookings(bookings.map(b => 
            b.rowIndex === booking.rowIndex ? {...b, Status: newStatus} : b
          ));
        } else {
          throw new Error('Failed to update status: ' + (data.message || 'Unknown error'));
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error(`Invalid response format: ${parseError.message}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status: ' + error.message);
    } finally {
      setUpdateLoading({...updateLoading, [booking.rowIndex]: false});
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      if (dateString instanceof Date) {
        return new Date(dateString).toLocaleDateString('id-ID');
      }
      // If it's already a string in the format YYYY-MM-DD
      return dateString;
    } catch (e) {
      console.error("Date formatting error:", e);
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
        <p className="mt-2">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Alert variant="danger">{error}</Alert>
        <Button 
          variant="primary" 
          onClick={() => window.location.reload()}
          className="mt-3"
        >
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Booking Management</h2>
      
      {bookings.length === 0 ? (
        <Alert variant="info">No bookings found</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="bg-light">
              <tr>
                <th>Tanggal Booking</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>Tanggal Kunjungan</th>
                <th>Waktu</th>
                <th>Dewasa</th>
                <th>Anak</th>
                <th>Total</th>
                <th>Bukti Bayar</th>
                <th>Status</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.rowIndex}>
                  <td>{booking.Timestamp ? formatDate(booking.Timestamp) : 'N/A'}</td>
                  <td>{booking['Full Name']}</td>
                  <td>{booking.Email}</td>
                  <td>{booking.Phone}</td>
                  <td>{formatDate(booking['Visit Date'])}</td>
                  <td>{booking['Visit Time']}</td>
                  <td>{booking.Adults}</td>
                  <td>{booking.Children}</td>
                  <td>Rp {typeof booking['Total Amount'] === 'number' ? booking['Total Amount'].toLocaleString() : booking['Total Amount']}</td>
                  <td>
                    {booking['Payment Proof URL'] ? (
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        href={booking['Payment Proof URL']} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Lihat
                      </Button>
                    ) : 'N/A'}
                  </td>
                  <td>
                    <Badge bg={getStatusBadge(booking.Status)}>
                      {booking.Status || 'Pending'}
                    </Badge>
                  </td>
                  <td>
                    <Form.Select 
                      size="sm"
                      value={booking.Status || 'Pending'}
                      onChange={(e) => handleStatusChange(booking, e.target.value)}
                      disabled={updateLoading[booking.rowIndex]}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Form.Select>
                    {updateLoading[booking.rowIndex] && (
                      <Spinner animation="border" size="sm" className="ms-2" />
                    )}
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

export default BookingList;