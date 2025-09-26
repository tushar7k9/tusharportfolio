import React, { useState, useEffect, useCallback } from 'react';
import LaserFlow from './LaserFlow';
import CursorImageReveal from './CursorImageReveal';
import './About.css';

const About = () => {
  const [scrollY, setScrollY] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [showImageReveal, setShowImageReveal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle cursor movement from laser flow
  const handleCursorMove = useCallback((position) => {
    setCursorPosition(position);
    setShowImageReveal(true);

    // Hide image reveal after a short delay if cursor stops moving
    const timer = setTimeout(() => {
      setShowImageReveal(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="about-page">
      {/* Content at the top */}
      <div className="about-content-top">
        <div className="content-container">
          <h1 className="about-title">
            <span className="title-line">About</span>
            <span className="title-line highlight">Tushar</span>
          </h1>
          <p className="about-subtitle">
            Passionate developer crafting digital experiences
          </p>
          <div className="about-description">
            <p>
              I'm a full-stack developer with a passion for creating beautiful,
              functional, and user-centered digital experiences. With expertise
              in modern web technologies and a keen eye for design.
            </p>
          </div>
        </div>
      </div>

      {/* Laser Flow Section */}
      <div className="laser-flow-section">
        <LaserFlow onCursorMove={handleCursorMove} />
      </div>

      {/* Cursor Image Reveal */}
      <CursorImageReveal
        isActive={showImageReveal}
        cursorPosition={cursorPosition}
      />
    </div>
  );
};

export default About;