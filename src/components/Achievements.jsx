import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Achievements.css';

// Portfolio-consistent category system
const CATEGORY = {
  cert:        { label: 'CERTIFICATION', color: '#4ecdc4' },
  competition: { label: 'COMPETITION',   color: '#9333ea' },
  performance: { label: 'PERFORMANCE',   color: '#FF79C6' },
  milestone:   { label: 'MILESTONE',     color: 'rgba(255,255,255,0.45)' },
};

const ACHIEVEMENTS = [
  {
    id: 'aws',
    icon: '☁',
    category: 'cert',
    featured: true,
    title: 'AWS Certified',
    subtitle: 'Solutions Architect – Professional',
    year: '2025',
    detail: 'Achieved the highest-tier cloud architecture certification from Amazon Web Services, validating deep expertise across cloud design, security, and scalability.',
    link: 'https://cp.certmetrics.com/amazon/en/public/verify/credential/049c6227320b42838f413f22c93a4bf8',
    linkLabel: 'Verify Certificate',
    issuer: 'Amazon Web Services',
  },
  {
    id: 'igt',
    icon: '🎪',
    category: 'performance',
    title: "India's Got Talent",
    subtitle: 'Semifinalist – Season 5',
    year: '',
    detail: 'Reached the national semifinals competing in Acrobatics & Gymnastics on live television.',
  },
  {
    id: 'yoga',
    icon: '🧘',
    category: 'performance',
    title: 'National Yoga',
    subtitle: '2nd Place – National Competition',
    year: '',
    detail: 'Secured 2nd place at the National Yoga Competition — discipline beyond code.',
  },
  {
    id: 'zuno',
    icon: '🥈',
    category: 'competition',
    title: 'Zuno Fellowship',
    subtitle: 'Silver Winner 2023',
    year: '2023',
    detail: 'Ranked 202nd globally across thousands of participants in the Zuno Fellowship Program.',
  },
  {
    id: 'leetcode',
    icon: '⚡',
    category: 'competition',
    title: 'LeetCode Elite',
    subtitle: 'Top 5% Globally',
    year: '',
    detail: 'Highest rating 1880 · Ranked 1143 out of 21,000+ in Weekly Contest 335.',
  },
  {
    id: 'problems',
    icon: '💻',
    category: 'milestone',
    title: 'Problem Solver',
    subtitle: '1000+ Solved',
    year: '',
    detail: 'Over a thousand algorithmic challenges across LeetCode, CodeChef, and beyond.',
  },
  {
    id: 'codechef',
    icon: '⭐',
    category: 'competition',
    title: '3-Star Coder',
    subtitle: 'CodeChef · Rating 1775',
    year: '',
    detail: 'Earned 3-star status with a peak competitive programming rating of 1775.',
  },
];

// ── Certificate Modal ─────────────────────────────────────────────────────
const CertificateModal = ({ achievement, onClose }) => {
  const cat = CATEGORY[achievement.category];
  const credentialId = achievement.link?.split('/').pop() ?? '';
  const credentialFormatted = credentialId.match(/.{1,8}/g)?.join(' – ') ?? credentialId;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="cert-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className="cert-modal" style={{ '--cat-color': cat.color }}>
        <button className="cert-close-x" onClick={onClose} aria-label="Close">✕</button>

        <div className="cert-ornament-top">
          <span className="cert-ornament-line" />
          <span className="cert-diamond">◆</span>
          <span className="cert-ornament-line" />
        </div>

        <p className="cert-official-label">CERTIFICATE OF ACHIEVEMENT</p>

        <div className="cert-icon-wrap">
          <span className="cert-icon">{achievement.icon}</span>
        </div>

        <h2 className="cert-title">{achievement.title}</h2>
        <p className="cert-subtitle">{achievement.subtitle}</p>

        <div className="cert-hr" />

        <div className="cert-meta-grid">
          <div className="cert-meta-row">
            <span className="cert-meta-key">Awarded to</span>
            <span className="cert-meta-val">Tushar Kashyap</span>
          </div>
          {achievement.issuer && (
            <div className="cert-meta-row">
              <span className="cert-meta-key">Issued by</span>
              <span className="cert-meta-val">{achievement.issuer}</span>
            </div>
          )}
          {achievement.year && (
            <div className="cert-meta-row">
              <span className="cert-meta-key">Year</span>
              <span className="cert-meta-val">{achievement.year}</span>
            </div>
          )}
          {credentialId && (
            <div className="cert-meta-row">
              <span className="cert-meta-key">Credential ID</span>
              <span className="cert-meta-val cert-credential-id">{credentialFormatted}</span>
            </div>
          )}
        </div>

        <div className="cert-seal">
          <span className="cert-seal-ring" />
          <span className="cert-seal-icon">✦</span>
          <p className="cert-seal-label">VERIFIED</p>
        </div>

        <div className="cert-ornament-top cert-ornament-bottom">
          <span className="cert-ornament-line" />
          <span className="cert-diamond">◆</span>
          <span className="cert-ornament-line" />
        </div>

        <div className="cert-actions">
          <a
            href={achievement.link}
            target="_blank"
            rel="noreferrer"
            className="cert-verify-btn"
            onClick={onClose}
          >
            <span>Open Verification Page</span>
            <span className="cert-btn-arrow">↗</span>
          </a>
          <button className="cert-dismiss-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ── Featured card (AWS) ───────────────────────────────────────────────────
const FeaturedCard = ({ achievement, index, onViewCert }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const cat = CATEGORY[achievement.category];

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const num = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={cardRef}
      className={`ach-featured${isVisible ? ' visible' : ''}`}
      style={{ '--cat-color': cat.color, '--delay': '0s' }}
    >
      {/* Top accent bar */}
      <div className="ach-top-bar" />

      {/* Background number watermark */}
      <span className="ach-num-watermark">{num}</span>

      {/* Left: content */}
      <div className="ach-featured-left">
        <span className="ach-category-tag" style={{ color: cat.color }}>{cat.label}</span>
        <h3 className="ach-featured-title">{achievement.title}</h3>
        <p className="ach-featured-subtitle">{achievement.subtitle}</p>
        {achievement.year && <span className="ach-year">{achievement.year}</span>}
        <p className="ach-detail">{achievement.detail}</p>
        {achievement.link && (
          <button
            className="ach-cert-btn"
            onClick={() => onViewCert(achievement)}
            style={{ '--cat-color': cat.color }}
          >
            {achievement.linkLabel}
            <span className="ach-cert-arrow">↗</span>
          </button>
        )}
      </div>

      {/* Right: decorative icon area */}
      <div className="ach-featured-right">
        <div className="ach-featured-icon-wrap" style={{ '--cat-color': cat.color }}>
          <span className="ach-featured-icon">{achievement.icon}</span>
          <div className="ach-featured-ring ring-1" />
          <div className="ach-featured-ring ring-2" />
          <div className="ach-featured-ring ring-3" />
        </div>
        <p className="ach-featured-issuer">{achievement.issuer}</p>
      </div>
    </div>
  );
};

// ── Regular card ──────────────────────────────────────────────────────────
const AchCard = ({ achievement, index, onViewCert }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [shimmer, setShimmer] = useState({ x: 50, y: 50 });
  const tiltRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const cat = CATEGORY[achievement.category];

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      tiltRef.current.x = lerp(tiltRef.current.x, targetRef.current.x, 0.1);
      tiltRef.current.y = lerp(tiltRef.current.y, targetRef.current.y, 0.1);
      if (cardRef.current) {
        cardRef.current.style.transform =
          `perspective(900px) rotateX(${tiltRef.current.x}deg) rotateY(${tiltRef.current.y}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    targetRef.current = {
      x: ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -8,
      y: ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8,
    };
    setShimmer({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetRef.current = { x: 0, y: 0 };
    setIsHovered(false);
  }, []);

  // Global card number (featured is #1, so these start at #2)
  const num = String(index + 2).padStart(2, '0');

  return (
    <div
      ref={cardRef}
      className={`ach-card${isVisible ? ' visible' : ''}${isHovered ? ' hovered' : ''}`}
      style={{
        '--cat-color': cat.color,
        '--delay': `${index * 0.1}s`,
        '--shimmer-x': `${shimmer.x}%`,
        '--shimmer-y': `${shimmer.y}%`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top accent bar */}
      <div className="ach-top-bar" />

      {/* Holographic shimmer */}
      <div className="ach-shimmer" />

      {/* Background number watermark */}
      <span className="ach-num-watermark">{num}</span>

      {/* Category tag */}
      <span className="ach-category-tag">{cat.label}</span>

      {/* Icon */}
      <div className="ach-icon-row">
        <span className="ach-icon">{achievement.icon}</span>
        {achievement.year && <span className="ach-year">{achievement.year}</span>}
      </div>

      {/* Titles */}
      <h3 className="ach-title">{achievement.title}</h3>
      <p className="ach-subtitle">{achievement.subtitle}</p>
      <p className="ach-detail">{achievement.detail}</p>

      {/* Footer */}
      <div className="ach-footer">
        {achievement.link ? (
          <button
            className="ach-link-btn"
            onClick={(e) => { e.stopPropagation(); onViewCert(achievement); }}
          >
            {achievement.linkLabel} ↗
          </button>
        ) : <span />}
      </div>
    </div>
  );
};

// ── Main section ──────────────────────────────────────────────────────────
const Achievements = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [certModal, setCertModal] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const featured = ACHIEVEMENTS.filter(a => a.featured);
  const regular  = ACHIEVEMENTS.filter(a => !a.featured);

  return (
    <div className="achievements-page" ref={sectionRef}>

      {/* Ambient glow blobs (match portfolio style) */}
      <div className="ach-ambient-1" />
      <div className="ach-ambient-2" />

      <div className={`achievements-content${isVisible ? ' animate-in' : ''}`}>

        {/* ── Header ── */}
        <header className="achievements-header">
          <h2 className="achievements-title">
            <span className="a-title-line">ACHIEVE</span>
            <span className="a-title-line a-title-highlight">MENTS</span>
          </h2>
          <p className="achievements-subtitle">
            Certifications, rankings &amp; milestones
          </p>

          {/* Minimal meta strip */}
          <div className="ach-meta-strip">
            {Object.entries(CATEGORY).map(([key, val]) => {
              const count = ACHIEVEMENTS.filter(a => a.category === key).length;
              return count > 0 ? (
                <span key={key} className="ach-meta-pill" style={{ '--mc': val.color }}>
                  <span className="ach-meta-dot" />
                  {val.label}
                  <span className="ach-meta-count">{count}</span>
                </span>
              ) : null;
            })}
          </div>
        </header>

        {/* ── Featured card ── */}
        {featured.map((a, i) => (
          <FeaturedCard key={a.id} achievement={a} index={i} onViewCert={setCertModal} />
        ))}

        {/* ── Grid ── */}
        <div className="ach-grid">
          {regular.map((a, i) => (
            <AchCard key={a.id} achievement={a} index={i} onViewCert={setCertModal} />
          ))}
        </div>

      </div>

      {/* Certificate modal */}
      {certModal && (
        <CertificateModal achievement={certModal} onClose={() => setCertModal(null)} />
      )}
    </div>
  );
};

export default Achievements;
