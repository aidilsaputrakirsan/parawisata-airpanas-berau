# Wisata Air Panas Pemapak

![Wisata Air Panas Pemapak Logo](https://github.com/aidilsaputrakirsan/parawisata-airpanas-berau/blob/main/wisata-air-panas-pemapak/src/logo.png)

## 🌟 Overview

Wisata Air Panas Pemapak is a responsive website for a natural hot spring tourist destination located in Biatan Bapinang, Berau, East Kalimantan, Indonesia. The site provides visitors with comprehensive information about the hot springs, including facilities, gallery, booking capabilities, and more.

## ✨ Live Demo

Visit the live website: [https://wisata-air-panas-pemapak.vercel.app/](https://wisata-air-panas-pemapak.vercel.app/)

## 🌴 Features

- **Responsive Design**: Fully optimized for all devices from mobile to desktop
- **Multi-page Layout**: Includes Home, About, Facilities, Gallery, Contact, and Booking pages
- **Interactive Elements**:
  - Animated sections with Framer Motion
  - Image gallery with filtering options
  - Interactive maps using Leaflet
  - Testimonials carousel
- **Booking System**: Complete booking form with validation and payment information
- **Contact Form**: Easy way for visitors to get in touch
- **Interactive Map**: Location information with an embedded map

## 🛠️ Technology Stack

- **Frontend**:
  - React 19
  - React Router v7 for navigation
  - React Bootstrap for UI components
  - FontAwesome for icons
  - Framer Motion for animations
  - CSS with responsive design principles
  
- **Maps & Visualization**:
  - Leaflet for interactive maps

- **API Integration**:
  - Axios for HTTP requests
  - Custom booking service for Google Sheets integration
  - CORS proxy for handling cross-origin requests

- **Deployment**:
  - Vercel for hosting

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16.0.0 or later)
- npm or yarn

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/username/wisata-air-panas-pemapak.git
   cd wisata-air-panas-pemapak
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the CORS proxy (for local development with the booking API):
   ```bash
   node cors-proxy.js
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 📁 Project Structure

```
wisata-air-panas-pemapak/
├── public/                     # Static files
├── src/                        # Source files
│   ├── assets/                 # Images and other static assets
│   │   ├── images/
│   │   │   ├── about/
│   │   │   ├── facilities/
│   │   │   ├── gallery/
│   │   │   ├── page-headers/
│   │   │   └── payment/
│   ├── components/             # Reusable components
│   │   ├── booking/            # Booking-related components
│   │   ├── common/             # Common UI components (Navbar, Footer, etc.)
│   │   └── home/               # Homepage-specific components
│   ├── contexts/               # React contexts
│   ├── pages/                  # Page components
│   │   ├── About.js
│   │   ├── Booking.js
│   │   ├── Contact.js
│   │   ├── Facilities.js
│   │   ├── Gallery.js
│   │   └── Home.js
│   ├── services/               # API services
│   │   └── api.js              # Booking and availability API
│   ├── styles/                 # CSS styles
│   │   ├── components/         # Component-specific styles
│   │   ├── pages/              # Page-specific styles
│   │   └── global.css          # Global styles and variables
│   ├── utils/                  # Utility functions
│   ├── App.js                  # Main App component with routing
│   ├── index.js                # Entry point
│   └── ...                     # Other configuration files
├── cors-proxy.js               # CORS proxy for API requests
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation
```

## 🔧 Configuration

### Booking System

The booking system uses a Google Apps Script backend to process bookings and store data in Google Sheets. To configure this:

1. Update the `GOOGLE_APPS_SCRIPT_URL` in `src/services/api.js` with your own Google Apps Script deployment URL.
2. Ensure the CORS proxy is running for local development to avoid cross-origin issues.

### Maps

The location map is configured with coordinates in `src/components/home/Location.js` and `src/pages/Contact.js`. Update these coordinates to match your actual location:

```javascript
// Example from Location.js
const position = [2.1722, 117.9021]; // Latitude, Longitude
```

## 📦 Build & Deployment

### Building for Production

```bash
npm run build
# or
yarn build
```

This creates a `build` folder with optimized production files.

### Deployment

The site is currently deployed on Vercel. To deploy your own version:

1. Create an account on [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Configure the build settings (default settings work for Create React App)
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Photos from [Unsplash](https://unsplash.com)
- Icons from [FontAwesome](https://fontawesome.com)
- UI Components from [React Bootstrap](https://react-bootstrap.github.io/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

---

© 2025 Wisata Air Panas Pemapak. All Rights Reserved.