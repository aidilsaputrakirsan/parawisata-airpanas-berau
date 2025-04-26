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
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  // Don't render layout for login page
  if (location.pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="admin-layout">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/admin/dashboard">Wisata Air Panas Admin</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin/dashboard" active={location.pathname === '/admin/dashboard'}>Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/admin/bookings" active={location.pathname === '/admin/bookings'}>Bookings</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link as={Link} to="/" target="_blank">View Website</Nav.Link>
              <Button variant="outline-light" onClick={logout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        {children}
      </Container>

      <footer className="bg-dark text-white text-center py-3 mt-5">
        <Container>
          <p className="mb-0">© 2025 Wisata Air Panas Pemapak Admin</p>
        </Container>
      </footer>
    </div>
  );
};

export default AdminLayout;