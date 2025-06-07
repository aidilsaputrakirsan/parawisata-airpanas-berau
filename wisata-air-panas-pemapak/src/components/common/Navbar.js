import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../styles/components/navbar.css';
import logoImage from '../../assets/images/logo.png'

const MainNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Navbar 
      expand="lg" 
      className={`fixed-top ${scrolled ? 'scrolled' : ''}`}
      variant={scrolled ? 'light' : 'dark'}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="d-flex align-items-center"
          >
            <img 
              src={logoImage} 
              alt="Wisata Air Panas Asin Pemapak" 
              style={{ height: '30px', maxHeight: '30px', width: 'auto' }} 
              className="d-inline-block align-top me-2"
            />
            <span className="brand-text">Wisata Air Panas Asin Pemapak</span>
          </motion.div>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Beranda
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about" 
              className={location.pathname === '/about' ? 'active' : ''}
            >
              Tentang Kami
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/facilities" 
              className={location.pathname === '/facilities' ? 'active' : ''}
            >
              Fasilitas
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/gallery" 
              className={location.pathname === '/gallery' ? 'active' : ''}
            >
              Galeri
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/contact" 
              className={location.pathname === '/contact' ? 'active' : ''}
            >
              Kontak
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/booking" 
              className="booking-btn"
            >
              Booking
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;