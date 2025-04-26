import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faBus, faMotorcycle } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

// Fix untuk marker icon di Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationSection = () => {
  // Koordinat untuk Wisata Air Panas Pemapak
  // Catatan: Ini adalah koordinat perkiraan, ganti dengan koordinat sebenarnya
  const position = [2.1722, 117.9021];

  const transportationOptions = [
    {
      icon: faCar,
      title: 'Dengan Mobil',
      description: 'Dari pusat Kabupaten Berau, ambil jalur menuju Kecamatan Biatan. Perjalanan akan memakan waktu sekitar 2 jam. Ikuti petunjuk jalan dan rambu menuju Desa Biatan Bapinang.'
    },
    {
      icon: faBus,
      title: 'Dengan Angkutan Umum',
      description: 'Tersedia angkutan umum dari Terminal Berau menuju Kecamatan Biatan. Setelah sampai di terminal Biatan, Anda bisa menggunakan ojek atau angkutan lokal menuju lokasi air panas.'
    },
    {
      icon: faMotorcycle,
      title: 'Dengan Sepeda Motor',
      description: 'Rute dengan sepeda motor cukup mudah diakses. Dari pusat Kabupaten Berau, ikuti jalan utama menuju Kecamatan Biatan dan ikuti petunjuk jalan menuju Wisata Air Panas Pemapak.'
    }
  ];

  return (
    <section className="location-section py-5">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">Lokasi Kami</h2>
              <div className="divider mx-auto"></div>
              <p className="lead mt-4">
                Wisata Air Panas Pemapak terletak di Biatan Bapinang, Kecamatan Biatan, Kabupaten Berau, Kalimantan Timur.
              </p>
            </motion.div>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={12}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="map-container shadow-lg"
            >
              <MapContainer 
                center={position} 
                zoom={14} 
                style={{ height: '500px', width: '100%', borderRadius: '10px' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                  <Popup>
                    <strong>Wisata Air Panas Pemapak</strong><br />
                    Biatan Bapinang, Biatan,<br />
                    Kabupaten Berau, Kalimantan Timur 77372
                  </Popup>
                </Marker>
              </MapContainer>
            </motion.div>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col lg={12} className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-center mb-4">Cara Menuju Lokasi</h3>
            </motion.div>
          </Col>

          {transportationOptions.map((option, index) => (
            <Col md={4} className="mb-4" key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="transportation-card h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="transportation-icon mb-3">
                      <FontAwesomeIcon icon={option.icon} size="2x" />
                    </div>
                    <Card.Title>{option.title}</Card.Title>
                    <Card.Text>{option.description}</Card.Text>
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

export default LocationSection;