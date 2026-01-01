// modulator.js - Modul untuk membuat header logo di tengah atas
export const createHeaderLogo = (logoUrl = 'https://lh3.googleusercontent.com/d/1WLOA_paV9DL0rD0fR-ZrhfVEWwVUsGAU') => {
  // Tambahkan style header logo jika belum ada
  if (!document.getElementById('modulator-style')) {
    const style = document.createElement('style');
    style.id = 'modulator-style';
    style.textContent = `
      .header-logo {
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
      }
      .header-logo .logo {
        height: 100px;
        max-width: 200px;
        visibility: hidden;
        transition: opacity 0.3s ease;
        opacity: 0;
      }
      .header-logo .logo.loaded {
        visibility: visible;
        opacity: 1;
      }
      main {
        padding: 120px 20px 20px 20px; /* top padding cukup agar logo tidak menutupi konten */
      }
      @media (max-width: 768px) {
        .header-logo .logo {
          height: 80px;
          max-width: 160px;
        }
        main {
          padding-top: 100px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const header = document.createElement('header');
  header.className = 'header-logo';

  const img = document.createElement('img');
  img.className = 'logo';
  img.src = logoUrl;
  img.alt = 'Logo';

  // Tampilkan logo setelah gambar selesai dimuat
  img.onload = () => img.classList.add('loaded');

  header.appendChild(img);
  document.body.appendChild(header);
};

// Jalankan modul otomatis saat script dimuat
document.addEventListener('DOMContentLoaded', () => {
  createHeaderLogo();
});
