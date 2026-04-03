import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Achievements.css';

const RARITY = {
  legendary: { label: 'LEGENDARY', color: '#FFD700', glow: 'rgba(255,215,0,0.4)' },
  epic:      { label: 'EPIC',      color: '#c084fc', glow: 'rgba(192,132,252,0.4)' },
  rare:      { label: 'RARE',      color: '#60a5fa', glow: 'rgba(96,165,250,0.4)'  },
  uncommon:  { label: 'UNCOMMON',  color: '#4ecdc4', glow: 'rgba(78,205,196,0.4)'  },
};

const ACHIEVEMENTS = [
  {
    id: 'aws',
    icon: '☁',
    rarity: 'legendary',
    title: 'AWS Certified',
    subtitle: 'Solutions Architect – Professional',
    year: '2025',
    detail: 'Achieved the highest-tier cloud architecture certification from Amazon Web Services.',
    link: 'https://cp.certmetrics.com/amazon/en/public/verify/credential/049c6227320b42838f413f22c93a4bf8',
    linkLabel: 'Verify Certificate',
    issuer: 'Amazon Web Services',
    xp: 5000,
  },
  {
    id: 'igt',
    icon: '🎪',
    rarity: 'epic',
    title: "India's Got Talent",
    subtitle: 'Semifinalist – Season 5',
    year: '',
    detail: 'Reached the national semifinals competing in Acrobatics & Gymnastics on live television.',
    xp: 3500,
  },
  {
    id: 'yoga',
    icon: '🧘',
    rarity: 'epic',
    title: 'National Yoga',
    subtitle: '2nd Place – National Competition',
    year: '',
    detail: 'Secured 2nd place at the National Yoga Competition — a testament to discipline beyond code.',
    xp: 3200,
  },
  {
    id: 'zuno',
    icon: '🥈',
    rarity: 'epic',
    title: 'Zuno Fellowship',
    subtitle: 'Silver Winner 2023',
    year: '2023',
    detail: 'Ranked 202nd globally across thousands of participants in the prestigious Zuno Fellowship Program.',
    xp: 2800,
  },
  {
    id: 'leetcode',
    icon: '⚡',
    rarity: 'rare',
    title: 'LeetCode Elite',
    subtitle: 'Top 5% Globally',
    year: '',
    detail: 'Highest rating 1880 · Ranked 1143 out of 21,000+ in Weekly Contest 335.',
    xp: 2200,
  },
  {
    id: 'problems',
    icon: '💻',
    rarity: 'uncommon',
    title: 'Problem Solver',
    subtitle: '1000+ Problems Solved',
    year: '',
    detail: 'Over a thousand algorithmic challenges conquered across LeetCode, CodeChef, and beyond.',
    xp: 1500,
  },
  {
    id: 'codechef',
    icon: '⭐',
    rarity: 'uncommon',
    title: '3-Star Coder',
    subtitle: 'CodeChef · Rating 1775',
    year: '',
    detail: 'Earned the 3-star badge with a peak competitive programming rating of 1775.',
    xp: 1500,
  },
];

// ── Certificate Modal ─────────────────────────────────────────────────────
const CertificateModal = ({ achievement, onClose }) => {
  const rarity = RARITY[achievement.rarity];

  // Format credential ID from URL
  const credentialId = achievement.link?.split('/').pop() ?? '';
  const credentialFormatted = credentialId.match(/.{1,8}/g)?.join(' – ') ?? credentialId;

  // Close on Escape + lock body scroll
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
      aria-label={`${achievement.title} certificate`}
    >
      <div
        className="cert-modal"
        style={{ '--rarity-color': rarity.color, '--rarity-glow': rarity.glow }}
      >
        {/* Close button */}
        <button className="cert-close-x" onClick={onClose} aria-label="Close">✕</button>

        {/* Ornamental header */}
        <div className="cert-ornament-top">
          <span className="cert-ornament-line" />
          <span className="cert-diamond">◆</span>
          <span className="cert-ornament-line" />
        </div>

        <p className="cert-official-label">CERTIFICATE OF ACHIEVEMENT</p>

        {/* Icon */}
        <div className="cert-icon-wrap">
          <span className="cert-icon">{achievement.icon}</span>
        </div>

        {/* Titles */}
        <h2 className="cert-title">{achievement.title}</h2>
        <p className="cert-subtitle">{achievement.subtitle}</p>

        {/* Divider */}
        <div className="cert-hr" />

        {/* Meta details */}
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

        {/* Seal */}
        <div className="cert-seal">
          <span className="cert-seal-ring" />
          <span className="cert-seal-icon">✦</span>
          <p className="cert-seal-label">VERIFIED</p>
        </div>

        {/* Ornamental footer */}
        <div className="cert-ornament-top cert-ornament-bottom">
          <span className="cert-ornament-line" />
          <span className="cert-diamond">◆</span>
          <span className="cert-ornament-line" />
        </div>

        {/* Actions */}
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

// ── Single holographic card ────────────────────────────────────────────────
const AchievementCard = ({ achievement, index, onViewCert }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shimmer, setShimmer] = useState({ x: 50, y: 50 });
  const tiltRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  // Intersection observer — trigger entrance animation
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Lerped tilt loop
  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      tiltRef.current.x = lerp(tiltRef.current.x, targetRef.current.x, 0.12);
      tiltRef.current.y = lerp(tiltRef.current.y, targetRef.current.y, 0.12);
      if (cardRef.current) {
        cardRef.current.style.transform =
          `perspective(800px) rotateX(${tiltRef.current.x}deg) rotateY(${tiltRef.current.y}deg)`;
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
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    targetRef.current = {
      x: ((e.clientY - cy) / (rect.height / 2)) * -10,
      y: ((e.clientX - cx) / (rect.width / 2)) * 10,
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

  const rarity = RARITY[achievement.rarity];

  return (
    <div
      ref={cardRef}
      className={`achievement-card rarity-${achievement.rarity}${isVisible ? ' visible' : ''}${isHovered ? ' hovered' : ''}`}
      style={{
        '--rarity-color': rarity.color,
        '--rarity-glow': rarity.glow,
        '--delay': `${index * 0.09}s`,
        '--shimmer-x': `${shimmer.x}%`,
        '--shimmer-y': `${shimmer.y}%`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Holographic shimmer */}
      <div className="card-shimmer" />

      {/* Corner glow accent */}
      <div className="card-corner-glow" />

      {/* Top row: rarity badge + year */}
      <div className="card-top">
        <span className="card-rarity-badge">{rarity.label}</span>
        {achievement.year && <span className="card-year">{achievement.year}</span>}
      </div>

      {/* Icon */}
      <div className="card-icon-wrap">
        <span className="card-icon">{achievement.icon}</span>
      </div>

      {/* Text */}
      <h3 className="card-title">{achievement.title}</h3>
      <p className="card-subtitle">{achievement.subtitle}</p>
      <p className="card-detail">{achievement.detail}</p>

      {/* Footer */}
      <div className="card-footer">
        {achievement.link ? (
          <button
            className="card-link"
            onClick={(e) => { e.stopPropagation(); onViewCert(achievement); }}
          >
            {achievement.linkLabel} ↗
          </button>
        ) : (
          <span />
        )}
        <span className="card-xp">+{achievement.xp.toLocaleString()} XP</span>
      </div>
    </div>
  );
};

// ── Main section ───────────────────────────────────────────────────────────
const Achievements = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [certModal, setCertModal] = useState(null); // achievement object | null
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const totalXP = ACHIEVEMENTS.reduce((sum, a) => sum + a.xp, 0);
  const legendaryCount = ACHIEVEMENTS.filter(a => a.rarity === 'legendary').length;

  return (
    <div className="achievements-page" ref={sectionRef}>
      {/* Subtle dot-grid background */}
      <div className="achievements-bg-grid" />

      <div className={`achievements-content${isVisible ? ' animate-in' : ''}`}>

        {/* Header */}
        <header className="achievements-header">
          <h2 className="achievements-title">
            <span className="a-title-line">ACHIEVE</span>
            <span className="a-title-line a-title-highlight">MENTS</span>
          </h2>
          <p className="achievements-subtitle">Certifications, rankings &amp; milestones</p>

          {/* Stats bar */}
          <div className="achievements-stats">
            <div className="stat-item">
              <span className="stat-value">{ACHIEVEMENTS.length}</span>
              <span className="stat-label">Unlocked</span>
            </div>
            <span className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">{totalXP.toLocaleString()}</span>
              <span className="stat-label">Total XP</span>
            </div>
            <span className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value stat-legendary">{legendaryCount} ★</span>
              <span className="stat-label">Legendary</span>
            </div>
            <span className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value stat-rank">ELITE</span>
              <span className="stat-label">Rank</span>
            </div>
          </div>
        </header>

        {/* Rarity legend */}
        <div className="rarity-legend">
          {Object.entries(RARITY).map(([key, val]) => (
            <span key={key} className="legend-item" style={{ '--rc': val.color }}>
              <span className="legend-pip" />
              {val.label}
            </span>
          ))}
        </div>

        {/* Card grid */}
        <div className="achievements-grid">
          {ACHIEVEMENTS.map((achievement, i) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              index={i}
              onViewCert={setCertModal}
            />
          ))}
        </div>
      </div>

      {/* Certificate modal */}
      {certModal && (
        <CertificateModal
          achievement={certModal}
          onClose={() => setCertModal(null)}
        />
      )}
    </div>
  );
};

export default Achievements;
