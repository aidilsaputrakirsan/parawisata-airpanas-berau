import React, { useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import galleryHeaderBg from '../../assets/images/page-headers/gallery-header.jpg';
import gallerykolam1 from '../../assets/images/gallery/kolam-1.jpg'
import gallerykolam2 from '../../assets/images/gallery/kolam-2.jpg'
import gallerykolam3 from '../../assets/images/gallery/kolam-3.jpg'
import galleryalam1 from '../../assets/images/gallery/alam-1.jpg'
import galleryalam2 from '../../assets/images/gallery/alam-2.jpg'
import galleryalam3 from '../../assets/images/gallery/alam-3.jpg'
import galleryfas1 from '../../assets/images/gallery/fasilitas-1.jpg'
import galleryfas2 from '../../assets/images/gallery/fasilitas-2.jpg'
import galleryfas3 from '../../assets/images/gallery/fasilitas-3.jpg'

const GallerySection = () => {
  const [modalShow, setModalShow] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  // Placeholder images - nanti ganti dengan gambar asli
  const galleryImages = [
      {
        id: 1,
        src: gallerykolam1,
        alt: 'Kolam Air Panas Utama',
        category: 'kolam',
        description: 'Kolam utama dengan air panas alami pada suhu sekitar 38-40°C, ideal untuk berendam dan relaksasi.'
      },
      {
        id: 2,
        src: galleryalam1,
        alt: 'Pemandangan Hutan di Sekitar',
        category: 'alam',
        description: 'Pemandangan hutan tropis yang masih asri di sekitar kawasan Wisata Air Panas Pemapak.'
      },
      {
        id: 3,
        src: galleryfas1,
        alt: 'Gazebo untuk Bersantai',
        category: 'fasilitas',
        description: 'Gazebo yang nyaman untuk bersantai sebelum atau sesudah berendam di kolam air panas.'
      },
      {
        id: 4,
        src: gallerykolam2,
        alt: 'Kolam Air Panas Terapi',
        category: 'kolam',
        description: 'Kolam terapi dengan suhu lebih tinggi yang dipercaya bermanfaat untuk meredakan nyeri otot dan sendi.'
      },
      {
        id: 5,
        src: galleryalam2,
        alt: 'Sungai di Sekitar Wisata',
        category: 'alam',
        description: 'Aliran sungai jernih yang mengalir di sekitar kawasan wisata, menambah kesejukan suasana.'
      },
      {
        id: 6,
        src: galleryfas2,
        alt: 'Area Kantin dan Makan',
        category: 'fasilitas',
        description: 'Area kantin yang menyediakan berbagai makanan dan minuman untuk pengunjung.'
      },
      {
        id: 7,
        src: gallerykolam3,
        alt: 'Kolam Air Panas Keluarga',
        category: 'kolam',
        description: 'Kolam keluarga dengan suhu yang lebih rendah, cocok untuk berendam bersama anak-anak.'
      },
      {
        id: 8,
        src: galleryalam3,
        alt: 'Sunrise di Atas Kolam',
        category: 'alam',
        description: 'Pemandangan matahari terbit yang indah di atas kolam air panas, menciptakan suasana yang magis.'
      },
      {
        id: 9,
        src: galleryfas3,
        alt: 'Tempat Bilas',
        category: 'fasilitas',
        description: 'Fasilitas tempat bilas yang bersih dan nyaman untuk pengunjung setelah berendam.'
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
      <div className="gallery-page">
        {/* Gallery Section */}
        <section className="gallery-main-section py-5">
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
                            Momen-momen indah dan berbagai sudut di Wisata Air Panas Pemapak
                          </p>
                        </motion.div>
                      </Col>
            </Row>

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

export default GallerySection;