import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const showTooltip = (item: HTMLElement) => {
    const tooltip = item.querySelector('.tooltip') as HTMLElement;
    if (tooltip) {
      tooltip.style.opacity = '1';
      setTimeout(() => {
        tooltip.style.opacity = '0';
      }, 1500);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.sidebar') && !target.closest('.menu-button')) {
        closeSidebar();
      }
    };

    // Close sidebar when clicking content (desktop only)
    const handleContentClick = () => {
      if (window.innerWidth > 400) {
        closeSidebar();
      }
    };

    document.addEventListener('click', handleClickOutside);
    // Assuming there's a content area, but since we don't have it in this component,
    // we'll handle it differently. For now, clicking outside should work.

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Menu Button */}
      <button
        className="menu-button"
        onClick={(e) => {
          e.stopPropagation();
          toggleSidebar();
        }}
      >
        <img
          src="https://lh3.googleusercontent.com/d/1WLOA_paV9DL0rD0fR-ZrhfVEWwVUsGAU=s200"
          alt="Menu"
        />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <ul>
          <li onClick={() => handleNavigation('/dashboard')}>
            <i className="fas fa-home"></i> Dashboard
          </li>
          <li onClick={() => handleNavigation('/pronunciation-menu')}>
            Pronunciation
          </li>
          <li className="coming-soon" onClick={(e) => {
            e.stopPropagation();
            showTooltip(e.currentTarget);
          }}>
            Vocabulary
            <span className="tooltip">🐱 Coming Soon</span>
          </li>
          <li className="coming-soon" onClick={(e) => {
            e.stopPropagation();
            showTooltip(e.currentTarget);
          }}>
            Grammar
            <span className="tooltip">🐱 Coming Soon</span>
          </li>
          <li className="coming-soon" onClick={(e) => {
            e.stopPropagation();
            showTooltip(e.currentTarget);
          }}>
            Speaking
            <span className="tooltip">🐱 Coming Soon</span>
          </li>
          <li id="logoutItem" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </li>
        </ul>
      </div>

      <style jsx>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Menu Button */
        .menu-button {
          position: fixed;
          top: 20px;
          left: 20px;
          width: 55px;
          height: 55px;
          border-radius: 50%;
          border: 4px solid transparent;
          background-image: linear-gradient(black, black), linear-gradient(45deg, #6366f1, #4f46e5, #4338ca, #3730a3);
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

        .menu-button img {
          width: 150%;
          height: 150%;
          object-fit: contain;
          pointer-events: none;
        }

        .menu-button:hover { transform: scale(1.12); }

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

        .sidebar ul { list-style: none; padding: 0 20px; }

        .sidebar li {
          position: relative;
          margin: 12px 0;
          padding: 12px 22px;
          border-radius: 999px;
          border: 4px solid transparent;
          background-image: linear-gradient(white, white), linear-gradient(45deg, #6366f1, #4f46e5, #4338ca, #3730a3);
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

        .sidebar li:hover {
          transform: scale(1.05);
          background-color: #fafafa;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .sidebar li a { color: #000; text-decoration: none; width: 100%; display: flex; align-items: center; }

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
          .menu-button { width: 45px; height: 45px; font-size: 18px; top: 15px; left: 15px; }
          .sidebar { width: 220px; padding-top: 60px; }
          .sidebar li { padding: 10px 18px; font-size: 14px; }
          .tooltip {
            left: auto; right: 10px; top: auto; bottom: 10px;
            transform: none; font-size: 10px; padding: 2px 6px;
          }
        }

        @media (max-width: 400px) { .sidebar.active { width: 100%; } }
      `}</style>
    </>
  );
};

export default Sidebar;
