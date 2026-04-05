import React, { useEffect, useState } from 'react';
import DraggableLetter from './DraggableLetter';
import GlossyLetters3D from './GlossyLetters3D';
import homePreview from '../assets/previews/home.png';
import aboutPreview from '../assets/previews/about.png';
import skillsPreview from '../assets/previews/skills.png';
import experiencePreview from '../assets/previews/experience.png';
import achievementsPreview from '../assets/previews/achievements.png'
import contactPreview from '../assets/previews/contact.png';
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
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState(null);



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


  const MENU_ITEMS = [
    { id: 'home',         label: 'HOME',         desc: 'Welcome & Introduction',            color: '#4ecdc4', sectionIndex: 0, preview: homePreview },
    { id: 'about',        label: 'ABOUT',        desc: 'My journey, laser flow & terminal',  color: '#9333ea', sectionIndex: 1, preview: aboutPreview },
    { id: 'skills',       label: 'SKILLS',       desc: '3D sphere word cloud with lightning',color: '#4ecdc4', sectionIndex: 2, preview: skillsPreview },
    { id: 'experience',   label: 'EXPERIENCE',   desc: 'Draggable sketch card stack',        color: '#FF79C6', sectionIndex: 3, preview: experiencePreview },
    { id: 'achievements', label: 'ACHIEVEMENTS', desc: 'Certifications & milestones',        color: '#FFD700', sectionIndex: 4, preview: achievementsPreview },
    { id: 'contact',      label: 'CONTACT',      desc: 'Floating cards & message form',      color: '#ff6b6b', sectionIndex: 5, preview: contactPreview },
    { id: 'resume',       label: 'RESUME',       desc: 'Download my CV',                     color: '#8b5cf6', action: 'download' },
  ];

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      setIsMenuOpen(true);
      setIsMenuClosing(false);
      setHoveredMenuItem(null);
    }
  };

  const closeMenu = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsMenuClosing(false);
      setHoveredMenuItem(null);
    }, 400);
  };

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen && !isMenuClosing) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, isMenuClosing]);

  const handleNavigation = (item) => {
    if (item.action === 'download') {
      const link = document.createElement('a');
      link.href = 'https://drive.google.com/uc?export=download&id=1aAJLl5hBCehJR_0A_Lv_6IdsABRl2C-P';
      link.download = 'Tushar_Kashyap_Resume.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    closeMenu();
    const section = document.querySelectorAll('.page-section')[item.sectionIndex];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };


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

        <div
          className="scroll-indicator"
          onClick={() => {
            const sections = document.querySelectorAll('.page-section');
            if (sections[1]) sections[1].scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="scroll-arrow">↓</div>
          <div className="scroll-text">Scroll to explore</div>
        </div>
      </div>

      {/* Footer Social Links */}
      <footer className="social-footer">
        <a href="https://github.com/tushar7k9" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
        <a href="https://www.linkedin.com/in/tushar-ab0964213" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
        <a href="mailto:tushar7k9@gmail.com" className="social-link">Email</a>
      </footer>

      {/* Menu Overlay — Split Panel */}
      {isMenuOpen && (
        <div
          className={`menu-overlay ${isMenuClosing ? 'closing' : ''}`}
          onClick={closeMenu}
        >
          <div className="menu-panel" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button className="menu-close-btn" onClick={closeMenu}>
              <span className="close-icon">×</span>
            </button>

            {/* Header */}
            <div className="menu-header">
              <h2 className="menu-title">EXPLORE</h2>
              <p className="menu-subtitle">Navigate through my world</p>
            </div>

            <div className="menu-split">
              {/* Left — Menu Items */}
              <div className="menu-left">
                {MENU_ITEMS.map((item, index) => {
                  const isResume = item.action === 'download';
                  return (
                    <React.Fragment key={item.id}>
                      {isResume && <div className="menu-divider" />}
                      <button
                        className={`menu-item ${hoveredMenuItem === item.id ? 'hovered' : ''}`}
                        style={{ '--index': index, '--accent': item.color }}
                        onMouseEnter={() => setHoveredMenuItem(item.id)}
                        onMouseLeave={() => setHoveredMenuItem(null)}
                        onClick={() => handleNavigation(item)}
                      >
                        <span className="menu-item-number">
                          {isResume ? '↓' : String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="menu-item-label">{item.label}</span>
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Right — Preview */}
              <div className="menu-right">
                {(() => {
                  const hovered = MENU_ITEMS.find(m => m.id === hoveredMenuItem);
                  if (hovered && hovered.preview) {
                    return (
                      <div className="menu-preview" key={hoveredMenuItem}>
                        <div className="preview-image-wrap" style={{ '--accent': hovered.color }}>
                          <img
                            src={hovered.preview}
                            alt={`${hovered.label} section preview`}
                            className="preview-image"
                          />
                        </div>
                        <p className="preview-desc">{hovered.desc}</p>
                      </div>
                    );
                  }
                  if (hovered && !hovered.preview) {
                    return (
                      <div className="menu-preview" key={hoveredMenuItem}>
                        <span className="preview-number" style={{ color: hovered.color }}>↓</span>
                        <p className="preview-desc">{hovered.desc}</p>
                      </div>
                    );
                  }
                  return (
                    <div className="menu-preview default">
                      <span className="preview-hint">Hover to preview</span>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;