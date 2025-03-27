import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSwimmingPool,
  faRestroom,
  faUtensils,
  faParking,
  faUmbrella,
  faWifi,
  faPrayingHands,
  faStore
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import '../../styles/components/facilities.css';

const FacilitiesSection = () => {
  const facilities = [
    {
      icon: faSwimmingPool,
      title: 'Kolam Air Panas',
      description: 'Beberapa kolam dengan suhu berbeda untuk kebutuhan berendam yang berbeda.'
    },
    {
      icon: faRestroom,
      title: 'Kamar Bilas',
      description: 'Kamar bilas bersih yang nyaman untuk membersihkan diri setelah berendam.'
    },
    {
      icon: faUtensils,
      title: 'Kantin & Kafetaria',
      description: 'Menyediakan makanan dan minuman dengan menu khas Kalimantan Timur.'
    },
    {
      icon: faParking,
      title: 'Area Parkir Luas',
      description: 'Tersedia area parkir yang luas dan aman untuk kendaraan pengunjung.'
    },
    {
      icon: faUmbrella,
      title: 'Gazebo & Tempat Istirahat',
      description: 'Area santai untuk bersantai sebelum atau sesudah berendam.'
    },
    {
      icon: faWifi,
      title: 'WiFi Gratis',
      description: 'Koneksi internet gratis untuk tetap terhubung selama berwisata.'
    },
    {
      icon: faPrayingHands,
      title: 'Musholla',
      description: 'Tersedia tempat ibadah yang bersih dan nyaman untuk pengunjung muslim.'
    },
    {
      icon: faStore,
      title: 'Toko Oleh-oleh',
      description: 'Menjual berbagai cinderamata dan oleh-oleh khas Berau, Kalimantan Timur.'
    }
  ];

  return (
    <section className="facilities-section py-5">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">Fasilitas Kami</h2>
              <div className="divider mx-auto"></div>
              <p className="lead mt-4">
                Kami menyediakan berbagai fasilitas untuk membuat pengalaman berendam air panas Anda lebih nyaman dan berkesan.
              </p>
            </motion.div>
          </Col>
        </Row>

        <Row>
          {facilities.map((facility, index) => (
            <Col lg={3} md={4} sm={6} className="mb-4" key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="facility-card h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="facility-icon mb-3">
                      <FontAwesomeIcon icon={facility.icon} size="2x" />
                    </div>
                    <Card.Title className="facility-title">{facility.title}</Card.Title>
                    <Card.Text>{facility.description}</Card.Text>
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

export default FacilitiesSection;