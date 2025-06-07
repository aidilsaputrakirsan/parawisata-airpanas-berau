import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpa, 
  faWater, 
  faLeaf, 
  faMountain 
} from '@fortawesome/free-solid-svg-icons';
import aboutImage from '../../assets/images/about.jpg'

const AboutSection = () => {
  const features = [
    {
      icon: faSpa,
      title: 'Pemandian Air Panas Asin Alami',
      description: 'Kolam air panas asin dengan sumber alami mengandung mineral yang baik untuk kesehatan.'
    },
    {
      icon: faWater,
      title: 'Berendam Menyehatkan',
      description: 'Air panas asin kaya akan mineral yang membantu relaksasi otot dan melancarkan peredaran darah.'
    },
    {
      icon: faLeaf,
      title: 'Suasana yang Asri',
      description: 'Dikelilingi oleh pepohonan dan suasana alam yang menenangkan.'
    },
    {
      icon: faMountain,
      title: 'Pemandangan Indah',
      description: 'Nikmati keindahan alam Kalimantan Timur langsung dari lokasi pemandian.'
    }
  ];

  return (
    <section className="about-section py-5">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">Tentang Wisata Air Panas Asin Pemapak</h2>
              <div className="divider mx-auto"></div>
              <p className="lead mt-4">
                Wisata Air Panas Asin Pemapak merupakan destinasi wisata alam yang menawarkan 
                pengalaman berendam di kolam air panas alami dengan pemandangan alam yang indah.
              </p>
            </motion.div>
          </Col>
        </Row>

        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Image 
                src={aboutImage}
                alt="Wisata Air Panas Asin Pemapak" 
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
              <h3 className="mb-4">Pengalaman Pemandian Air Panas Asin Terbaik di Kalimantan Timur</h3>
              <p>
                Sumber air panas asin pemapak merupakan salah satu keajaiban alam yang terletak di 
                Desa Biatan Bapinang, Kecamatan Biatan, Kabupaten Berau, Kalimantan Timur. 
                Air panas ini keluar langsung dari perut bumi dengan suhu yang ideal untuk berendam.
              </p>
              <p>
                Dengan kandungan mineral alami dan garam yang tinggi, air panas asin di sini dipercaya 
                memiliki khasiat untuk menyembuhkan berbagai penyakit kulit, melancarkan peredaran darah, dan 
                membantu relaksasi tubuh, sehingga air panas asin pemapak merupakan salah satu wisata healing dan
                wellness tourism terbaik di Kalimantan Timur. Dikelilingi oleh pepohonan rindang dan suasana yang sejuk, 
                tempat ini menjadi oase di tengah kehidupan yang sibuk.
              </p>
              <p>
                Kami menyediakan berbagai fasilitas yang memadai untuk membuat pengunjung nyaman 
                selama menikmati pengalaman berendam di air panas. Nikmati momen bersantai bersama 
                keluarga dan teman di Wisata Air Panas Asin Pemapak.
              </p>
            </motion.div>
          </Col>
        </Row>

        <Row className="mt-5 pt-4">
          {features.map((feature, index) => (
            <Col md={3} sm={6} className="mb-4" key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="feature-box text-center p-4 h-100"
              >
                <div className="icon-box mx-auto mb-4">
                  <FontAwesomeIcon icon={feature.icon} size="2x" />
                </div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="mb-0">{feature.description}</p>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;