import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, 
  faInstagram, 
  faWhatsapp 
} from '@fortawesome/free-brands-svg-icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import contactHeaderBg from '../assets/images/page-headers/contact-header.jpg';
import '../styles/pages/contact.css';

// Fix untuk marker icon di Leaflet
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Contact = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Kontak - Wisata Air Panas Asin Pemapak';
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subjek wajib diisi';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Pesan wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulasi pengiriman data (akan diganti dengan implementasi sebenarnya)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message setelah 5 detik
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Koordinat untuk Wisata Air Panas Asin Pemapak (perkiraan)
  const position = [2.1722, 117.9021];

  // Kontak info
  const contactInfo = [
    {
      icon: faMapMarkerAlt,
      title: 'Alamat',
      content: 'Biatan Bapinang, Biatan, Kabupaten Berau, Kalimantan Timur 77372, Indonesia',
      link: 'https://goo.gl/maps/your-location-link'
    },
    {
      icon: faPhone,
      title: 'Telepon',
      content: '+62 821-4807-1726',
      link: 'tel:+6282148071726'
    },
    {
      icon: faEnvelope,
      title: 'Email',
      content: 'wisataairpanasasinpemapak@gmail.com',
      link: 'mailto:wisataairpanasasinpemapak@gmail.com'
    },
    {
      icon: faClock,
      title: 'Jam Operasional',
      content: 'Setiap Hari: 08:00 - 17:00 WITA',
      link: null
    }
  ];

  // Social media
  const socialMedia = [
    {
      icon: faFacebook,
      name: 'Facebook',
      link: 'https://facebook.com/wisata-air-panas-pemapak',
      color: '#1877F2'
    },
    {
      icon: faInstagram,
      name: 'Instagram',
      link: 'https://instagram.com/wisata-air-panas-pemapak',
      color: '#E1306C'
    },
    {
      icon: faWhatsapp,
      name: 'WhatsApp',
      link: 'https://wa.me/6282148071726',
      color: '#25D366'
    }
  ];

  return (
    <div className="contact-page">
      {/* Header */}
      <div className="page-header" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${contactHeaderBg})` }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center text-white">
              <h1 className="display-4 fw-bold">Kontak Kami</h1>
              <p className="lead">
                Hubungi kami untuk pertanyaan, informasi, atau pemesanan
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Contact Information and Form */}
      <section className="contact-section py-5">
        <Container>
          <Row>
            <Col lg={5} className="mb-5 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="section-title mb-4">Informasi Kontak</h2>
                <p className="mb-5">
                  Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan tentang fasilitas, 
                  harga, atau ingin melakukan pemesanan. Tim kami siap membantu Anda.
                </p>

                {contactInfo.map((info, index) => (
                  <div className="contact-info-item mb-4" key={index}>
                    <div className="contact-icon">
                      <FontAwesomeIcon icon={info.icon} />
                    </div>
                    <div className="contact-details">
                      <h5>{info.title}</h5>
                      {info.link ? (
                        <a href={info.link} target={info.link.startsWith('http') ? '_blank' : null} rel="noreferrer">
                          {info.content}
                        </a>
                      ) : (
                        <p>{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}

                <div className="social-media mt-5">
                  <h5 className="mb-3">Ikuti Kami</h5>
                  <div className="social-icons">
                    {socialMedia.map((social, index) => (
                      <a 
                        href={social.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="social-link"
                        style={{ backgroundColor: social.color }}
                        key={index}
                      >
                        <FontAwesomeIcon icon={social.icon} />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Col>

            <Col lg={7}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="contact-form-card border-0 shadow-lg">
                  <Card.Body className="p-4 p-md-5">
                    <h2 className="mb-4">Kirim Pesan</h2>

                    {submitSuccess && (
                      <Alert variant="success" className="mb-4">
                        Pesan Anda berhasil terkirim! Kami akan segera menghubungi Anda kembali.
                      </Alert>
                    )}
                    
                    {submitError && (
                      <Alert variant="danger" className="mb-4">
                        {submitError}
                      </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label>Nama Lengkap</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-4">
                        <Form.Label>Subjek</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          isInvalid={!!errors.subject}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.subject}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Pesan</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={5} 
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          isInvalid={!!errors.message}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.message}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Button 
                        variant="primary" 
                        type="submit" 
                        size="lg" 
                        className="w-100"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <Container fluid className="p-0">
          <Row>
            <Col className="p-0">
              <div className="map-container">
                <MapContainer 
                  center={position} 
                  zoom={14} 
                  style={{ height: '500px', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={position}>
                    <Popup>
                      <strong>Wisata Air Panas Asin Pemapak</strong><br />
                      Biatan Bapinang, Biatan,<br />
                      Kabupaten Berau, Kalimantan Timur 77372
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ Section (Optional) */}
      {/* <section className="faq-section py-5 bg-light">
        <Container>
          ...
        </Container>
      </section> */}
    </div>
  );
};

export default Contact;