import React, { useRef } from 'react';
import LaserFlow from './LaserFlow';
import './About.css';

const About = () => {
  const revealImgRef = useRef(null);

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
      <div
        className="laser-flow-section"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const el = revealImgRef.current;
          if (el) {
            el.style.setProperty("--mx", `${x}px`);
            el.style.setProperty("--my", `${y + rect.height * 0.5}px`);
          }
        }}
        onMouseLeave={() => {
          const el = revealImgRef.current;
          if (el) {
            el.style.setProperty("--mx", "-9999px");
            el.style.setProperty("--my", "-9999px");
          }
        }}
      >
        <LaserFlow
          className="laser-flow-background"
          horizontalBeamOffset={0.0}
          verticalBeamOffset={0.0}
          color="#FF79C6"
          wispDensity={1.2}
          flowSpeed={0.4}
          verticalSizing={2.5}
          horizontalSizing={0.8}
          fogIntensity={0.6}
          fogScale={0.25}
          wispSpeed={12.0}
          wispIntensity={4.0}
          flowStrength={0.3}
          decay={1.0}
          falloffStart={1.5}
          fogFallSpeed={0.5}
          mouseTiltStrength={0.02}
        />

        {/* Interactive Reveal Effect */}
        <img
          ref={revealImgRef}
          src="./images/leetcode_about_page_bg.png"
          className="laser-reveal-overlay"
          style={{
            "--mx": "-9999px",
            "--my": "-9999px",
          }}
        />
      </div>
    </div>
  );
};

export default About;