import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faUsers, 
  faMoneyBillWave, 
  faCreditCard, 
  faUpload,
  faInfoCircle,
  faCheckCircle,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import bookingService from '../../services/api';
import '../../styles/components/booking-form.css';

const BookingForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  
  // Informasi pembayaran - DIUPDATE
  const paymentInfo = {
    bank: 'Bankaltimtara',
    accountNumber: '0062454032',
    accountName: 'BUMK Bapinang Sejahtera'
  };

  // Daftar harga - DIUPDATE
  const priceList = {
    adult: 35000, // Rp 35.000 per dewasa
    child: 5000   // Rp 5.000 per anak
  };

  // State untuk menghitung total harga
  const [visitors, setVisitors] = useState({
    adults: 1,
    children: 0
  });

  // Ambil data ketersediaan saat komponen dimount
  useEffect(() => {
    fetchAvailability();
  }, []);

  // Fungsi untuk mengambil data ketersediaan
  const fetchAvailability = async () => {
    try {
      setIsLoadingAvailability(true);
      const response = await bookingService.getAvailability();
      if (response.status === 'success') {
        setAvailability(response.data);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  // Hitung total harga
  const totalPrice = (visitors.adults * priceList.adult) + (visitors.children * priceList.child);

  // Handle perubahan jumlah pengunjung
  const handleVisitorChange = (e) => {
    const { name, value } = e.target;
    setVisitors({
      ...visitors,
      [name]: parseInt(value, 10)
    });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        // Tampilkan peringatan tetapi tetap terima file (kompres nanti)
        alert('Ukuran file besar (lebih dari 2MB). File akan dikompresi saat diunggah.');
      }
      
      // Validasi tipe file (hanya gambar)
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diperbolehkan (JPEG, PNG, GIF).');
        e.target.value = null;
        return;
      }
      
      setSelectedFile(file);
      
      // Buat preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
      console.log(`File dipilih: ${file.name}, ukuran: ${file.size} bytes, tipe: ${file.type}`);
    }
  };

  // Submit form
  const onSubmit = async (data) => {
    if (!selectedFile) {
      setSubmitError('Silakan unggah bukti pembayaran terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Tambahkan log untuk debugging
      console.log("Mulai proses submit booking");
      console.log(`File yang dipilih: ${selectedFile.name}, ukuran: ${selectedFile.size} bytes`);
      
      // Gabungkan data form dengan data jumlah pengunjung
      const formData = {
        ...data,
        adults: visitors.adults,
        children: visitors.children,
        totalAmount: totalPrice
      };
      
      console.log("Data form yang dikirim:", formData);
      
      // Kirim data ke API
      const response = await bookingService.submitBooking(formData, selectedFile);
      console.log("Response dari API:", response);
      
      if (response.status === 'success') {
        setSubmitSuccess(true);
        reset();
        setSelectedFile(null);
        setPreviewUrl(null);
        setVisitors({ adults: 1, children: 0 });
        
        // Reset success message setelah 5 detik
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        setSubmitError('Terjadi kesalahan saat mengirim data. Detail: ' + response.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Tampilkan detail error untuk debugging
      let errorMessage = 'Terjadi kesalahan saat mengirim data.';
      
      if (error.response) {
        errorMessage += ` Status: ${error.response.status}`;
        if (error.response.data && error.response.data.message) {
          errorMessage += `, Detail: ${error.response.data.message}`;
        }
      } else if (error.request) {
        errorMessage += ' Tidak ada response dari server.';
      } else {
        errorMessage += ` Detail: ${error.message}`;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-5">
        <Col lg={8} className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Form Pemesanan</h2>
            <div className="divider mx-auto"></div>
            <p className="lead mt-4">
              Silakan isi form pemesanan di bawah ini untuk menikmati pengalaman berendam di Wisata Air Panas Pemapak.
            </p>
          </motion.div>
        </Col>
      </Row>

      <Row>
        <Col lg={7} className="mb-5 mb-lg-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="booking-form-card shadow-lg">
              <Card.Body className="p-4 p-md-5">                
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-4">
                    <Form.Label>Nama Lengkap</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Masukkan nama lengkap Anda"
                      {...register('fullName', { required: 'Nama lengkap wajib diisi' })}
                      isInvalid={!!errors.fullName}
                    />
                    {errors.fullName && (
                      <Form.Control.Feedback type="invalid">
                        {errors.fullName.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                          type="email" 
                          placeholder="Masukkan email Anda"
                          {...register('email', { 
                            required: 'Email wajib diisi',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Format email tidak valid'
                            }
                          })}
                          isInvalid={!!errors.email}
                        />
                        {errors.email && (
                          <Form.Control.Feedback type="invalid">
                            {errors.email.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>No. Telepon</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Masukkan nomor telepon Anda"
                          {...register('phone', { 
                            required: 'Nomor telepon wajib diisi',
                            pattern: {
                              value: /^[0-9+-]+$/,
                              message: 'Nomor telepon hanya boleh berisi angka, +, dan -'
                            }
                          })}
                          isInvalid={!!errors.phone}
                        />
                        {errors.phone && (
                          <Form.Control.Feedback type="invalid">
                            {errors.phone.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>
                          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                          Tanggal Kunjungan
                        </Form.Label>
                        <Form.Control 
                          type="date" 
                          {...register('visitDate', { required: 'Tanggal kunjungan wajib diisi' })}
                          isInvalid={!!errors.visitDate}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.visitDate && (
                          <Form.Control.Feedback type="invalid">
                            {errors.visitDate.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>
                          <FontAwesomeIcon icon={faClock} className="me-2" />
                          Waktu Kunjungan
                        </Form.Label>
                        <Form.Select 
                          {...register('visitTime', { required: 'Waktu kunjungan wajib diisi' })}
                          isInvalid={!!errors.visitTime}
                        >
                          <option value="">Pilih Waktu</option>
                          <option value="08:00">08:00 - 10:00</option>
                          <option value="10:00">10:00 - 12:00</option>
                          <option value="13:00">13:00 - 15:00</option>
                          <option value="15:00">15:00 - 17:00</option>
                        </Form.Select>
                        {errors.visitTime && (
                          <Form.Control.Feedback type="invalid">
                            {errors.visitTime.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>
                          <FontAwesomeIcon icon={faUsers} className="me-2" />
                          Jumlah Pengunjung (Dewasa)
                        </Form.Label>
                        <Form.Control 
                          type="number" 
                          min="1"
                          max="20"
                          value={visitors.adults}
                          onChange={handleVisitorChange}
                          name="adults"
                          isInvalid={visitors.adults < 1}
                        />
                        <Form.Text className="text-muted">
                          Rp {priceList.adult.toLocaleString()} per orang (umur 17 tahun ke atas)
                        </Form.Text>
                        {visitors.adults < 1 && (
                          <Form.Control.Feedback type="invalid">
                            Minimal 1 pengunjung dewasa
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>
                          <FontAwesomeIcon icon={faUsers} className="me-2" />
                          Jumlah Pengunjung (Anak-anak)
                        </Form.Label>
                        <Form.Control 
                          type="number" 
                          min="0"
                          max="20"
                          value={visitors.children}
                          onChange={handleVisitorChange}
                          name="children"
                        />
                        <Form.Text className="text-muted">
                          Rp {priceList.child.toLocaleString()} per anak (umur 6-16 tahun)
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Catatan Tambahan</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3}
                      placeholder="Masukkan catatan tambahan jika ada"
                      {...register('notes')}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      <FontAwesomeIcon icon={faUpload} className="me-2" />
                      Unggah Bukti Pembayaran
                    </Form.Label>
                    <Form.Control 
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Form.Text className="text-muted">
                      Format yang diterima: JPG, PNG, JPEG. Maks. ukuran: 2MB
                    </Form.Text>
                    
                    {previewUrl && (
                      <div className="mt-3 payment-preview">
                        <p className="mb-2">Preview Bukti Pembayaran:</p>
                        <img 
                          src={previewUrl} 
                          alt="Preview bukti pembayaran" 
                          className="img-thumbnail" 
                          style={{ maxHeight: '200px' }}
                        />
                      </div>
                    )}
                  </Form.Group>

                  <div className="total-price-box mb-4 p-3">
                    <h5 className="d-flex justify-content-between align-items-center mb-0">
                      <span>
                        <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                        Total Pembayaran:
                      </span>
                      <span>Rp {totalPrice.toLocaleString()}</span>
                    </h5>
                  </div>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    className="w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sedang Mengirim...' : 'Kirim Pemesanan'}
                  </Button>
                </Form>
                {submitSuccess && (
                  <Alert variant="success" className="mb-4">
                    <strong>Pemesanan berhasil dikirim!</strong> Terima kasih atas pemesanan Anda. 
                    Kami telah mengirimkan email konfirmasi ke alamat email yang Anda berikan. 
                    Tim kami akan memverifikasi pembayaran Anda dalam waktu 1x24 jam.
                  </Alert>
                )}
                
                {submitError && (
                  <Alert variant="danger" className="mb-4">
                    {submitError}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        <Col lg={5}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="payment-info-card shadow-lg mb-4">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                  Informasi Pembayaran
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="payment-details bg-light p-3 rounded mb-3">
                  <div className="d-flex align-items-center mb-3">
                    <div className="icon-circle bg-primary text-white me-3">
                      <FontAwesomeIcon icon={faMoneyBillWave} />
                    </div>
                    <h5 className="mb-0">Detail Rekening</h5>
                  </div>
                  <div className="ps-4 ms-2 mb-3 border-start border-primary">
                    <p className="mb-1"><strong>Bank:</strong> {paymentInfo.bank}</p>
                    <p className="mb-1"><strong>No. Rekening:</strong> <span className="fw-bold text-primary">{paymentInfo.accountNumber}</span></p>
                    <p className="mb-0"><strong>Atas Nama:</strong> {paymentInfo.accountName}</p>
                  </div>
                  
                  <div className="d-flex align-items-center mb-3">
                    <div className="icon-circle bg-success text-white me-3">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <h5 className="mb-0">Langkah Pembayaran</h5>
                  </div>
                  <ol className="ps-4 ms-2 border-start border-success mb-0">
                    <li className="mb-2">Transfer sejumlah <strong>Rp {totalPrice.toLocaleString()}</strong> ke rekening di atas</li>
                    <li className="mb-2">Simpan bukti transfer Anda</li>
                    <li className="mb-2">Unggah bukti transfer pada form pemesanan</li>
                    <li className="mb-0">Kirim form pemesanan Anda</li>
                  </ol>
                </div>
                
                <Alert variant="info" className="mb-0">
                  <div className="d-flex">
                    <div className="me-3">
                      <FontAwesomeIcon icon={faInfoCircle} size="lg" />
                    </div>
                    <div>
                      <strong>Catatan Penting:</strong> 
                      <p className="mb-0 mt-1">Setelah melakukan pembayaran, jangan lupa untuk mengunggah bukti pembayaran pada form di samping untuk konfirmasi pemesanan Anda.</p>
                    </div>
                  </div>
                </Alert>
              </Card.Body>
            </Card>
            
            <Card className="booking-info-card shadow-lg mb-4">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                  Informasi Harga
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="price-category mb-3">
                  <h6 className="border-bottom pb-2 mb-3">Harga Tiket Masuk:</h6>
                  <ul className="list-unstyled pricing-list">
                    <li className="d-flex justify-content-between align-items-center py-2">
                      <span>Dewasa (17+ tahun)</span>
                      <span className="badge bg-primary rounded-pill">Rp 35.000</span>
                    </li>
                    <li className="d-flex justify-content-between align-items-center py-2">
                      <span>Anak (6-16 tahun)</span>
                      <span className="badge bg-primary rounded-pill">Rp 5.000</span>
                    </li>
                    <li className="d-flex justify-content-between align-items-center py-2">
                      <span>Balita (0-5 tahun)</span>
                      <span className="badge bg-success rounded-pill">Gratis</span>
                    </li>
                  </ul>
                </div>
                
                <div className="price-category">
                  <h6 className="border-bottom pb-2 mb-3">Fasilitas Tambahan:</h6>
                  <ul className="list-unstyled pricing-list">
                    <li className="d-flex justify-content-between align-items-center py-2">
                      <span>Onsen (per jam)</span>
                      <span className="badge bg-primary rounded-pill">Rp 100.000</span>
                    </li>
                  </ul>
                  <p className="small text-muted mt-2 fst-italic">
                    *Pembayaran fasilitas onsen dilakukan langsung di lokasi
                  </p>
                </div>
              </Card.Body>
            </Card>
            
            <Card className="booking-info-card shadow-lg">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  Informasi Booking
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <p>
                <strong>Jam Operasional Booking dan Wisata:</strong><br />
                Sistem booking tersedia 24 jam setiap hari.<br />
                Tempat wisata beroperasi setiap hari dari pukul 08:00 - 18:00 WITA.
                </p>
                <p>
                  <strong>Ketentuan Pemesanan:</strong>
                </p>
                <ul>
                  <li>Pembayaran harus dilakukan minimal 1 hari sebelum tanggal kunjungan</li>
                  <li>Bukti pemesanan akan dikirimkan melalui email setelah pembayaran dikonfirmasi</li>
                </ul>
                <p className="mb-0">
                  <strong>Kontak Bantuan:</strong><br />
                  WhatsApp: <a href="https://wa.me/6282148071726">+62 821-4807-1726</a><br />
                  Email: <a href="mailto:wisataairpanasasinpemapak@gmail.com">wisataairpanasasinpemapak@gmail.com</a>
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingForm;