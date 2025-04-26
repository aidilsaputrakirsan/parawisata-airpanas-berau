import React, { useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import kolam1 from '../../assets/images/gallery/kolam-1.jpg';
import alam1 from '../../assets/images/gallery/alam-1.jpg';

const GallerySection = () => {
  const [modalShow, setModalShow] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  // Placeholder images - nanti ganti dengan gambar asli
  const galleryImages = [
    {
      id: 1,
      src: kolam1,
      alt: 'Kolam Air Panas Utama',
      category: 'kolam'
    },
    {
      id: 2,
      src: alam1,
      alt: 'Pemandangan Alam Sekitar',
      category: 'alam'
    },
    {
      id: 3,
      src: alam1,
      alt: 'Fasilitas Gazebo',
      category: 'fasilitas'
    },
    {
      id: 4,
      src: alam1,
      alt: 'Area Bersantai',
      category: 'fasilitas'
    },
    {
      id: 5,
      src: alam1,
      alt: 'Kolam Air Panas Keluarga',
      category: 'kolam'
    },
    {
      id: 6,
      src: alam1,
      alt: 'Jalan Setapak di Area Wisata',
      category: 'alam'
    },
    {
      id: 7,
      src: alam1,
      alt: 'Kantin dan Area Makan',
      category: 'fasilitas'
    },
    {
      id: 8,
      src: alam1,
      alt: 'Suasana Malam dengan Lampu Hias',
      category: 'alam'
    }
  ];

  const openModal = (imageSrc) => {
    setCurrentImage(imageSrc);
    setModalShow(true);
  };

  const [filter, setFilter] = useState('all');

  const filteredImages = filter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  return (
    <section className="gallery-section py-5">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">Galeri</h2>
              <div className="divider mx-auto"></div>
              <p className="lead mt-4">
                Lihat keindahan dan suasana Wisata Air Panas Pemapak melalui galeri foto kami.
              </p>
            </motion.div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col className="text-center">
            <div className="gallery-filter">
              <Button 
                variant={filter === 'all' ? 'primary' : 'outline-primary'} 
                className="mx-1 mb-2"
                onClick={() => setFilter('all')}
              >
                Semua
              </Button>
              <Button 
                variant={filter === 'kolam' ? 'primary' : 'outline-primary'} 
                className="mx-1 mb-2"
                onClick={() => setFilter('kolam')}
              >
                Kolam Air Panas
              </Button>
              <Button 
                variant={filter === 'fasilitas' ? 'primary' : 'outline-primary'} 
                className="mx-1 mb-2"
                onClick={() => setFilter('fasilitas')}
              >
                Fasilitas
              </Button>
              <Button 
                variant={filter === 'alam' ? 'primary' : 'outline-primary'} 
                className="mx-1 mb-2"
                onClick={() => setFilter('alam')}
              >
                Pemandangan
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="gallery-container">
          {filteredImages.map((image, index) => (
            <Col lg={3} md={4} sm={6} className="mb-4" key={image.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="gallery-item"
                onClick={() => openModal(image.src)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="img-fluid rounded"
                />
                <div className="gallery-overlay">
                  <div className="gallery-info">
                    <h5>{image.alt}</h5>
                    <span>Klik untuk memperbesar</span>
                  </div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Galeri Wisata Air Panas Pemapak</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={currentImage}
            alt="Enlarged view"
            className="img-fluid"
          />
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default GallerySection;