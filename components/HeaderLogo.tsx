import React, { useEffect } from 'react';

const HeaderLogo: React.FC = () => {
  useEffect(() => {
    // Add styles if not present
    if (!document.getElementById('header-logo-style')) {
      const style = document.createElement('style');
      style.id = 'header-logo-style';
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
          padding: 120px 20px 20px 20px;
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


  }, []);

  return (
    <header className="header-logo">
      <img
        className="logo"
        src="https://lh3.googleusercontent.com/d/1WLOA_paV9DL0rD0fR-ZrhfVEWwVUsGAU"
        alt="Logo"
        onLoad={(e) => e.currentTarget.classList.add('loaded')}
      />
    </header>
  );
};

export default HeaderLogo;
