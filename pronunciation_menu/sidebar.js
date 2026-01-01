class MySidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Menu Button */
        #menuButton {
          position: fixed;
          top: 20px;
          left: 20px;
          width: 55px;
          height: 55px;
          border-radius: 50%;
          border: 4px solid transparent;
          background-image: linear-gradient(white, white), linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #8134af);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          background-size: 300% 300%;
          animation: gradientMove 4s ease infinite;
          background-color: #fff;
          color: #000;
          font-size: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.18);
          transition: transform 0.25s ease;
          z-index: 1001;
        }

        #menuButton:hover { transform: scale(1.12); }

        /* Sidebar */
        .sidebar {
          position: fixed;
          top: 0;
          left: -270px;
          width: 270px;
          height: 100%;
          background-color: #fff;
          color: #000;
          transition: left 0.3s ease;
          padding-top: 80px;
          z-index: 1000;
          box-shadow: 2px 0 6px rgba(0,0,0,0.1);
        }

        .sidebar.active { left: 0; }

        ul { list-style: none; padding: 0 20px; }

        li {
          position: relative;
          margin: 12px 0;
          padding: 12px 22px;
          border-radius: 999px;
          border: 4px solid transparent;
          background-image: linear-gradient(white, white), linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #8134af);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          background-size: 300% 300%;
          animation: gradientMove 5s ease infinite;
          background-color: #fff;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }

        li:hover {
          transform: scale(1.05);
          background-color: #fafafa;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        li a { color: #000; text-decoration: none; width: 100%; display: flex; align-items: center; }

        .tooltip {
          position: absolute;
          top: 50%;
          left: 105%;
          transform: translateY(-50%);
          background-color: #333;
          color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        li.coming-soon:hover .tooltip { opacity: 1; transform: translateY(-50%) translateX(0); }

        /* Special Logout */
        #logoutItem { color: red; font-weight: bold; }
        #logoutItem:hover { background-color: #fee; }

        /* MOBILE MEDIA QUERY */
        @media (max-width: 600px) {
          #menuButton { width: 45px; height: 45px; font-size: 18px; top: 15px; left: 15px; }
          .sidebar { width: 220px; padding-top: 60px; }
          li { padding: 10px 18px; font-size: 14px; }
          .tooltip {
            left: auto; right: 10px; top: auto; bottom: 10px;
            transform: none; font-size: 10px; padding: 2px 6px;
          }
        }

        @media (max-width: 400px) { .sidebar.active { width: 100%; } }
      </style>

      <button id="menuButton"><i class="fas fa-bars"></i></button>
      <div class="sidebar" id="sidebar">
        <ul>
          <li><a href="dashboard.html"><i class="fas fa-home"></i> Dashboard</a></li>
          <li><a href="pronunciation.html">Pronunciation</a></li>
          <li class="coming-soon">Vocabulary <span class="tooltip">🐱 Coming Soon</span></li>
          <li class="coming-soon">Grammar <span class="tooltip">🐱 Coming Soon</span></li>
          <li class="coming-soon">Speaking <span class="tooltip">🐱 Coming Soon</span></li>
          <li id="logoutItem"><i class="fas fa-sign-out-alt"></i> Logout</li>
        </ul>
      </div>
    `;
  }

  connectedCallback() {
    const menuButton = this.shadowRoot.getElementById('menuButton');
    const sidebar = this.shadowRoot.getElementById('sidebar');
    const content = document.getElementById('content');

    // Toggle sidebar
    menuButton.addEventListener('click', e => {
      e.stopPropagation();
      sidebar.classList.toggle('active');
      if (content && window.innerWidth > 400) content.classList.toggle('shift');
    });

    // Close when clicking outside
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && e.target !== menuButton) {
        sidebar.classList.remove('active');
        if (content) content.classList.remove('shift');
      }
    });

    // Close when clicking content (desktop only)
    if (content) {
      content.addEventListener('click', () => {
        if (window.innerWidth > 400) {
          sidebar.classList.remove('active');
          content.classList.remove('shift');
        }
      });
    }

    // Item click handling
    sidebar.querySelectorAll('li').forEach(item => {
      if (item.classList.contains('coming-soon')) {
        // Mobile: show tooltip, jangan tutup sidebar langsung
        item.addEventListener('click', e => {
          if (window.innerWidth <= 600) {
            e.stopPropagation();
            const tooltip = item.querySelector('.tooltip');
            if (tooltip) {
              tooltip.style.opacity = '1';
              setTimeout(() => { tooltip.style.opacity = '0'; }, 1500);
            }
          } else {
            sidebar.classList.remove('active');
            if (content) content.classList.remove('shift');
          }
        });
      } else {
        // Normal item: tutup sidebar
        item.addEventListener('click', () => {
          sidebar.classList.remove('active');
          if (content && window.innerWidth > 400) content.classList.remove('shift');
        });
      }
    });

    // Swipe to close sidebar (mobile)
    let touchStartX = 0;
    sidebar.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; });
    sidebar.addEventListener('touchend', e => {
      let touchEndX = e.changedTouches[0].clientX;
      if (window.innerWidth <= 600 && touchEndX - touchStartX < -50) {
        sidebar.classList.remove('active');
        if (content) content.classList.remove('shift');
      }
    });

    // Logout
    const logoutItem = this.shadowRoot.getElementById('logoutItem');
    logoutItem.addEventListener('click', () => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = 'login.html';
    });
  }
}

customElements.define('my-sidebar', MySidebar);
