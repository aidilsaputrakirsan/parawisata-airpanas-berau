import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BookingForm from '../components/booking/BookingForm';
import '../styles/pages/booking.css';

const Booking = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Booking - Wisata Air Panas Pemapak';
  }, []);

  return (
    <div className="booking-page">
      <div className="booking-header">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center text-white">
              <h1 className="display-4 fw-bold">Booking</h1>
              <p className="lead">
                Reservasi kunjungan Anda ke Wisata Air Panas Pemapak untuk pengalaman relaksasi terbaik.
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