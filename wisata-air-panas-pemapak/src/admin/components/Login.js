import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/authContext';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup,
} from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Kredensial tidak valid');
      }
    } catch (err) {
      setError('Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="admin-login-bg py-5 min-vh-100 d-flex align-items-center">
      <Row className="justify-content-center w-100">
        <Col md={8} lg={6} xl={5} xxl={4}>
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="text-center p-5 bg-dark text-white">
              <div className="login-icon-wrap mb-4">
                <i className="fas fa-hot-tub fa-3x"></i>
              </div>
              <h3 className="mb-2 fw-bold">Wisata Air Panas Pemapak</h3>
              <p className="lead mb-0">Panel Admin</p>
            </div>
            <Card.Body className="p-5">
              {error && (
                <Alert variant="danger" className="d-flex align-items-center mb-4">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Email</Form.Label>
                  <InputGroup className="shadow-sm rounded overflow-hidden">
                    <InputGroup.Text className="bg-light border-0">
                      <i className="fas fa-envelope text-muted"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="Masukkan email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="py-2 border-0"
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Kata Sandi</Form.Label>
                  <InputGroup className="shadow-sm rounded overflow-hidden">
                    <InputGroup.Text className="bg-light border-0">
                      <i className="fas fa-lock text-muted"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="py-2 border-0"
                    />
                  </InputGroup>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 fw-medium mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sedang Masuk...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Masuk
                    </>
                  )}
                </Button>
              </Form>
              
              <div className="text-center mt-4">
                <a href="/" className="text-decoration-none text-muted">
                  <i className="fas fa-arrow-left me-1"></i> Kembali ke Situs Utama
                </a>
              </div>
            </Card.Body>
          </Card>
          
          <div className="text-center text-white mt-4">
            <p className="mb-0 small">© 2025 Wisata Air Panas Pemapak. Semua Hak Dilindungi.</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;