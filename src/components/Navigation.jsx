import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    setActiveMenuItem(null);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveMenuItem(null);
  };

  const handleMenuItemHover = (item) => {
    setActiveMenuItem(item);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMenu();
  };

  const menuItems = [
    { id: 'about', label: 'ABOUT', description: 'Discover my journey', icon: '◐', path: '/about' },
    { id: 'work', label: 'WORK', description: 'Portfolio & Projects', icon: '◗', path: '/work' },
    { id: 'skills', label: 'SKILLS', description: 'Technical expertise', icon: '◑', path: '/skills' },
    { id: 'experience', label: 'EXPERIENCE', description: 'Professional path', icon: '◒', path: '/experience' },
    { id: 'contact', label: 'CONTACT', description: 'Let\'s connect', icon: '◔', path: '/contact' },
    { id: 'resume', label: 'RESUME', description: 'Download CV', icon: '◕', path: '/resume' }
  ];

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h2 className="name-header" onClick={() => navigate('/')}>
            <span className="name-static">Tushar K</span>
            <span className="name-animated">
              <span className="name-dot">.</span>
              <span className="name-expand">
                <span className="letter" style={{ "--delay": "0s" }}>a</span>
                <span className="letter" style={{ "--delay": "0.1s" }}>s</span>
                <span className="letter" style={{ "--delay": "0.2s" }}>h</span>
                <span className="letter" style={{ "--delay": "0.3s" }}>y</span>
                <span className="letter" style={{ "--delay": "0.4s" }}>a</span>
                <span className="letter" style={{ "--delay": "0.5s" }}>p</span>
              </span>
            </span>
          </h2>
        </div>
        <div className="header-center">
          <div className="location-info">
            <span className="location-icon">📍</span>
            <span>BANGALORE</span>
            <span className="timezone">
              IST{" "}
              {new Date().toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <div className="header-right">
          <button className="menu-btn" onClick={toggleMenu}>
            <span className={`menu-text ${isMenuOpen ? 'active' : ''}`}>
              {isMenuOpen ? 'CLOSE' : 'MENU'}
            </span>
            <span className={`menu-icon ${isMenuOpen ? 'active' : ''}`}>
              {isMenuOpen ? '×' : '+'}
            </span>
          </button>
        </div>
      </header>

      {/* Creative Menu Overlay */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}>
          <div className="menu-background" onClick={(e) => e.stopPropagation()}>
            <div className="menu-particles">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    '--delay': `${i * 0.1}s`,
                    '--x': `${Math.random() * 100}%`,
                    '--y': `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>

            <div className="menu-grid">
              <div className="menu-content">
                <div className="menu-header">
                  <div className="menu-header-top">
                    <h2 className="menu-title">EXPLORE</h2>
                    <button className="menu-close-btn" onClick={closeMenu}>
                      <span className="close-icon">×</span>
                    </button>
                  </div>
                  <div className="menu-subtitle">Navigate through my world</div>
                </div>

                <div className="menu-items">
                  {menuItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`menu-item ${activeMenuItem === item.id ? 'active' : ''}`}
                      onMouseEnter={() => handleMenuItemHover(item.id)}
                      onMouseLeave={() => handleMenuItemHover(null)}
                      onClick={() => handleNavigation(item.path)}
                      style={{ '--index': index }}
                    >
                      <div className="menu-item-icon">
                        <span className="icon">{item.icon}</span>
                      </div>
                      <div className="menu-item-content">
                        <h3 className="menu-item-label">{item.label}</h3>
                        <p className="menu-item-description">{item.description}</p>
                      </div>
                      <div className="menu-item-arrow">
                        <span>→</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="menu-footer">
                  <div className="menu-footer-text">
                    <span>Ready to build something amazing?</span>
                  </div>
                  <div className="menu-cta">
                    <button className="cta-button" onClick={() => handleNavigation('/contact')}>
                      <span>Let's Talk</span>
                      <span className="cta-icon">✦</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="menu-decoration">
                <div className="decoration-lines">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="decoration-line" style={{ '--line-delay': `${i * 0.2}s` }} />
                  ))}
                </div>
                <div className="decoration-circles">
                  <div className="circle large"></div>
                  <div className="circle medium"></div>
                  <div className="circle small"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Home Button */}
      {location.pathname !== '/' && (
        <button className="back-home-btn" onClick={() => navigate('/')}>
          <span>←</span>
          <span>HOME</span>
        </button>
      )}
    </>
  );
};

export default Navigation;