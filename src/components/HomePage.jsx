import React, { useEffect, useState } from 'react';
import DraggableLetter from './DraggableLetter';
import GlossyLetters3D from './GlossyLetters3D';
import './HomePage.css';

const HomePage = () => {
  const name = 'TUSHAR';
  const loadingName = 'Tushar K.';
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [loadingStage, setLoadingStage] = useState('scattering'); // scattering -> gathering -> moving -> lifting -> complete

  // Typing animation state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(null);



  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Loading animation sequence
    const timeouts = [];

    // Stage 1: Start gathering letters after 500ms
    timeouts.push(setTimeout(() => {
      setLoadingStage('gathering');
    }, 500));

    // Stage 2: Move to corner after gathering completes
    timeouts.push(setTimeout(() => {
      setLoadingStage('moving');
    }, 3000));

    // Stage 3: Start lifting animation
    timeouts.push(setTimeout(() => {
      setLoadingStage('lifting');
    }, 4500));

    // Stage 4: Complete and show main page
    timeouts.push(setTimeout(() => {
      setLoadingStage('complete');
    }, 6000));

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (loadingStage !== 'complete') return;

    const rotatingWords = ['INNOVATION', 'SOLUTIONS', 'ARCHITECTURE', 'EXCELLENCE', 'CRAFTSMANSHIP', 'IMPACT'];
    const currentWord = rotatingWords[currentWordIndex];
    let timeoutId;

    if (isTyping) {
      // Type the word character by character
      if (currentText.length < currentWord.length) {
        timeoutId = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        }, 100);
      } else {
        // Finished typing, wait before deleting
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      // Delete the word character by character
      if (currentText.length > 0) {
        timeoutId = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 50);
      } else {
        // Finished deleting, move to next word
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [currentText, isTyping, currentWordIndex, loadingStage]);


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
    closeMenu();

    if (path === '/about') {
      // Scroll to About section (second page-section)
      const aboutSection = document.querySelectorAll('.page-section')[1];
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const menuItems = [
    { id: 'about', label: 'ABOUT', description: 'Discover my journey', icon: '◐', path: '/about' },
    { id: 'work', label: 'WORK', description: 'Portfolio & Projects', icon: '◗', path: '/work' },
    { id: 'skills', label: 'SKILLS', description: 'Technical expertise', icon: '◑', path: '/skills' },
    { id: 'experience', label: 'EXPERIENCE', description: 'Professional path', icon: '◒', path: '/experience' },
    { id: 'contact', label: 'CONTACT', description: 'Let\'s connect', icon: '◔', path: '/contact' },
    { id: 'resume', label: 'RESUME', description: 'Download CV', icon: '◕', path: '/resume' }
  ];


  const getInitialPosition = (index) => {
    // Scatter letters randomly across the entire viewport with individual rotations
    const positions = [
      { x: windowSize.width * 0.1, y: windowSize.height * 0.2, rotation: -15 },   // T
      { x: windowSize.width * 0.8, y: windowSize.height * 0.15, rotation: 25 },  // U
      { x: windowSize.width * 0.3, y: windowSize.height * 0.6, rotation: -8 },   // S
      { x: windowSize.width * 0.7, y: windowSize.height * 0.7, rotation: 18 },   // H
      { x: windowSize.width * 0.15, y: windowSize.height * 0.8, rotation: -22 }, // A
      { x: windowSize.width * 0.6, y: windowSize.height * 0.3, rotation: 12 },   // R
    ];

    return positions[index] || {
      x: Math.random() * (windowSize.width - 200),
      y: Math.random() * (windowSize.height - 200),
      rotation: Math.random() * 40 - 20 // Random rotation between -20 and 20 degrees
    };
  };

  const getRandomPosition = () => {
    return {
      x: (Math.random() - 0.5) * windowSize.width * 0.8,
      y: (Math.random() - 0.5) * windowSize.height * 0.8,
      rotate: Math.random() * 720 - 360 // Random rotation between -360 and 360 degrees
    };
  };

  return (
    <div className="homepage">
      {/* Loading Animation */}
      {loadingStage !== "complete" && (
        <div
          className={`loading-overlay ${
            loadingStage === "lifting" ? "lifting" : ""
          }`}
        >
          <div
            className={`loading-text ${
              loadingStage === "moving" ? "moving-to-corner" : ""
            }`}
          >
            {loadingName.split("").map((letter, index) => {
              const randomPos = getRandomPosition();
              return (
                <span
                  key={index}
                  className={`loading-letter ${
                    loadingStage === "gathering" ||
                    loadingStage === "moving" ||
                    loadingStage === "lifting"
                      ? "gathered"
                      : ""
                  }`}
                  style={{
                    "--random-x": `${randomPos.x}px`,
                    "--random-y": `${randomPos.y}px`,
                    "--random-rotate": `${randomPos.rotate}deg`,
                    "--delay": `${index * 0.1}s`,
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h2 className="name-header">
            <span className="name-static">Tushar K</span>
            <span className="name-animated">
              <span className="name-dot">.</span>
              <span className="name-expand">
                <span className="letter" style={{ "--delay": "0s" }}>
                  a
                </span>
                <span className="letter" style={{ "--delay": "0.1s" }}>
                  s
                </span>
                <span className="letter" style={{ "--delay": "0.2s" }}>
                  h
                </span>
                <span className="letter" style={{ "--delay": "0.3s" }}>
                  y
                </span>
                <span className="letter" style={{ "--delay": "0.4s" }}>
                  a
                </span>
                <span className="letter" style={{ "--delay": "0.5s" }}>
                  p
                </span>
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

      {/* Main Content */}
      <div className="main-content">
        {/* 3D Glossy Letters Background */}
        <GlossyLetters3D letters={name} />

        {/* Keep old letters hidden but available for fallback */}
        <div className="letters-container" style={{ display: 'none' }}>
          {name.split("").map((letter, index) => {
            const initialPos = getInitialPosition(index);
            return (
              <DraggableLetter
                key={index}
                letter={letter}
                initialX={initialPos.x}
                initialY={initialPos.y}
                initialRotation={initialPos.rotation}
                index={index}
              />
            );
          })}
        </div>

        <div className="tagline" style={{ position: 'relative', zIndex: 10 }}>
          <h3>MORE THAN CODE</h3>
          <h3>
            &minus; IT'S{" "}
            <span className="highlight typing-container">
              ⠕<span className="typing-text">{currentText}</span>⠕
            </span>
          </h3>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-arrow">↓</div>
          <div className="scroll-text">Scroll to explore</div>
        </div>
      </div>

      {/* Footer Social Links */}
      <footer className="social-footer">
        <a href="#" className="social-link">
          Instagram
        </a>
        <a href="#" className="social-link">
          LinkedIn
        </a>
        <a href="#" className="social-link">
          Behance
        </a>
      </footer>

      {/* Side Work Button */}
      <div className="side-work-btn">
        <span>W.</span>
        <span className="work-text">WORK</span>
      </div>

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
                    <button className="cta-button" onClick={() => handleNavigation('/about')}>
                      <span>Learn More</span>
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
    </div>
  );
};

export default HomePage;