import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert, Spinner, Badge, Form } from 'react-bootstrap';
import { API_URL } from '../../config/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    recentBookings: [],
    monthlyData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Generate array of years from 2025 to 2030
  const availableYears = Array.from({length: 6}, (_, i) => 2025 + i);

  // Colors for charts
  const COLORS = {
    total: '#2c6e49',      // Primary color
    pending: '#e9c46a',    // Warning color
    confirmed: '#2a9d8f',  // Success color
    cancelled: '#e76f51',  // Danger color
    completed: '#4cc9f0'   // Info color
  };
  
  // Status pie chart colors
  const STATUS_COLORS = ['#e9c46a', '#2a9d8f', '#e76f51', '#4cc9f0'];

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  const fetchData = async (year) => {
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

        // Generate monthly data from visit dates
        const monthlyData = generateMonthlyData(bookings, year);
        
        setStats({
          total: bookings.length,
          pending,
          confirmed,
          cancelled,
          completed,
          recentBookings,
          monthlyData
        });
      } else {
        setError('Gagal memuat data: ' + (data.message || 'Kesalahan tidak diketahui'));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Kesalahan memuat data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate monthly data from visit dates in bookings
  const generateMonthlyData = (bookings, year) => {
    // Initialize data for each month with zeroes
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
      'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    
    // Initialize with all months set to 0
    let monthlyData = months.map((month, index) => ({
      name: month,
      jumlahPemesanan: 0,
      pendapatan: 0,
      month: index + 1 // Store month number for sorting
    }));
    
    // Process each booking
    bookings.forEach(booking => {
      try {
        // Get the visit date
        if (!booking['Visit Date']) return;
        
        const visitDate = new Date(booking['Visit Date']);
        
        // Skip if invalid date
        if (isNaN(visitDate.getTime())) return;
        
        // Only count this booking if it's for the selected year
        if (visitDate.getFullYear() === year) {
          const monthIndex = visitDate.getMonth();
          
          // Increment booking count for this month
          monthlyData[monthIndex].jumlahPemesanan += 1;
          
          // Add to revenue if amount exists
          const amount = parseFloat(booking['Total Amount']);
          if (!isNaN(amount)) {
            monthlyData[monthIndex].pendapatan += amount;
          }
        }
      } catch (err) {
        console.error('Error processing booking date:', err);
      }
    });
    
    return monthlyData;
  };
  
  // Status data for pie chart
  const getStatusData = () => {
    return [
      { name: 'Menunggu', value: stats.pending },
      { name: 'Dikonfirmasi', value: stats.confirmed },
      { name: 'Dibatalkan', value: stats.cancelled },
      { name: 'Selesai', value: stats.completed }
    ].filter(item => item.value > 0);
  };

  // Format currency
  const formatCurrency = (value) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('id-ID');
    } catch (e) {
      return dateString;
    }
  };

  // Format time that might have 1899-12-30 prefix
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    try {
      // Case 1: If string contains "1899-12-30" (Excel/Sheets default time format)
      if (typeof timeString === 'string' && timeString.includes('1899-12-30')) {
        const matches = timeString.match(/(\d{1,2}):\d{2}/);
        if (matches && matches[1]) {
          return `${matches[1].padStart(2, '0')}:00`;
        }
      }
      
      // Case 2: Standard time format
      if (typeof timeString === 'string' && timeString.includes(':')) {
        const hours = timeString.split(':')[0].padStart(2, '0');
        return `${hours}:00`;
      }
      
      // Case 3: Date object
      if (timeString instanceof Date) {
        return timeString.getHours().toString().padStart(2, '0') + ':00';
      }
      
      // Default: Extract first number as hour
      const hourMatch = String(timeString).match(/^(\d{1,2})/);
      if (hourMatch && hourMatch[1]) {
        return `${hourMatch[1].padStart(2, '0')}:00`;
      }
      
      return timeString;
    } catch (e) {
      console.error("Time formatting error:", e, timeString);
      return timeString;
    }
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <p className="label fw-bold mb-1">{`${label}`}</p>
          <p className="mb-1">{`Jumlah: ${payload[0].value} pemesanan`}</p>
          <p className="mb-0">{`Pendapatan: ${formatCurrency(payload[1].value)}`}</p>
        </div>
      );
    }
    return null;
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

  // Get badge class based on status
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Confirmed': return 'confirmed';
      case 'Cancelled': return 'cancelled';
      case 'Completed': return 'completed';
      case 'Pending': 
      default: return 'pending';
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

  // Handle year change
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Memuat...</span>
        </Spinner>
        <p className="mt-2">Memuat data dasbor...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold"><i className="fas fa-tachometer-alt me-2"></i>Dasbor Admin</h2>
        <span className="badge bg-dark rounded-pill">
          <i className="fas fa-calendar me-1"></i> {new Date().toLocaleDateString('id-ID')}
        </span>
      </div>
      
      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="stats-icon bg-primary bg-opacity-10 rounded-circle">
                <i className="fas fa-ticket-alt text-primary"></i>
              </div>
              <div className="ms-3">
                <h3 className="fw-bold mb-0">{stats.total}</h3>
                <p className="text-muted mb-0">Total Pemesanan</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="stats-icon bg-warning bg-opacity-10 rounded-circle">
                <i className="fas fa-clock text-warning"></i>
              </div>
              <div className="ms-3">
                <h3 className="fw-bold mb-0">{stats.pending}</h3>
                <p className="text-muted mb-0">Menunggu</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="stats-icon bg-success bg-opacity-10 rounded-circle">
                <i className="fas fa-check-circle text-success"></i>
              </div>
              <div className="ms-3">
                <h3 className="fw-bold mb-0">{stats.confirmed}</h3>
                <p className="text-muted mb-0">Dikonfirmasi</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="stats-icon bg-info bg-opacity-10 rounded-circle">
                <i className="fas fa-check-double text-info"></i>
              </div>
              <div className="ms-3">
                <h3 className="fw-bold mb-0">{stats.completed}</h3>
                <p className="text-muted mb-0">Selesai</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Charts Row */}
      <Row className="mb-4">
        {/* Monthly Chart */}
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 chart-title">
                <i className="fas fa-chart-line me-2"></i>
                Statistik Bulanan
              </h5>
              <div className="year-selector" style={{ minWidth: '100px' }}>
                <Form.Select 
                  size="sm"
                  value={selectedYear}
                  onChange={handleYearChange}
                  style={{ paddingRight: '2rem' }}
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Form.Select>
              </div>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stats.monthlyData}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={value => `Rp ${(value/1000000).toFixed(1)}jt`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="jumlahPemesanan" name="Jumlah Pemesanan" fill={COLORS.confirmed} />
                  <Bar yAxisId="right" dataKey="pendapatan" name="Pendapatan" fill={COLORS.total} />
                </BarChart>
              </ResponsiveContainer>
              <div className="d-flex justify-content-end mt-3">
                <ul className="chart-legend">
                  <li><span className="legend-bullet" style={{ backgroundColor: COLORS.confirmed }}></span> Jumlah</li>
                  <li><span className="legend-bullet" style={{ backgroundColor: COLORS.total }}></span> Pendapatan</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Status Distribution Chart */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 chart-title">
                <i className="fas fa-chart-pie me-2"></i>
                Distribusi Status
              </h5>
            </Card.Header>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={getStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {getStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} pemesanan`, "Jumlah"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3">
                <ul className="chart-legend">
                  {getStatusData().map((entry, index) => (
                    <li key={`legend-${index}`}>
                      <span className="legend-bullet" style={{ backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length] }}></span>
                      {entry.name}: {entry.value}
                    </li>
                  ))}
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Recent Bookings Card */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-2">
          <h5 className="mb-0 chart-title">
            <i className="fas fa-list me-2"></i>
            Pemesanan Terbaru
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {stats.recentBookings.length === 0 ? (
            <Alert variant="info" className="m-3">Belum ada pemesanan</Alert>
          ) : (
            <div className="recent-bookings">
              {stats.recentBookings.map((booking, index) => (
                <div key={index} className={`booking-item p-2 ${index !== stats.recentBookings.length - 1 ? 'border-bottom' : ''}`}>
                  <Row className="align-items-center gx-2">
                    <Col md={3} sm={6} className="mb-1 mb-md-0">
                      <div className="d-flex align-items-center">
                        <div className="booking-avatar bg-light rounded-circle text-center me-2 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                          <i className="fas fa-user text-secondary"></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fs-6">{booking['Full Name']}</h6>
                          <small className="text-muted d-block" style={{fontSize: '11px'}}>
                            <i className="far fa-calendar me-1"></i>
                            {formatDate(booking.Timestamp)}
                          </small>
                        </div>
                      </div>
                    </Col>
                    <Col md={2} sm={6} xs={6} className="mb-1 mb-md-0">
                      <div className="d-flex flex-column">
                        <small className="text-muted" style={{fontSize: '11px'}}>Tanggal Kunjungan</small>
                        <span className="small">{formatDate(booking['Visit Date'])}</span>
                      </div>
                    </Col>
                    <Col md={1} sm={3} xs={6} className="mb-1 mb-md-0">
                      <div className="d-flex flex-column">
                        <small className="text-muted" style={{fontSize: '11px'}}>Waktu</small>
                        <span className="small">{formatTime(booking['Visit Time'])}</span>
                      </div>
                    </Col>
                    <Col md={2} sm={3} xs={6} className="mb-1 mb-md-0">
                      <div className="d-flex flex-column">
                        <small className="text-muted" style={{fontSize: '11px'}}>Pengunjung</small>
                        <div>
                          <Badge bg="primary" pill className="me-1" style={{fontSize: '10px'}}>
                            <i className="fas fa-user me-1"></i> {booking.Adults || 0}
                          </Badge>
                          {(booking.Children > 0) && (
                            <Badge bg="secondary" pill style={{fontSize: '10px'}}>
                              <i className="fas fa-child me-1"></i> {booking.Children}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col md={2} sm={6} xs={6} className="mb-1 mb-md-0">
                      <div className="d-flex flex-column">
                        <small className="text-muted" style={{fontSize: '11px'}}>Total</small>
                        <span className="fw-bold small">
                          Rp {typeof booking['Total Amount'] === 'number' 
                            ? booking['Total Amount'].toLocaleString() 
                            : booking['Total Amount']}
                        </span>
                      </div>
                    </Col>
                    <Col md={2} sm={6} xs={6} className="text-end">
                      <Badge bg={getStatusBadge(booking.Status || 'Pending')} className="small">
                        {translateStatus(booking.Status || 'Pending')}
                      </Badge>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      <div className="text-center mt-3">
        <p className="text-muted small">
          <i className="fas fa-info-circle me-1"></i>
          Dasbor diperbarui terakhir: {new Date().toLocaleDateString('id-ID')} {new Date().toLocaleTimeString('id-ID')}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;