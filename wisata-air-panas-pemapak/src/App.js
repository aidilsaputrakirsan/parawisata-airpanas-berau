import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';

// Import pages
import Home from './pages/Home';
import About from './pages/About';
import Facilities from './pages/Facilities';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Booking from './pages/Booking';

// Import admin pages
import AdminDashboard from './admin/pages/dashboard';
import AdminLogin from './admin/pages/login';
import AdminBookings from './admin/pages/bookings';

// Import Auth Provider for Admin
import { AuthProvider } from './admin/utils/authContext';

// Import common components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

function App() {
  // Check if we're on an admin page
  const isAdminPage = () => {
    return window.location.pathname.startsWith('/admin');
  };

  return (
    <Router>
      <div className="app">
        {/* Only show Navbar and Footer on non-admin pages */}
        {!isAdminPage() && <Navbar />}
        
        <main>
          <Routes>
            {/* Main website routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            
            {/* Admin routes wrapped with AuthProvider */}
            <Route path="/admin" element={
              <AuthProvider>
                <AdminDashboard />
              </AuthProvider>
            } />
            <Route path="/admin/login" element={
              <AuthProvider>
                <AdminLogin />
              </AuthProvider>
            } />
            <Route path="/admin/dashboard" element={
              <AuthProvider>
                <AdminDashboard />
              </AuthProvider>
            } />
            <Route path="/admin/bookings" element={
              <AuthProvider>
                <AdminBookings />
              </AuthProvider>
            } />
          </Routes>
        </main>
        
        {!isAdminPage() && <Footer />}
      </div>
    </Router>
  );
}

export default App;