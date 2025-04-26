import React from 'react';
import { Container, Navbar, Nav, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../utils/authContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const { logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated() && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Memuat...</span>
        </Spinner>
      </Container>
    );
  }

  // Don't render layout for login page
  if (location.pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="admin-layout d-flex">
      {/* Sidebar Navigation */}
      <div className="sidebar bg-dark text-white">
        <div className="sidebar-header p-3 text-center">
          <h5 className="mb-0">
            <i className="fas fa-hot-tub me-2"></i>
            Air Panas Pemapak
          </h5>
          <div className="small text-light">Panel Admin</div>
        </div>
        <div className="sidebar-menu">
          <Nav className="flex-column">
            <Nav.Link 
              as={Link} 
              to="/admin/dashboard" 
              active={location.pathname === '/admin/dashboard'} 
              className={`sidebar-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
            >
              <i className="fas fa-chart-line me-2"></i> Dasbor
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/bookings" 
              active={location.pathname === '/admin/bookings'} 
              className={`sidebar-link ${location.pathname === '/admin/bookings' ? 'active' : ''}`}
            >
              <i className="fas fa-ticket-alt me-2"></i> Pemesanan
            </Nav.Link>
          </Nav>
        </div>
        <div className="sidebar-footer">
          <Nav className="flex-column mt-auto">
            <Nav.Link as={Link} to="/" target="_blank" className="sidebar-link">
              <i className="fas fa-external-link-alt me-2"></i> Lihat Situs
            </Nav.Link>
            <Button 
              variant="outline-light" 
              onClick={logout} 
              className="mt-2 w-100 sidebar-logout"
            >
              <i className="fas fa-sign-out-alt me-2"></i> Keluar
            </Button>
          </Nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
        <Navbar bg="white" expand="lg" className="shadow-sm mb-4 top-nav">
          <Container fluid>
            <Navbar.Brand className="fw-bold d-md-none">
              <i className="fas fa-hot-tub me-2"></i>
              Air Panas Pemapak
            </Navbar.Brand>
            <div className="d-flex align-items-center ms-auto">
              <div className="me-3 text-end">
                <span className="small text-muted">Selamat Datang,</span>
                <div className="fw-bold">Admin</div>
              </div>
              <img 
                src="/api/placeholder/40/40" 
                alt="Admin" 
                className="rounded-circle border"
              />
            </div>
          </Container>
        </Navbar>

        {/* Page Content */}
        <Container fluid className="py-3 px-4">
          {children}
        </Container>

        {/* Footer */}
        <footer className="border-top mt-4 py-3 bg-white">
          <Container fluid className="px-4">
            <div className="text-center text-md-start text-muted">
              <small>© 2025 Wisata Air Panas Pemapak - Panel Admin</small>
            </div>
          </Container>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;