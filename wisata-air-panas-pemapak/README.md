# Wisata Air Panas Pemapak

![Wisata Air Panas Pemapak Logo](https://github.com/aidilsaputrakirsan/parawisata-airpanas-berau/blob/main/wisata-air-panas-pemapak/src/logo.png)

## 🌟 Gambaran Umum

Wisata Air Panas Pemapak adalah situs web responsif untuk destinasi wisata sumber air panas alami yang terletak di Biatan Bapinang, Berau, Kalimantan Timur, Indonesia. Situs ini menyediakan informasi lengkap tentang pemandian air panas, termasuk fasilitas, galeri, kemampuan pemesanan, dan banyak lagi.

## ✨ Demo Langsung

Kunjungi situs web langsung: [https://wisata-air-panas-pemapak.vercel.app/](https://wisata-air-panas-pemapak.vercel.app/)

## 🌴 Fitur

- **Desain Responsif**: Dioptimalkan untuk semua perangkat dari mobile hingga desktop
- **Tata Letak Multi-halaman**: Mencakup halaman Beranda, Tentang, Fasilitas, Galeri, Kontak, dan Pemesanan
- **Elemen Interaktif**:
  - Bagian animasi dengan Framer Motion
  - Galeri gambar dengan opsi pemfilteran
  - Peta interaktif menggunakan Leaflet
  - Carousel testimonial
- **Sistem Pemesanan**: Formulir pemesanan lengkap dengan validasi dan informasi pembayaran
- **Formulir Kontak**: Cara mudah bagi pengunjung untuk menghubungi
- **Peta Interaktif**: Informasi lokasi dengan peta tertanam
- **Panel Admin**: Panel administrasi khusus untuk mengelola pemesanan dan memantau aktivitas situs
  - Dasbor dengan ringkasan pemesanan
  - Manajemen status pemesanan
  - Sistem autentikasi admin
  - Antarmuka responsif untuk pengelolaan di perangkat apa pun

## 🛠️ Teknologi yang Digunakan

- **Frontend**:
  - React 19
  - React Router v7 untuk navigasi
  - React Bootstrap untuk komponen UI
  - FontAwesome untuk ikon
  - Framer Motion untuk animasi
  - CSS dengan prinsip desain responsif
  
- **Peta & Visualisasi**:
  - Leaflet untuk peta interaktif

- **Integrasi API**:
  - Axios untuk permintaan HTTP
  - Layanan pemesanan kustom untuk integrasi Google Sheets
  - CORS proxy untuk menangani permintaan lintas-asal

- **Deployment**:
  - Vercel untuk hosting

## 🚀 Instalasi & Pengaturan

### Prasyarat
- Node.js (v16.0.0 atau lebih baru)
- npm atau yarn

### Langkah-langkah Instalasi

1. Clone repositori:
   ```bash
   git clone https://github.com/username/wisata-air-panas-pemapak.git
   cd wisata-air-panas-pemapak
   ```

2. Instalasi dependensi:
   ```bash
   npm install
   # atau
   yarn install
   ```

3. Siapkan CORS proxy (untuk pengembangan lokal dengan API pemesanan):
   ```bash
   node cors-proxy.js
   ```

4. Mulai server pengembangan:
   ```bash
   npm start
   # atau
   yarn start
   ```

5. Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi di browser Anda.

## 📁 Struktur Proyek

```
wisata-air-panas-pemapak/
├── public/                     # File statis
├── src/                        # File sumber
│   ├── assets/                 # Gambar dan aset statis lainnya
│   │   ├── images/
│   │   │   ├── about/
│   │   │   ├── facilities/
│   │   │   ├── gallery/
│   │   │   ├── page-headers/
│   │   │   └── payment/
│   ├── components/             # Komponen yang dapat digunakan kembali
│   │   ├── booking/            # Komponen terkait pemesanan
│   │   ├── common/             # Komponen UI umum (Navbar, Footer, dll.)
│   │   └── home/               # Komponen khusus halaman beranda
│   ├── contexts/               # Context React
│   ├── pages/                  # Komponen halaman
│   │   ├── About.js
│   │   ├── Booking.js
│   │   ├── Contact.js
│   │   ├── Facilities.js
│   │   ├── Gallery.js
│   │   └── Home.js
│   ├── admin/                  # Panel administrasi
│   │   ├── components/         # Komponen admin
│   │   │   ├── AdminLayout.js  # Tata letak utama admin
│   │   │   ├── BookingList.js  # Manajemen daftar pemesanan
│   │   │   ├── Dashboard.js    # Dasbor statistik admin
│   │   │   └── Login.js        # Komponen login admin
│   │   ├── pages/              # Halaman admin
│   │   │   ├── bookings.js     # Halaman manajemen pemesanan
│   │   │   ├── dashboard.js    # Halaman dasbor admin
│   │   │   ├── index.js        # Halaman indeks admin
│   │   │   └── login.js        # Halaman login admin
│   │   ├── styles/             # Gaya admin
│   │   │   └── admin.css       # Stylesheet admin
│   │   └── utils/              # Utilitas admin
│   │       └── authContext.js  # Context otentikasi admin
│   ├── services/               # Layanan API
│   │   └── api.js              # API pemesanan dan ketersediaan
│   ├── styles/                 # Gaya CSS
│   │   ├── components/         # Gaya khusus komponen
│   │   ├── pages/              # Gaya khusus halaman
│   │   └── global.css          # Gaya global dan variabel
│   ├── utils/                  # Fungsi utilitas
│   ├── App.js                  # Komponen App utama dengan routing
│   ├── index.js                # Titik masuk
│   └── ...                     # File konfigurasi lainnya
├── cors-proxy.js               # Proxy CORS untuk permintaan API
├── package.json                # Dependensi dan skrip proyek
└── README.md                   # Dokumentasi proyek
```

## 🔧 Konfigurasi

### Sistem Pemesanan

Sistem pemesanan menggunakan backend Google Apps Script untuk memproses pemesanan dan menyimpan data di Google Sheets. Untuk mengonfigurasi ini:

1. Perbarui `GOOGLE_APPS_SCRIPT_URL` di `src/services/api.js` dengan URL deployment Google Apps Script Anda sendiri.
2. Pastikan CORS proxy berjalan untuk pengembangan lokal untuk menghindari masalah lintas-asal.

### CORS Proxy

Proyek ini menggunakan server proxy CORS kustom untuk menangani permintaan API ke Google Apps Script. File `cors-proxy.js` menyediakan:

1. Penanganan otentikasi admin
2. Proxy untuk permintaan pemesanan
3. Pengelolaan data pemesanan

Untuk menggunakan proxy:
```bash
node cors-proxy.js
```

Server proxy akan berjalan di `localhost:8080`.

### Peta

Peta lokasi dikonfigurasi dengan koordinat di `src/components/home/Location.js` dan `src/pages/Contact.js`. Perbarui koordinat ini agar sesuai dengan lokasi Anda yang sebenarnya:

```javascript
// Contoh dari Location.js
const position = [2.1722, 117.9021]; // Latitude, Longitude
```

### Panel Admin

Panel admin dilindungi dengan otentikasi. Untuk mengakses panel admin:

1. Buka `/admin` di situs web Anda
2. Masuk menggunakan kredensial admin yang dikonfigurasi di `src/config/api.js` 
3. Kelola pemesanan dan pantau aktivitas situs

## 📦 Build & Deployment

### Building untuk Produksi

```bash
npm run build
# atau
yarn build
```

Ini membuat folder `build` dengan file produksi yang dioptimalkan.

### Deployment

Situs ini saat ini di-deploy di Vercel. Untuk men-deploy versi Anda sendiri:

1. Buat akun di [Vercel](https://vercel.com)
2. Hubungkan repositori GitHub Anda
3. Konfigurasikan pengaturan build (pengaturan default berfungsi untuk Create React App)
4. Deploy!

## 🤝 Kontribusi

Kontribusi dipersilakan! Jangan ragu untuk mengirimkan Pull Request.

1. Fork repositori
2. Buat branch fitur Anda (`git checkout -b feature/amazing-feature`)
3. Commit perubahan Anda (`git commit -m 'Add some amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

## 📝 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file LICENSE untuk detailnya.

## 👥 Penulis

- **Aidil Saputra Kirsan** - *Karya awal* - [YourGitHub](https://github.com/aidilsaputrakirsan)

## 🙏 Ucapan Terima Kasih

- Foto dari [Unsplash](https://unsplash.com)
- Ikon dari [FontAwesome](https://fontawesome.com)
- Komponen UI dari [React Bootstrap](https://react-bootstrap.github.io/)
- Animasi oleh [Framer Motion](https://www.framer.com/motion/)

---

© 2025 Wisata Air Panas Pemapak. Semua Hak Dilindungi.