import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroBackground from '../../assets/images/hero-bg.jpg';
import '../../styles/components/hero.css';

const Hero = () => {
  return (
    <section className="hero-section" style={{ backgroundImage: `url(${heroBackground})` }}>
      <div className="overlay"></div>
      <Container className="hero-container">
        <Row className="align-items-center min-vh-100">
          <Col lg={8} md={10} className="mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="display-3 fw-bold mb-4">
                Wisata Air Panas Pemapak
              </h1>
              <p className="lead mb-5">
                Nikmati khasiat air panas alami dengan pemandangan alam yang indah di Kabupaten Berau, 
                Kalimantan Timur. Tempat bersantai terbaik yang menyatu dengan alam.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button 
                  as={Link} 
                  to="/booking" 
                  variant="primary" 
                  size="lg" 
                  className="rounded-pill px-4"
                >
                  Booking Sekarang
                </Button>
                <Button 
                  as={Link} 
                  to="/facilities" 
                  variant="outline-light" 
                  size="lg" 
                  className="rounded-pill px-4"
                >
                  Lihat Fasilitas
                </Button>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
      <div className="hero-wave">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;