import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faUsers, 
  faMoneyBillWave, 
  faQrcode, 
  faUpload 
} from '@fortawesome/free-solid-svg-icons';
import bookingService from '../../services/api';
import '../../styles/components/booking-form.css';
import bcaQrCode from '../../assets/images/payment/bca-qr.png';
import mandiriQrCode from '../../assets/images/payment/mandiri-qr.png';

const BookingForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  
  // QR Code dan detail rekening untuk pembayaran
  const paymentMethods = [
    {
      bank: 'Bank BCA',
      accountNumber: '1234567890',
      accountName: 'PT. Wisata Air Panas Pemapak',
      qrCodeImage: bcaQrCode
    },
    {
      bank: 'Bank Mandiri',
      accountNumber: '0987654321',
      accountName: 'PT. Wisata Air Panas Pemapak',
      qrCodeImage: mandiriQrCode
    }
  ];

  // Daftar harga
  const priceList = {
    adult: 25000, // Rp 25.000 per dewasa
    child: 15000  // Rp 15.000 per anak
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
        alert('Ukuran file terlalu besar. Maksimal 2MB.');
        e.target.value = null;
        return;
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
      // Gabungkan data form dengan data jumlah pengunjung
      const formData = {
        ...data,
        adults: visitors.adults,
        children: visitors.children,
        totalAmount: totalPrice
      };
      
      // Kirim data ke API
      const response = await bookingService.submitBooking(formData, selectedFile);
      
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
      setSubmitError('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
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
                        <Form.Label>Waktu Kunjungan</Form.Label>
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
                          Rp {priceList.adult.toLocaleString()} per orang
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
                          Rp {priceList.child.toLocaleString()} per anak (5-12 tahun)
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
              <Card.Body className="p-4">
                <Card.Title className="mb-4">
                  <FontAwesomeIcon icon={faQrcode} className="me-2" />
                  Informasi Pembayaran
                </Card.Title>
                <p>
                  Silakan lakukan pembayaran melalui salah satu metode di bawah ini:
                </p>
                
                {paymentMethods.map((method, index) => (
                  <div key={index} className="payment-method mb-3 pb-3">
                    <h5>{method.bank}</h5>
                    <p className="mb-2">No. Rekening: <strong>{method.accountNumber}</strong></p>
                    <p className="mb-3">Atas Nama: <strong>{method.accountName}</strong></p>
                    <div className="text-center mb-2">
                      <img 
                        src={method.qrCodeImage} 
                        alt={`QR Code ${method.bank}`}
                        className="qr-code-image"
                      />
                    </div>
                    <p className="text-center small text-muted">
                      Scan QR Code untuk membayar
                    </p>
                    {index < paymentMethods.length - 1 && <hr />}
                  </div>
                ))}
                
                <Alert variant="info" className="mb-0">
                  <strong>Catatan:</strong> Setelah melakukan pembayaran, jangan lupa untuk mengunggah bukti pembayaran pada form di samping.
                </Alert>
              </Card.Body>
            </Card>
            
            <Card className="booking-info-card shadow-lg">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Informasi Booking</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <p>
                  <strong>Jam Operasional:</strong><br />
                  Setiap hari: 08:00 - 17:00 WITA
                </p>
                <p>
                  <strong>Ketentuan Pemesanan:</strong>
                </p>
                <ul>
                  <li>Pembayaran harus dilakukan minimal 1 hari sebelum tanggal kunjungan</li>
                  <li>Bukti pemesanan akan dikirimkan melalui email setelah pembayaran dikonfirmasi</li>
                  <li>Pembatalan pemesanan dapat dilakukan maksimal 3 hari sebelum tanggal kunjungan untuk mendapatkan refund 50%</li>
                  <li>Jika terjadi force majeure, pemesanan dapat dijadwalkan ulang</li>
                </ul>
                <p className="mb-0">
                  <strong>Kontak Bantuan:</strong><br />
                  WhatsApp: <a href="https://wa.me/6281234567890">+62 812-3456-7890</a><br />
                  Email: <a href="mailto:booking@wisataairpanaspemapak.com">booking@wisataairpanaspemapak.com</a>
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