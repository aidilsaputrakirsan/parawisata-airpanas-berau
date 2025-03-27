import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSwimmingPool, 
  faRestroom, 
  faUtensils, 
  faParking, 
  faUmbrella, 
  faWifi,
  faPrayingHands,
  faStore,
  faInfoCircle,
  faUsers,
  faClock,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import '../styles/pages/facilities.css';

const Facilities = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Fasilitas - Wisata Air Panas Pemapak';
  }, []);

  const [activeTab, setActiveTab] = useState('main');

  // Main facilities data
  const mainFacilities = [
    {
      icon: faSwimmingPool,
      title: 'Kolam Air Panas',
      description: 'Berbagai kolam air panas dengan suhu berbeda untuk kebutuhan yang berbeda. Kolam utama dengan suhu 38-40°C ideal untuk relaksasi, kolam terapi dengan suhu 42-45°C untuk terapi, dan kolam keluarga dengan suhu lebih rendah untuk anak-anak.',
      image: '/facilities/hot-pool.jpg'
    },
    {
      icon: faRestroom,
      title: 'Kamar Bilas',
      description: 'Kamar bilas yang bersih dan nyaman tersedia untuk pria dan wanita secara terpisah. Dilengkapi dengan shower air hangat, ruang ganti, dan loker untuk menyimpan barang berharga Anda selama berendam.',
      image: '/facilities/shower-room.jpg'
    },
    {
      icon: faUtensils,
      title: 'Kantin & Kafetaria',
      description: 'Area makan yang nyaman dengan berbagai pilihan menu makanan dan minuman lokal maupun nasional. Tersedia juga kopi dan teh untuk menemani waktu bersantai Anda setelah berendam.',
      image: '/facilities/cafeteria.jpg'
    },
    {
      icon: faParking,
      title: 'Area Parkir Luas',
      description: 'Area parkir yang luas dan aman untuk kendaraan roda dua maupun roda empat. Area parkir dilengkapi dengan petugas keamanan untuk menjaga kendaraan pengunjung selama berada di lokasi wisata.',
      image: '/facilities/parking.jpg'
    }
  ];

  // Additional facilities data
  const additionalFacilities = [
    {
      icon: faUmbrella,
      title: 'Gazebo & Tempat Istirahat',
      description: 'Gazebo dan tempat istirahat yang nyaman untuk bersantai sebelum atau sesudah berendam. Tersedia juga area berjemur untuk menikmati sinar matahari setelah berendam di air panas.',
      image: '/facilities/gazebo.jpg'
    },
    {
      icon: faWifi,
      title: 'WiFi Gratis',
      description: 'Koneksi internet WiFi gratis di seluruh area wisata untuk memudahkan Anda tetap terhubung dan berbagi momen liburan Anda dengan keluarga dan teman melalui media sosial.',
      image: '/facilities/wifi.jpg'
    },
    {
      icon: faPrayingHands,
      title: 'Musholla',
      description: 'Tempat ibadah yang bersih dan nyaman untuk pengunjung muslim. Dilengkapi dengan perlengkapan sholat dan tempat wudhu yang bersih sehingga pengunjung dapat beribadah dengan nyaman.',
      image: '/facilities/musholla.jpg'
    },
    {
      icon: faStore,
      title: 'Toko Oleh-oleh',
      description: 'Toko yang menjual berbagai cinderamata dan oleh-oleh khas Berau, Kalimantan Timur. Tersedia berbagai produk lokal seperti kerajinan tangan, makanan dan minuman khas daerah.',
      image: '/facilities/souvenir.jpg'
    }
  ];

  // Rules and information
  const rulesAndInfo = [
    {
      icon: faInfoCircle,
      title: 'Informasi Umum',
      items: [
        'Wisata Air Panas Pemapak buka setiap hari dari pukul 08.00 - 17.00 WITA',
        'Tiket masuk: Dewasa Rp 25.000, Anak-anak (5-12 tahun) Rp 15.000',
        'Paket keluarga tersedia untuk 2 dewasa dan 2 anak dengan harga Rp 70.000',
        'Pengunjung dapat menyewa handuk dan loker dengan biaya tambahan'
      ]
    },
    {
      icon: faUsers,
      title: 'Aturan Pengunjung',
      items: [
        'Pengunjung wajib mandi sebelum memasuki kolam air panas',
        'Dilarang membawa makanan dan minuman ke area kolam',
        'Dilarang merusak fasilitas dan tanaman di sekitar area wisata',
        'Anak-anak harus didampingi oleh orang dewasa',
        'Pengunjung dengan kondisi medis tertentu disarankan berkonsultasi dengan dokter sebelum berendam'
      ]
    },
    {
      icon: faClock,
      title: 'Waktu Berendam',
      items: [
        'Waktu berendam yang disarankan adalah 15-20 menit per sesi',
        'Istirahat setidaknya 10 menit sebelum melanjutkan sesi berendam berikutnya',
        'Hindari berendam lebih dari 3 sesi dalam satu hari kunjungan',
        'Segera keluar dari kolam jika merasa pusing atau tidak nyaman'
      ]
    },
    {
      icon: faShieldAlt,
      title: 'Keamanan dan Kesehatan',
      items: [
        'Tersedia petugas keamanan dan penyelamat di sekitar area kolam',
        'Kotak P3K tersedia di beberapa titik strategis',
        'Pengunjung disarankan minum air putih secukupnya sebelum dan sesudah berendam',
        'Pengunjung dengan luka terbuka tidak diperkenankan berendam'
      ]
    }
  ];

  return (
    <div className="facilities-page">
      {/* Header */}
      <div className="page-header">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center text-white">
              <h1 className="display-4 fw-bold">Fasilitas</h1>
              <p className="lead">
                Nikmati berbagai fasilitas lengkap yang kami sediakan untuk kenyamanan pengunjung.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Tabs Navigation */}
      <section className="facilities-tabs py-5">
        <Container>
          <Tab.Container id="facilities-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Row className="justify-content-center mb-4">
              <Col lg={8}>
                <Nav variant="pills" className="facilities-nav justify-content-center">
                  <Nav.Item>
                    <Nav.Link eventKey="main" className="mx-2 mb-2">
                      Fasilitas Utama
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="additional" className="mx-2 mb-2">
                      Fasilitas Tambahan
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="rules" className="mx-2 mb-2">
                      Informasi & Aturan
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>

            <Row>
              <Col>
                <Tab.Content>
                  {/* Main Facilities Tab */}
                  <Tab.Pane eventKey="main">
                    <Row className="justify-content-center mb-5">
                      <Col lg={8} className="text-center">
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          <h2 className="section-title">Fasilitas Utama</h2>
                          <div className="divider mx-auto"></div>
                          <p className="lead mt-4">
                            Fasilitas utama yang kami sediakan untuk memberikan pengalaman berendam yang nyaman dan menyenangkan.
                          </p>
                        </motion.div>
                      </Col>
                    </Row>

                    <Row>
                      {mainFacilities.map((facility, index) => (
                        <Col lg={6} className="mb-4" key={index}>
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <Card className="facility-detail-card h-100 border-0 shadow">
                              <Row className="g-0">
                                <Col md={5} className="facility-img-container">
                                  <Card.Img 
                                    src={facility.image} 
                                    alt={facility.title}
                                    className="facility-img"
                                  />
                                </Col>
                                <Col md={7}>
                                  <Card.Body className="p-4">
                                    <div className="facility-icon mb-3">
                                      <FontAwesomeIcon icon={facility.icon} />
                                    </div>
                                    <Card.Title className="facility-title">{facility.title}</Card.Title>
                                    <Card.Text>{facility.description}</Card.Text>
                                  </Card.Body>
                                </Col>
                              </Row>
                            </Card>
                          </motion.div>
                        </Col>
                      ))}
                    </Row>
                  </Tab.Pane>

                  {/* Additional Facilities Tab */}
                  <Tab.Pane eventKey="additional">
                    <Row className="justify-content-center mb-5">
                      <Col lg={8} className="text-center">
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          <h2 className="section-title">Fasilitas Tambahan</h2>
                          <div className="divider mx-auto"></div>
                          <p className="lead mt-4">
                            Fasilitas pendukung untuk melengkapi kenyamanan dan kebutuhan pengunjung selama berwisata.
                          </p>
                        </motion.div>
                      </Col>
                    </Row>

                    <Row>
                      {additionalFacilities.map((facility, index) => (
                        <Col lg={6} className="mb-4" key={index}>
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <Card className="facility-detail-card h-100 border-0 shadow">
                              <Row className="g-0">
                                <Col md={5} className="facility-img-container">
                                  <Card.Img 
                                    src={facility.image} 
                                    alt={facility.title}
                                    className="facility-img"
                                  />
                                </Col>
                                <Col md={7}>
                                  <Card.Body className="p-4">
                                    <div className="facility-icon mb-3">
                                      <FontAwesomeIcon icon={facility.icon} />
                                    </div>
                                    <Card.Title className="facility-title">{facility.title}</Card.Title>
                                    <Card.Text>{facility.description}</Card.Text>
                                  </Card.Body>
                                </Col>
                              </Row>
                            </Card>
                          </motion.div>
                        </Col>
                      ))}
                    </Row>
                  </Tab.Pane>

                  {/* Rules and Info Tab */}
                  <Tab.Pane eventKey="rules">
                    <Row className="justify-content-center mb-5">
                      <Col lg={8} className="text-center">
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          <h2 className="section-title">Informasi & Aturan</h2>
                          <div className="divider mx-auto"></div>
                          <p className="lead mt-4">
                            Informasi penting dan aturan yang perlu diperhatikan untuk kenyamanan dan keamanan bersama.
                          </p>
                        </motion.div>
                      </Col>
                    </Row>

                    <Row>
                      {rulesAndInfo.map((item, index) => (
                        <Col lg={6} className="mb-4" key={index}>
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <Card className="rules-card h-100 border-0 shadow">
                              <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-4">
                                  <div className="rules-icon me-3">
                                    <FontAwesomeIcon icon={item.icon} size="lg" />
                                  </div>
                                  <Card.Title className="rules-title mb-0">{item.title}</Card.Title>
                                </div>
                                <ul className="rules-list">
                                  {item.items.map((rule, idx) => (
                                    <li key={idx} className="mb-2">
                                      {rule}
                                    </li>
                                  ))}
                                </ul>
                              </Card.Body>
                            </Card>
                          </motion.div>
                        </Col>
                      ))}
                    </Row>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 text-white text-center">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-4">Siap Untuk Pengalaman Berendam yang Menyegarkan?</h2>
                <p className="lead mb-4">
                  Nikmati semua fasilitas kami dengan melakukan pemesanan sekarang!
                </p>
                <a href="/booking" className="btn btn-lg btn-light rounded-pill px-4 py-3">
                  Booking Sekarang
                </a>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Facilities;