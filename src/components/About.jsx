import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="hero-background" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <div className="floating-elements">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="floating-particle"
                style={{
                  '--delay': `${i * 0.5}s`,
                  '--x': `${Math.random() * 100}%`,
                  '--y': `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">About</span>
            <span className="title-line highlight">Tushar</span>
          </h1>
          <p className="hero-subtitle">
            Passionate developer crafting digital experiences
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;