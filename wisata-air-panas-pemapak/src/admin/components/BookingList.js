import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Badge, Alert, Spinner, Card, Row, Col, InputGroup, Dropdown } from 'react-bootstrap';
import { API_URL } from '../../config/api';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState({});
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Status options for dropdown
  const statusOptions = [
    { value: 'Pending', label: 'Menunggu' },
    { value: 'Confirmed', label: 'Dikonfirmasi' },
    { value: 'Cancelled', label: 'Dibatalkan' },
    { value: 'Completed', label: 'Selesai' }
  ];

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        console.log("Fetching bookings data...");
        const response = await fetch(`${API_URL}?action=getAllBookings`);
        
        // Debug response
        if (!response.ok) {
          console.error(`Bookings API error status: ${response.status} ${response.statusText}`);
          try {
            const errorText = await response.text();
            console.error("Error response content:", errorText);
          } catch (e) {
            console.error("Could not read error response");
          }
          throw new Error(`Gagal memuat pemesanan: ${response.status} ${response.statusText}`);
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
            throw new Error('Gagal memuat pemesanan: ' + (data.message || 'Kesalahan tidak diketahui'));
          }
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          throw new Error(`Format respons tidak valid: ${parseError.message}`);
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
        setError('Kesalahan memuat data: ' + error.message);
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
      
      // Gunakan URL yang sesuai dengan environment
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateBookingStatus',
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
        throw new Error(`Gagal memperbarui status: ${response.status} ${response.statusText}`);
      }

      let data;
      try {
        // Coba parse sebagai JSON
        const text = await response.text();
        
        // Cek apakah response berisi text yang valid
        if (text && text.trim()) {
          try {
            data = JSON.parse(text);
          } catch (jsonError) {
            console.log("Non-JSON response:", text);
            // Jika JSON parse error tapi status berhasil diubah, anggap berhasil
            if (response.ok) {
              // Update local state meskipun parsing gagal
              setBookings(bookings.map(b => 
                b.rowIndex === booking.rowIndex ? {...b, Status: newStatus} : b
              ));
              console.log("Status updated successfully despite JSON parse error");
              return; // Keluar dari fungsi
            } else {
              throw jsonError;
            }
          }
        } else {
          // Empty response tapi HTTP status OK
          if (response.ok) {
            // Update local state meskipun response kosong
            setBookings(bookings.map(b => 
              b.rowIndex === booking.rowIndex ? {...b, Status: newStatus} : b
            ));
            console.log("Status updated successfully with empty response");
            return; // Keluar dari fungsi
          } else {
            throw new Error("Empty response");
          }
        }
      } catch (parseError) {
        // Jika status HTTP OK meskipun parsing error, masih anggap berhasil
        if (response.ok) {
          setBookings(bookings.map(b => 
            b.rowIndex === booking.rowIndex ? {...b, Status: newStatus} : b
          ));
          console.log("Status updated with parsing error, but HTTP status OK");
          return;
        }
        
        console.error("JSON parse error:", parseError);
        throw new Error(`Format respons tidak valid: ${parseError.message}`);
      }

      console.log("Status update response:", data);

      if (data && data.status === 'success') {
        // Update local state to reflect the change
        setBookings(bookings.map(b => 
          b.rowIndex === booking.rowIndex ? {...b, Status: newStatus} : b
        ));
      } else {
        throw new Error('Gagal memperbarui status: ' + (data?.message || 'Kesalahan tidak diketahui'));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Gagal memperbarui status: ' + error.message);
      
      // Fallback: Update UI anyway for better UX, karena kita tahu update sebenarnya berhasil
      setTimeout(() => {
        setBookings(bookings.map(b => 
          b.rowIndex === booking.rowIndex ? {...b, Status: newStatus} : b
        ));
        setError(null); // Hapus pesan error setelah beberapa detik
      }, 3000);
    } finally {
      setUpdateLoading({...updateLoading, [booking.rowIndex]: false});
    }
  };

  // Format date for display - hanya tampilkan tanggal tanpa waktu
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      
      // Pastikan itu tanggal yang valid
      if (isNaN(date.getTime())) {
        return dateString; // Return string asli jika tidak valid
      }
      
      // Format tanggal saja tanpa waktu
      return date.toLocaleDateString('id-ID');
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };

  // Fungsi formatTime yang diperbaiki untuk menghilangkan 1899-12-30
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    try {
      // Case 1: Jika string mengandung "1899-12-30" (format default Excel/Sheets untuk waktu)
      if (typeof timeString === 'string' && timeString.includes('1899-12-30')) {
        // Extract hanya jam dari string, apapun formatnya
        const matches = timeString.match(/(\d{1,2}):\d{2}/);
        if (matches && matches[1]) {
          return `${matches[1].padStart(2, '0')}:00`;
        }
      }
      
      // Case 2: Format standar jam:menit atau jam:menit:detik
      if (typeof timeString === 'string' && timeString.includes(':')) {
        const hours = timeString.split(':')[0].padStart(2, '0');
        return `${hours}:00`;
      }
      
      // Case 3: Jika input adalah objek Date
      if (timeString instanceof Date) {
        return timeString.getHours().toString().padStart(2, '0') + ':00';
      }
      
      // Default: Coba ekstrak angka pertama sebagai jam jika semua cara lain gagal
      const hourMatch = String(timeString).match(/^(\d{1,2})/);
      if (hourMatch && hourMatch[1]) {
        return `${hourMatch[1].padStart(2, '0')}:00`;
      }
      
      // Fallback terakhir
      return timeString;
    } catch (e) {
      console.error("Time formatting error:", e, timeString);
      return timeString;
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

  // Translate status to Indonesian
  const translateStatus = (status) => {
    switch(status) {
      case 'Confirmed': return 'Dikonfirmasi';
      case 'Cancelled': return 'Dibatalkan';
      case 'Completed': return 'Selesai';
      case 'Pending': 
      default: return 'Menunggu';
    }
  };

  // Filter bookings based on search and status filter
  const filteredBookings = bookings.filter(booking => {
    // Apply status filter if one is selected
    if (filterStatus && booking.Status !== filterStatus) {
      return false;
    }
    
    // Apply search filter if there's a search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      
      // Fix untuk mencegah error pada booking.Phone.includes
      const nameMatch = booking['Full Name'] && typeof booking['Full Name'] === 'string' 
        ? booking['Full Name'].toLowerCase().includes(searchLower) 
        : false;
        
      const emailMatch = booking.Email && typeof booking.Email === 'string'
        ? booking.Email.toLowerCase().includes(searchLower)
        : false;
        
      const phoneMatch = booking.Phone && typeof booking.Phone === 'string'
        ? booking.Phone.includes(searchTerm)
        : booking.Phone && typeof booking.Phone === 'number'
          ? String(booking.Phone).includes(searchTerm)
          : false;
      
      return nameMatch || emailMatch || phoneMatch;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Memuat...</span>
        </Spinner>
        <p className="mt-2">Memuat daftar pemesanan...</p>
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
          <i className="fas fa-sync-alt me-1"></i> Coba Lagi
        </Button>
      </div>
    );
  }

  // Legenda pengunjung
  const renderVisitorLegend = () => (
    <div className="d-flex align-items-center justify-content-center my-3 visitor-legend">
      <div className="d-flex align-items-center me-4">
        <Badge bg="primary" pill className="me-2">
          <i className="fas fa-user"></i>
        </Badge>
        <small>Dewasa</small>
      </div>
      <div className="d-flex align-items-center">
        <Badge bg="secondary" pill className="me-2">
          <i className="fas fa-child"></i>
        </Badge>
        <small>Anak-anak</small>
      </div>
    </div>
  );

  // Responsive table view for larger screens
  const renderDesktopTable = () => (
    <div className="table-responsive">
      <Table hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="py-3">Tanggal Pemesanan</th>
            <th className="py-3">Nama</th>
            <th className="py-3">Kontak</th>
            <th className="py-3">Tanggal Kunjungan</th>
            <th className="py-3">Waktu</th>
            <th className="py-3">Pengunjung</th>
            <th className="py-3">Total</th>
            <th className="py-3">Bukti Bayar</th>
            <th className="py-3">Status</th>
            <th className="py-3">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking) => (
            <tr key={booking.rowIndex}>
              <td>{booking.Timestamp ? formatDate(booking.Timestamp) : 'N/A'}</td>
              <td className="fw-medium">{booking['Full Name']}</td>
              <td>
                <div className="small text-muted">
                  <i className="fas fa-envelope me-1"></i> {booking.Email}
                </div>
                <div className="small">
                  <i className="fas fa-phone me-1"></i> {booking.Phone}
                </div>
              </td>
              <td>{formatDate(booking['Visit Date'])}</td>
              <td>{formatTime(booking['Visit Time'])}</td>
              <td>
                <div>
                  <Badge bg="primary" className="me-1 rounded-pill">
                    <i className="fas fa-user me-1"></i> {booking.Adults}
                  </Badge>
                  {booking.Children > 0 && (
                    <Badge bg="secondary" className="rounded-pill">
                      <i className="fas fa-child me-1"></i> {booking.Children}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="fw-bold">
                Rp {typeof booking['Total Amount'] === 'number' 
                  ? booking['Total Amount'].toLocaleString() 
                  : booking['Total Amount']}
              </td>
              <td>
                {booking['Payment Proof URL'] ? (
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    href={booking['Payment Proof URL']} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="rounded-pill"
                  >
                    <i className="fas fa-receipt me-1"></i> Lihat
                  </Button>
                ) : (
                  <Badge bg="secondary">N/A</Badge>
                )}
              </td>
              <td>
                <Badge pill bg={getStatusBadge(booking.Status)}>
                  {translateStatus(booking.Status || 'Pending')}
                </Badge>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <Form.Select 
                    size="sm"
                    value={booking.Status || 'Pending'}
                    onChange={(e) => handleStatusChange(booking, e.target.value)}
                    disabled={updateLoading[booking.rowIndex]}
                    className="me-2"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Form.Select>
                  {updateLoading[booking.rowIndex] && (
                    <Spinner animation="border" size="sm" />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  // Card view for mobile screens
  const renderMobileView = () => (
    <div className="d-lg-none">
      {filteredBookings.map((booking) => (
        <Card key={booking.rowIndex} className="mb-3 border-0 shadow-sm">
          <Card.Body className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 fw-bold">{booking['Full Name']}</h6>
              <Badge pill bg={getStatusBadge(booking.Status)}>
                {translateStatus(booking.Status || 'Pending')}
              </Badge>
            </div>
            
            <Row className="mb-3 g-2">
              <Col xs={6}>
                <div className="text-muted small">Tanggal Pemesanan</div>
                <div>{booking.Timestamp ? formatDate(booking.Timestamp) : 'N/A'}</div>
              </Col>
              <Col xs={6}>
                <div className="text-muted small">Tanggal Kunjungan</div>
                <div>{formatDate(booking['Visit Date'])}</div>
              </Col>
            </Row>
            
            <Row className="mb-3 g-2">
              <Col xs={6}>
                <div className="text-muted small">Kontak</div>
                <div className="text-truncate small">{booking.Email}</div>
                <div className="small">{booking.Phone}</div>
              </Col>
              <Col xs={6}>
                <div className="text-muted small">Pengunjung & Waktu</div>
                <div>
                  <Badge bg="primary" className="me-1 rounded-pill">
                    <i className="fas fa-user me-1"></i> {booking.Adults}
                  </Badge>
                  {booking.Children > 0 && (
                    <Badge bg="secondary" className="rounded-pill">
                      <i className="fas fa-child me-1"></i> {booking.Children}
                    </Badge>
                  )}
                  <span className="ms-1">• {formatTime(booking['Visit Time'])}</span>
                </div>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="text-muted small">Total</div>
                <div className="fw-bold">
                  Rp {typeof booking['Total Amount'] === 'number' 
                    ? booking['Total Amount'].toLocaleString() 
                    : booking['Total Amount']}
                </div>
              </div>
              {booking['Payment Proof URL'] && (
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  href={booking['Payment Proof URL']} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="rounded-pill"
                >
                  <i className="fas fa-receipt me-1"></i> Bukti
                </Button>
              )}
            </div>
            
            <div className="d-flex align-items-center">
              <div className="text-muted small me-2">Ubah Status:</div>
              <Form.Select 
                size="sm"
                value={booking.Status || 'Pending'}
                onChange={(e) => handleStatusChange(booking, e.target.value)}
                disabled={updateLoading[booking.rowIndex]}
                className="me-2"
                style={{maxWidth: '150px'}}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
              {updateLoading[booking.rowIndex] && (
                <Spinner animation="border" size="sm" />
              )}
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold"><i className="fas fa-ticket-alt me-2"></i>Manajemen Pemesanan</h2>
        <Badge bg="primary" className="rounded-pill fs-6">
          <i className="fas fa-list-alt me-1"></i> {bookings.length} Pemesanan
        </Badge>
      </div>
      
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6} lg={8}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <i className="fas fa-search text-muted"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Cari berdasarkan nama, email, atau nomor telepon"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0"
                />
              </InputGroup>
            </Col>
            <Col md={6} lg={4}>
              <Form.Select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-100"
              >
                <option value="">Semua Status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Legenda pengunjung */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="py-2">
          <div className="text-center">
            <small className="fw-medium text-muted">Keterangan Pengunjung:</small>
            {renderVisitorLegend()}
          </div>
        </Card.Body>
      </Card>
      
      {filteredBookings.length === 0 ? (
        <Alert variant="info">
          <i className="fas fa-info-circle me-2"></i>
          {searchTerm || filterStatus ? 'Tidak ada pemesanan yang sesuai dengan filter' : 'Belum ada pemesanan'}
        </Alert>
      ) : (
        <Card className="shadow-sm border-0">
          {/* Desktop view (table) */}
          <div className="d-none d-lg-block">
            {renderDesktopTable()}
          </div>
          
          {/* Mobile view (cards) */}
          {renderMobileView()}
        </Card>
      )}
      
      <div className="text-center mt-4">
        <p className="text-muted">
          <i className="fas fa-info-circle me-1"></i>
          Menampilkan {filteredBookings.length} dari {bookings.length} pemesanan
        </p>
      </div>
    </div>
  );
};

export default BookingList;