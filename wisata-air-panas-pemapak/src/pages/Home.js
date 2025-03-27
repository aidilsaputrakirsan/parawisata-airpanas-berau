import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import AboutSection from '../components/home/About';
import FacilitiesSection from '../components/home/Facilities';
import GallerySection from '../components/home/Gallery';
import LocationSection from '../components/home/Location';
import TestimonialSection from '../components/home/Testimonial';
import '../styles/pages/home.css';

const Home = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Wisata Air Panas Pemapak - Destinasi Wisata Alam di Berau';
  }, []);

  return (
    <div className="home-page">
      <Hero />
      <AboutSection />
      <FacilitiesSection />
      <GallerySection />
      <TestimonialSection />
      <LocationSection />
    </div>
  );
};

export default Home;