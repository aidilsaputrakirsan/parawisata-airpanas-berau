import React, { useEffect } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHistory, 
  faLeaf, 
  faWater, 
  faHeart 
} from '@fortawesome/free-solid-svg-icons';
import '../styles/pages/about.css';

const About = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Tentang Kami - Wisata Air Panas Pemapak';
  }, []);

  // Timeline data
  const timeline = [
    {
      year: '1980',
      title: 'Penemuan Sumber Air Panas',
      description: 'Sumber air panas Pemapak pertama kali ditemukan oleh penduduk lokal di kawasan hutan Biatan Bapinang.'
    },
    {
      year: '1995',
      title: 'Mulai Dikembangkan',
      description: 'Pemerintah daerah mulai mengembangkan area ini sebagai objek wisata lokal yang sederhana.'
    },
    {
      year: '2005',
      title: 'Fasilitas Dasar',
      description: 'Penambahan kolam dan fasilitas dasar untuk kenyamanan pengunjung yang datang dari berbagai daerah.'
    },
    {
      year: '2015',
      title: 'Renovasi Besar',
      description: 'Renovasi besar-besaran dan pengembangan fasilitas yang lebih modern untuk meningkatkan kenyamanan pengunjung.'
    },
    {
      year: '2020',
      title: 'Destinasi Wisata Unggulan',
      description: 'Wisata Air Panas Pemapak diresmikan sebagai salah satu destinasi wisata unggulan di Kabupaten Berau.'
    }
  ];

  // Mission & Vision
  const missions = [
    'Menyediakan pengalaman wisata air panas yang berkualitas dan menyehatkan',
    'Melestarikan sumber daya alam dan lingkungan sekitar',
    'Memberdayakan masyarakat lokal melalui pengembangan pariwisata berkelanjutan',
    'Menjadi pusat edukasi tentang kekayaan alam dan kearifan lokal Kalimantan Timur'
  ];

  const values = [
    {
      icon: faHeart,
      title: 'Keramahtamahan',
      description: 'Kami selalu menyambut pengunjung dengan keramahan dan kehangatan'
    },
    {
      icon: faLeaf,
      title: 'Kelestarian',
      description: 'Kami berkomitmen untuk menjaga kelestarian alam dan lingkungan'
    },
    {
      icon: faWater,
      title: 'Kualitas',
      description: 'Kami selalu mengutamakan kualitas fasilitas dan pelayanan terbaik'
    },
    {
      icon: faHistory,
      title: 'Kearifan Lokal',
      description: 'Kami melestarikan dan menghormati kearifan lokal masyarakat setempat'
    }
  ];

  return (
    <div className="about-page">
      {/* Header */}
      <div className="page-header">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center text-white">
              <h1 className="display-4 fw-bold">Tentang Kami</h1>
              <p className="lead">
                Mengenal lebih dekat Wisata Air Panas Pemapak, destinasi relaksasi alami di Kalimantan Timur.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Our Story */}
      <section className="our-story py-5">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="section-title">Kisah Kami</h2>
                <div className="divider mx-auto"></div>
                <p className="lead mt-4">
                  Perjalanan Wisata Air Panas Pemapak dari sebuah sumber air panas alami menjadi destinasi wisata terkemuka di Kalimantan Timur.
                </p>
              </motion.div>
            </Col>
          </Row>

          <Row className="align-items-center mb-5">
            <Col lg={6} className="mb-4 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Image 
                  src="/about/story.jpg" 
                  alt="Sejarah Wisata Air Panas Pemapak" 
                  className="img-fluid rounded shadow-lg"
                />
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="mb-4">Dari Hutan Belantara Menjadi Destinasi Wisata</h3>
                <p>
                  Wisata Air Panas Pemapak terletak di desa Biatan Bapinang, Kecamatan Biatan, Kabupaten Berau, 
                  Kalimantan Timur. Sumber air panas ini pertama kali ditemukan oleh masyarakat lokal yang secara 
                  turun-temurun telah memanfaatkannya untuk pengobatan tradisional dan kebutuhan sehari-hari.
                </p>
                <p>
                  Awalnya, lokasi ini hanyalah sebuah sumber air panas alami di tengah hutan belantara yang hanya 
                  diketahui oleh penduduk setempat. Namun seiring berjalannya waktu dan semakin meningkatnya 
                  kesadaran akan nilai wisata dan khasiat penyembuhan dari air panas, pemerintah daerah mulai 
                  mengembangkan area ini menjadi objek wisata.
                </p>
                <p>
                  Dengan investasi dan pengembangan yang berkelanjutan, kini Wisata Air Panas Pemapak telah 
                  bertransformasi menjadi destinasi wisata unggulan dengan berbagai fasilitas modern namun tetap 
                  mempertahankan keindahan alamnya. Perpaduan antara keajaiban alam dengan kenyamanan fasilitas 
                  modern menjadikan tempat ini sebagai tujuan wisata yang menarik untuk dikunjungi.
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Timeline */}
      <section className="timeline-section py-5 bg-light">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="section-title">Perjalanan Kami</h2>
                <div className="divider mx-auto"></div>
              </motion.div>
            </Col>
          </Row>

          <div className="timeline">
            {timeline.map((item, index) => (
              <motion.div 
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="timeline-badge">{item.year}</div>
                <div className="timeline-panel">
                  <div className="timeline-heading">
                    <h4>{item.title}</h4>
                  </div>
                  <div className="timeline-body">
                    <p>{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission & Values */}
      <section className="mission-values-section py-5">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="section-title">Misi & Nilai</h2>
                <div className="divider mx-auto"></div>
              </motion.div>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col lg={6} className="mb-4 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mission-card h-100 p-4 shadow-sm rounded"
              >
                <h3 className="mb-4">Misi Kami</h3>
                <ul className="mission-list">
                  {missions.map((mission, index) => (
                    <li key={index} className="mb-3">
                      {mission}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="vision-card h-100 p-4 shadow-sm rounded"
              >
                <h3 className="mb-4">Visi Kami</h3>
                <p className="lead">
                  "Menjadi destinasi wisata air panas terbaik di Kalimantan Timur yang menawarkan pengalaman relaksasi 
                  alami yang menyehatkan, berkelanjutan, dan memberikan manfaat ekonomi bagi masyarakat sekitar."
                </p>
              </motion.div>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col lg={12} className="text-center mb-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="mb-3">Nilai-nilai Kami</h3>
              </motion.div>
            </Col>

            {values.map((value, index) => (
              <Col md={3} sm={6} className="mb-4" key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="value-box text-center p-4 h-100 shadow-sm rounded"
                >
                  <div className="value-icon mb-3">
                    <FontAwesomeIcon icon={value.icon} size="2x" />
                  </div>
                  <h4 className="value-title">{value.title}</h4>
                  <p className="mb-0">{value.description}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Team Section - Optional */}
      {/* <section className="team-section py-5 bg-light">
        <Container>
          ...
        </Container>
      </section> */}
    </div>
  );
};

export default About;