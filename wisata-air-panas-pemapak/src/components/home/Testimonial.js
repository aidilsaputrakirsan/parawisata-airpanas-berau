import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import '../../styles/components/testimonial.css';

const TestimonialSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Ahmad Saputra',
      role: 'Pengunjung dari Samarinda',
      image: '/testimonials/person1.jpg',
      stars: 5,
      text: 'Pengalaman yang luar biasa! Air panas di sini memiliki suhu yang pas untuk berendam dan pemandangannya sangat indah. Fasilitas juga cukup lengkap. Cocok untuk liburan keluarga.'
    },
    {
      id: 2,
      name: 'Siti Rahayu',
      role: 'Traveler',
      image: '/testimonials/person2.jpg',
      stars: 4,
      text: 'Suasananya sangat tenang dan menenangkan. Air panas di sini sangat menyegarkan dan membantu menghilangkan lelah setelah perjalanan panjang. Pasti akan kembali lagi ke sini!'
    },
    {
      id: 3,
      name: 'Budi Santoso',
      role: 'Pelancong dari Balikpapan',
      image: '/testimonials/person3.jpg',
      stars: 5,
      text: 'Tersembunyi namun sangat worth it untuk dikunjungi. Pemandangan alamnya sangat indah dan air panasnya sangat menyehatkan. Sangat direkomendasikan untuk dikunjungi!'
    }
  ];

  const renderStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(
        <FontAwesomeIcon 
          key={i} 
          icon={faStar} 
          className="text-warning" 
        />
      );
    }
    return stars;
  };

  return (
    <section className="testimonial-section py-5">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">Apa Kata Mereka</h2>
              <div className="divider mx-auto"></div>
              <p className="lead mt-4">
                Lihat bagaimana pengalaman pengunjung kami saat mengunjungi Wisata Air Panas Pemapak.
              </p>
            </motion.div>
          </Col>
        </Row>

        <Row>
          {testimonials.map((testimonial, index) => (
            <Col lg={4} md={6} className="mb-4" key={testimonial.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="testimonial-card h-100 border-0 shadow">
                  <Card.Body className="p-4">
                    <div className="quote-icon mb-3">
                      <FontAwesomeIcon icon={faQuoteLeft} size="2x" className="text-primary opacity-50" />
                    </div>
                    <Card.Text className="mb-4">
                      {testimonial.text}
                    </Card.Text>
                    <div className="stars mb-3">
                      {renderStars(testimonial.stars)}
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="testimonial-img me-3">
                        <img 
                          src={testimonial.image || '/testimonials/placeholder.jpg'} 
                          alt={testimonial.name}
                          className="rounded-circle"
                        />
                      </div>
                      <div>
                        <Card.Title className="testimonial-name mb-0">{testimonial.name}</Card.Title>
                        <small className="text-muted">{testimonial.role}</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default TestimonialSection;