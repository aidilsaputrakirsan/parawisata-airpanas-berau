import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import '../styles/pages/gallery.css';
import galleryHeaderBg from '../assets/images/page-headers/gallery-header.jpg';
import gallery from '../assets/images/gallery/facility-1.jpg'

const Gallery = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Galeri - Wisata Air Panas Pemapak';
  }, []);

  const [modalShow, setModalShow] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [filter, setFilter] = useState('all');

  // Placeholder images - nanti ganti dengan gambar asli
  const galleryImages = [
    {
      id: 1,
      src: gallery,
      alt: 'Kolam Air Panas Utama',
      category: 'kolam',
      description: 'Kolam utama dengan air panas alami pada suhu sekitar 38-40°C, ideal untuk berendam dan relaksasi.'
    },
    {
      id: 2,
      src: gallery,
      alt: 'Pemandangan Hutan di Sekitar',
      category: 'alam',
      description: 'Pemandangan hutan tropis yang masih asri di sekitar kawasan Wisata Air Panas Pemapak.'
    },
    {
      id: 3,
      src: gallery,
      alt: 'Gazebo untuk Bersantai',
      category: 'fasilitas',
      description: 'Gazebo yang nyaman untuk bersantai sebelum atau sesudah berendam di kolam air panas.'
    },
    {
      id: 4,
      src: gallery,
      alt: 'Kolam Air Panas Terapi',
      category: 'kolam',
      description: 'Kolam terapi dengan suhu lebih tinggi yang dipercaya bermanfaat untuk meredakan nyeri otot dan sendi.'
    },
    {
      id: 5,
      src: gallery,
      alt: 'Sungai di Sekitar Wisata',
      category: 'alam',
      description: 'Aliran sungai jernih yang mengalir di sekitar kawasan wisata, menambah kesejukan suasana.'
    },
    {
      id: 6,
      src: gallery,
      alt: 'Area Kantin dan Makan',
      category: 'fasilitas',
      description: 'Area kantin yang menyediakan berbagai makanan dan minuman untuk pengunjung.'
    },
    {
      id: 7,
      src: gallery,
      alt: 'Kolam Air Panas Keluarga',
      category: 'kolam',
      description: 'Kolam keluarga dengan suhu yang lebih rendah, cocok untuk berendam bersama anak-anak.'
    },
    {
      id: 8,
      src: gallery,
      alt: 'Sunrise di Atas Kolam',
      category: 'alam',
      description: 'Pemandangan matahari terbit yang indah di atas kolam air panas, menciptakan suasana yang magis.'
    },
    {
      id: 9,
      src: gallery,
      alt: 'Tempat Bilas',
      category: 'fasilitas',
      description: 'Fasilitas tempat bilas yang bersih dan nyaman untuk pengunjung setelah berendam.'
    },
    {
      id: 10,
      src: gallery,
      alt: 'Uap Air Panas',
      category: 'kolam',
      description: 'Uap yang mengepul dari kolam air panas, menciptakan suasana yang misterius dan menenangkan.'
    },
    {
      id: 11,
      src: gallery,
      alt: 'Flora di Sekitar Wisata',
      category: 'alam',
      description: 'Berbagai jenis tanaman dan bunga yang tumbuh di sekitar kawasan wisata.'
    },
    {
      id: 12,
      src: gallery,
      alt: 'Toko Oleh-oleh',
      category: 'fasilitas',
      description: 'Toko oleh-oleh yang menjual berbagai produk khas daerah Berau, Kalimantan Timur.'
    }
  ];

  const openModal = (image) => {
    setCurrentImage(image);
    setModalShow(true);
  };

  const filteredImages = filter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  return (
    <div className="gallery-page">
      {/* Header */}
      <div className="page-header" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${galleryHeaderBg})` }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center text-white">
              <h1 className="display-4 fw-bold">Galeri</h1>
              <p className="lead">
                Momen-momen indah dan berbagai sudut di Wisata Air Panas Pemapak
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Gallery Section */}
      <section className="gallery-main-section py-5">
        <Container>
          <Row className="mb-4">
            <Col className="text-center">
              <div className="gallery-filter">
                <Button 
                  variant={filter === 'all' ? 'primary' : 'outline-primary'} 
                  className="mx-2 mb-2"
                  onClick={() => setFilter('all')}
                >
                  Semua
                </Button>
                <Button 
                  variant={filter === 'kolam' ? 'primary' : 'outline-primary'} 
                  className="mx-2 mb-2"
                  onClick={() => setFilter('kolam')}
                >
                  Kolam Air Panas
                </Button>
                <Button 
                  variant={filter === 'fasilitas' ? 'primary' : 'outline-primary'} 
                  className="mx-2 mb-2"
                  onClick={() => setFilter('fasilitas')}
                >
                  Fasilitas
                </Button>
                <Button 
                  variant={filter === 'alam' ? 'primary' : 'outline-primary'} 
                  className="mx-2 mb-2"
                  onClick={() => setFilter('alam')}
                >
                  Pemandangan Alam
                </Button>
              </div>
            </Col>
          </Row>

          <Row className="gallery-grid">
            {filteredImages.map((image, index) => (
              <Col lg={4} md={6} className="mb-4" key={image.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="gallery-item"
                  onClick={() => openModal(image)}
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
      </section>

      {/* Video Section (Optional) */}
      <section className="video-section py-5 bg-light">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="section-title">Video Tour</h2>
                <div className="divider mx-auto"></div>
                <p className="lead mt-4">
                  Lihat sekilas pengalaman yang akan Anda nikmati di Wisata Air Panas Pemapak
                </p>
              </motion.div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col lg={10}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="video-wrapper position-relative rounded overflow-hidden shadow-lg"
              >
                {/* Placeholder for video - gunakan video asli nanti */}
                <div className="video-placeholder d-flex align-items-center justify-content-center">
                  <div className="text-center text-white p-4">
                    <h3 className="mb-3">Video Tour akan segera hadir!</h3>
                    <p>Kami sedang menyiapkan video tour terbaik untuk Anda.</p>
                  </div>
                </div>
                
                {/* Uncomment when video is ready */}
                {/* <div className="ratio ratio-16x9">
                  <iframe 
                    src="https://www.youtube.com/watch?v=sj0yp-YeP2g" 
                    title="Video Tour Wisata Air Panas Pemapak" 
                    allowFullScreen
                  ></iframe>
                </div> */}
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Photo Gallery Modal */}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        centered
        dialogClassName="gallery-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{currentImage.alt}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="img-fluid w-100"
          />
          <p className="mt-3">{currentImage.description}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Gallery;