import React, { useRef } from 'react';
import LaserFlow from './LaserFlow';
import Terminal from './Terminal';
import './About.css';
import leetcodeBg from '../images/leetcode_about_page_bg.png';

const About = () => {
  const revealImgRef = useRef(null);
  const [onTerminal, setOnTerminal] = React.useState(false);

  return (
    <div className="about-page">
      {/* Content at the top — NO image here */}
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

      {/* Shared container: Laser + Terminal — image spans both */}
      <div
        className="about-visual-area"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const el = revealImgRef.current;
          if (el) {
            el.style.setProperty("--mx", `${x}px`);
            el.style.setProperty("--my", `${y}px`);
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
        {/* Leetcode BG — revealed by cursor, spans laser + terminal */}
        <img
          ref={revealImgRef}
          src={leetcodeBg}
          className="laser-reveal-overlay"
          style={{ "--mx": "-9999px", "--my": "-9999px", opacity: onTerminal ? 0.15 : 0.45 }}
        />

        {/* Laser Flow Section */}
        <div className="laser-flow-section">
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
        </div>

        {/* Terminal directly below laser */}
        <div
          className="terminal-section"
          onMouseEnter={() => setOnTerminal(true)}
          onMouseLeave={() => setOnTerminal(false)}
        >
          <div className="terminal-wrapper">
            <Terminal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;