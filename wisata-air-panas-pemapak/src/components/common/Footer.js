import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, 
  faInstagram, 
  faWhatsapp 
} from '@fortawesome/free-brands-svg-icons';
import '../../styles/components/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <Container>
        <Row className="py-5">
          <Col lg={4} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Wisata Air Panas Pemapak</h5>
            <p>
              Nikmati pengalaman berendam air panas alami dengan pemandangan alam yang 
              indah di Kalimantan Timur. Tempat terbaik untuk bersantai dan 
              menyegarkan pikiran bersama keluarga dan teman.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="me-3">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="https://www.instagram.com/wisataairpanas_asinpemapak" target="_blank" rel="noopener noreferrer" className="me-3">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="https://wa.me/6282148071726" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faWhatsapp} size="lg" />
              </a>
            </div>
          </Col>
          
          <Col lg={4} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Tautan Cepat</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="footer-link">Beranda</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="footer-link">Tentang Kami</Link>
              </li>
              <li className="mb-2">
                <Link to="/facilities" className="footer-link">Fasilitas</Link>
              </li>
              <li className="mb-2">
                <Link to="/gallery" className="footer-link">Galeri</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="footer-link">Kontak</Link>
              </li>
              <li>
                <Link to="/booking" className="footer-link">Booking</Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={4} md={12}>
            <h5 className="text-uppercase mb-4">Kontak & Lokasi</h5>
            <ul className="list-unstyled contact-info">
              <li className="mb-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                <span>Biatan Bapinang, Biatan, Kabupaten Berau, Kalimantan Timur 77372</span>
              </li>
              <li className="mb-3">
                <FontAwesomeIcon icon={faPhone} className="me-2" />
                <a href="tel:+6282148071726">+62 821-4807-1726</a>
              </li>
              <li className="mb-3">
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                <a href="mailto:info@wisataairpanaspemapak.com">info@wisataairpanaspemapak.com</a>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="divider" />
        
        <Row className="py-3">
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0">
              &copy; {currentYear} Wisata Air Panas Pemapak. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="mb-0">
              Dikembangkan dengan <span className="text-danger">❤</span> di Indonesia
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;