import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BookingForm from '../components/booking/BookingForm';
import bookingHeaderBg from '../assets/images/page-headers/booking-header.jpg';
import '../styles/pages/booking.css';

const Booking = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Booking - Wisata Air Panas Asin Pemapak';
  }, []);

  return (
    <div className="booking-page">
      <div className="booking-header" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bookingHeaderBg})` }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center text-white">
              <h1 className="display-4 fw-bold">Booking</h1>
              <p className="lead">
                Reservasi kunjungan Anda ke Wisata Air Panas Asin Pemapak untuk pengalaman relaksasi terbaik.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      
      <BookingForm />
    </div>
  );
};

export default Booking;