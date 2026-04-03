import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './Achievements.css';

const CATEGORY = {
  cert:        { label: 'CERTIFICATION', color: '#4ecdc4' },
  competition: { label: 'COMPETITION',   color: '#9333ea' },
  performance: { label: 'PERFORMANCE',   color: '#FF79C6' },
  milestone:   { label: 'MILESTONE',     color: 'rgba(255,255,255,0.55)' },
};

const ACHIEVEMENTS = [
  {
    id: 'aws',
    icon: '☁',
    category: 'cert',
    title: 'AWS Certified',
    subtitle: 'Solutions Architect – Professional',
    year: '2025',
    detail: 'Highest-tier cloud architecture certification — deep expertise in design, security & scalability.',
    link: 'https://cp.certmetrics.com/amazon/en/public/verify/credential/049c6227320b42838f413f22c93a4bf8',
    linkLabel: 'Verify Certificate',
    issuer: 'Amazon Web Services',
    visual: { type: 'tier', tiers: ['Foundational', 'Associate', 'Professional', 'Specialty'], active: 2 },
  },
  {
    id: 'igt',
    icon: '🎪',
    category: 'performance',
    title: "India's Got Talent",
    subtitle: 'Semifinalist – Season 5',
    year: '',
    detail: 'Competed on national live television in Acrobatics & Gymnastics.',
    visual: { type: 'milestone', steps: ['Audition', 'Round 1', 'Round 2', 'Quarterfinal', 'Semifinal', 'Final'], reached: 4 },
  },
  {
    id: 'yoga',
    icon: '🧘',
    category: 'performance',
    title: 'National Yoga',
    subtitle: '2nd Place – National Competition',
    year: '',
    detail: 'Discipline beyond code — balance of body and mind at the national stage.',
    visual: { type: 'podium', places: ['1st', '2nd', '3rd'], active: 1 },
  },
  {
    id: 'zuno',
    icon: '🥈',
    category: 'competition',
    title: 'Zuno Fellowship',
    subtitle: 'Silver Winner 2023',
    year: '2023',
    detail: 'Competed against thousands of developers worldwide in the Zuno Fellowship Program.',
    visual: { type: 'rank', value: '#202', label: 'Global Rank', context: 'out of thousands' },
  },
  {
    id: 'leetcode',
    icon: '⚡',
    category: 'competition',
    title: 'LeetCode Elite',
    subtitle: 'Top 5% Globally',
    year: '',
    detail: 'Elite competitive programmer — Weekly Contest 335, ranked 1143 of 21,000+.',
    visual: { type: 'bar', value: 1880, max: 3099, label: 'Contest Rating' },
  },
  {
    id: 'problems',
    icon: '💻',
    category: 'milestone',
    title: 'Problem Solver',
    subtitle: '1800+ Solved',
    year: '',
    detail: 'Over 1800 algorithmic challenges conquered across multiple platforms.',
    visual: { type: 'bar', value: 1800, max: 2000, label: 'Problems Solved' },
  },
  {
    id: 'codechef',
    icon: '⭐',
    category: 'competition',
    title: '3-Star Coder',
    subtitle: 'CodeChef · Rating 1775',
    year: '',
    detail: 'Consistent competitive programming performance with peak rating of 1775.',
    visual: { type: 'stars', filled: 3, total: 5, label: 'CodeChef Division' },
  },
];

// ── StarField ─────────────────────────────────────────────────────────────
const StarField = ({ mousePosRef }) => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const parent = canvas.parentElement;

    const resize = () => { canvas.width = parent.offsetWidth; canvas.height = parent.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random(),
      size: Math.random() * 1.3 + 0.15,
      depth: Math.random() * 0.8 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const shooters = Array.from({ length: 3 }, (_, i) => ({
      active: false, x: 0, y: 0, dx: 0, dy: 0, alpha: 0,
      timer: 0, nextFire: (i + 1) * 280 + Math.random() * 200,
    }));

    let t = 0;
    const draw = () => {
      t++;
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const { x: mnx, y: mny } = mousePosRef.current;

      stars.forEach(s => {
        const tw    = Math.sin(t * 0.022 + s.phase);
        const alpha = (0.07 + s.depth * 0.36) * (0.68 + tw * 0.32);
        const px    = s.x * w + (mnx - 0.5) * s.depth * 45;
        const py    = s.y * h + (mny - 0.5) * s.depth * 28;
        ctx.beginPath(); ctx.arc(px, py, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`; ctx.fill();
      });

      shooters.forEach(s => {
        s.timer++;
        if (!s.active && s.timer >= s.nextFire) {
          s.active = true; s.timer = 0;
          s.x = Math.random() * w * 0.65; s.y = Math.random() * h * 0.4;
          const a = (Math.random() * 22 + 12) * Math.PI / 180, spd = Math.random() * 10 + 7;
          s.dx = Math.cos(a) * spd; s.dy = Math.sin(a) * spd; s.alpha = 0.85;
        }
        if (s.active) {
          const tl = 55, x0 = s.x - s.dx * (tl / 10), y0 = s.y - s.dy * (tl / 10);
          const g = ctx.createLinearGradient(x0, y0, s.x, s.y);
          g.addColorStop(0, 'transparent'); g.addColorStop(1, `rgba(255,255,255,${s.alpha.toFixed(3)})`);
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.stroke();
          s.x += s.dx; s.y += s.dy; s.alpha -= 0.024;
          if (s.alpha <= 0 || s.x > w + 100) { s.active = false; s.timer = 0; s.nextFire = Math.random() * 500 + 300; }
        }
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, [mousePosRef]);

  return <canvas ref={canvasRef} className="ach-starfield" />;
};

// ── ScatterText ───────────────────────────────────────────────────────────
const ScatterText = ({ text, phase, tag: Tag = 'span', className, baseDelay = 0 }) => {
  const vectors = useMemo(() =>
    Array.from(text).map(() => ({
      tx: (Math.random() - 0.5) * 520,
      ty: (Math.random() - 0.5) * 380,
      tr: (Math.random() - 0.5) * 100,
      d:  baseDelay + Math.random() * 0.18,
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text]
  );

  const cls = phase === 'exit' ? 'sc-out' : phase === 'enter' ? 'sc-in' : 'sc-rest';

  return (
    <Tag className={className}>
      {Array.from(text).map((char, i) => (
        <span key={i} className={`sc ${cls}`}
          style={{ '--tx': `${vectors[i].tx}px`, '--ty': `${vectors[i].ty}px`, '--tr': `${vectors[i].tr}deg`, '--td': `${vectors[i].d}s` }}
        >{char === ' ' ? '\u00A0' : char}</span>
      ))}
    </Tag>
  );
};

// ── Certificate Modal ─────────────────────────────────────────────────────
const CertificateModal = ({ achievement, onClose }) => {
  const cat          = CATEGORY[achievement.category];
  const credentialId = achievement.link?.split('/').pop() ?? '';
  const credFmt      = credentialId.match(/.{1,8}/g)?.join(' – ') ?? credentialId;

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="cert-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true">
      <div className="cert-modal" style={{ '--cat-color': cat.color }}>
        <button className="cert-close-x" onClick={onClose} aria-label="Close">✕</button>
        <div className="cert-ornament-top"><span className="cert-ornament-line" /><span className="cert-diamond">◆</span><span className="cert-ornament-line" /></div>
        <p className="cert-official-label">CERTIFICATE OF ACHIEVEMENT</p>
        <div className="cert-icon-wrap"><span className="cert-icon">{achievement.icon}</span></div>
        <h2 className="cert-title">{achievement.title}</h2>
        <p className="cert-subtitle">{achievement.subtitle}</p>
        <div className="cert-hr" />
        <div className="cert-meta-grid">
          <div className="cert-meta-row"><span className="cert-meta-key">Awarded to</span><span className="cert-meta-val">Tushar Kashyap</span></div>
          {achievement.issuer && <div className="cert-meta-row"><span className="cert-meta-key">Issued by</span><span className="cert-meta-val">{achievement.issuer}</span></div>}
          {achievement.year   && <div className="cert-meta-row"><span className="cert-meta-key">Year</span><span className="cert-meta-val">{achievement.year}</span></div>}
          {credentialId       && <div className="cert-meta-row"><span className="cert-meta-key">Credential ID</span><span className="cert-meta-val cert-credential-id">{credFmt}</span></div>}
        </div>
        <div className="cert-seal"><span className="cert-seal-ring" /><span className="cert-seal-icon">✦</span><p className="cert-seal-label">VERIFIED</p></div>
        <div className="cert-ornament-top cert-ornament-bottom"><span className="cert-ornament-line" /><span className="cert-diamond">◆</span><span className="cert-ornament-line" /></div>
        <div className="cert-actions">
          <a href={achievement.link} target="_blank" rel="noreferrer" className="cert-verify-btn" onClick={onClose}><span>Open Verification Page</span><span className="cert-btn-arrow">↗</span></a>
          <button className="cert-dismiss-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ── NanoBotIcon — particles assemble into emoji shape ────────────────────
const NanoBotIcon = ({ icon, phase, color }) => {
  const canvasRef    = useRef(null);
  const particlesRef = useRef([]);
  const rafRef       = useRef(null);
  const phaseRef     = useRef(phase);

  // Parse hex/rgb color into {r,g,b}
  const rgb = useMemo(() => {
    if (color.startsWith('#')) {
      const n = parseInt(color.slice(1), 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }
    const m = color.match(/\d+/g);
    return m ? { r: +m[0], g: +m[1], b: +m[2] } : { r: 255, g: 255, b: 255 };
  }, [color]);

  // Sample emoji pixels → target positions
  const targets = useMemo(() => {
    const size = 64;
    const off  = document.createElement('canvas');
    off.width = size; off.height = size;
    const ctx = off.getContext('2d');
    ctx.font = `${size * 0.78}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, size / 2, size / 2);

    const data   = ctx.getImageData(0, 0, size, size).data;
    const points = [];
    const step   = 2; // sample every 2px
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        if (data[(y * size + x) * 4 + 3] > 100) {
          points.push({ x: (x / size) * 140, y: (y / size) * 140 });
        }
      }
    }
    // If too many, randomly thin
    while (points.length > 300) points.splice(Math.floor(Math.random() * points.length), 1);
    return points;
  }, [icon]);

  // Init particles
  useEffect(() => {
    const ps = targets.map(t => ({
      x:  Math.random() * 140,
      y:  Math.random() * 140,
      tx: t.x, ty: t.y,
      vx: 0, vy: 0,
      size: Math.random() * 1.5 + 0.6,
      alpha: 0,
    }));
    particlesRef.current = ps;
  }, [targets]);

  // Track phase changes
  useEffect(() => {
    const prev = phaseRef.current;
    phaseRef.current = phase;

    if (phase === 'exit') {
      // Give each particle a random outward velocity
      particlesRef.current.forEach(p => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1.5;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
      });
    } else if (phase === 'enter') {
      // Scatter particles to random positions, they'll spring to targets
      particlesRef.current.forEach(p => {
        p.x     = Math.random() * 140;
        p.y     = Math.random() * 140;
        p.alpha = 0;
        p.vx    = 0;
        p.vy    = 0;
      });
    }
  }, [phase]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 140; canvas.height = 140;

    const draw = () => {
      ctx.clearRect(0, 0, 140, 140);
      const ph = phaseRef.current;

      particlesRef.current.forEach(p => {
        if (ph === 'exit') {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.max(0, p.alpha - 0.025);
        } else if (ph === 'enter' || ph === 'idle') {
          // Spring toward target
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.vx += dx * 0.08;
          p.vy += dy * 0.08;
          p.vx *= 0.82;
          p.vy *= 0.82;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.min(1, p.alpha + 0.04);

          // Idle jitter
          if (ph === 'idle') {
            p.x += (Math.random() - 0.5) * 0.4;
            p.y += (Math.random() - 0.5) * 0.4;
          }
        }

        if (p.alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${(p.alpha * 0.85).toFixed(3)})`;
          ctx.fill();
        }
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [rgb]);

  return <canvas ref={canvasRef} className="ach-nanobot-canvas" />;
};

// ── AchVisual — unique visual per achievement type ───────────────────────
const AchVisual = ({ visual, phase }) => {
  const animCls = phase === 'exit' ? 'vis-out' : phase === 'enter' ? 'vis-in' : '';

  if (visual.type === 'tier') {
    return (
      <div className={`ach-vis ach-vis-tier ${animCls}`}>
        {visual.tiers.map((tier, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className={`ach-tier-arrow${i <= visual.active ? ' reached' : ''}`}>→</span>}
            <span className={`ach-tier-step${i === visual.active ? ' active' : ''}${i < visual.active ? ' passed' : ''}`}>
              {tier}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (visual.type === 'milestone') {
    return (
      <div className={`ach-vis ach-vis-milestone ${animCls}`}>
        <div className="ach-ms-track">
          {visual.steps.map((step, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className={`ach-ms-line${i <= visual.reached ? ' reached' : ''}`} />}
              <div className="ach-ms-step">
                <div className={`ach-ms-dot${i <= visual.reached ? ' reached' : ''}${i === visual.reached ? ' current' : ''}`} />
                <span className={`ach-ms-label${i <= visual.reached ? ' reached' : ''}`}>{step}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  if (visual.type === 'podium') {
    return (
      <div className={`ach-vis ach-vis-podium ${animCls}`}>
        {visual.places.map((place, i) => (
          <div key={i} className={`ach-podium-block${i === visual.active ? ' active' : ''}`}
            style={{ '--h': `${i === 0 ? 56 : i === 1 ? 44 : 32}px` }}>
            <span className="ach-podium-label">{place}</span>
            <div className="ach-podium-bar" />
          </div>
        ))}
      </div>
    );
  }

  if (visual.type === 'bar') {
    const pct = Math.round((visual.value / visual.max) * 100);
    return (
      <div className={`ach-vis ach-vis-bar ${animCls}`}>
        <div className="ach-bar-header">
          <span className="ach-bar-value">{visual.value.toLocaleString()}</span>
          <span className="ach-bar-max">/ {visual.max.toLocaleString()}</span>
        </div>
        <div className="ach-bar-track">
          <div className="ach-bar-fill" style={{ width: `${pct}%` }}>
            <span className="ach-bar-dot" />
          </div>
        </div>
        {visual.label && <span className="ach-bar-label">{visual.label}</span>}
      </div>
    );
  }

  if (visual.type === 'stars') {
    return (
      <div className={`ach-vis ach-vis-stars ${animCls}`}>
        <div className="ach-stars-row">
          {Array.from({ length: visual.total }).map((_, i) => (
            <span key={i} className={`ach-star${i < visual.filled ? ' filled' : ''}`}>★</span>
          ))}
        </div>
        {visual.label && <span className="ach-stars-label">{visual.label}</span>}
      </div>
    );
  }

  if (visual.type === 'rank') {
    return (
      <div className={`ach-vis ach-vis-rank ${animCls}`}>
        <span className="ach-rank-value">{visual.value}</span>
        <div className="ach-rank-meta">
          <span className="ach-rank-label">{visual.label}</span>
          {visual.context && <span className="ach-rank-context">{visual.context}</span>}
        </div>
      </div>
    );
  }

  return null;
};

// ── Achievement Slide — editorial two-column layout ──────────────────────
const AchievementSlide = ({ achievement, phase, onViewCert, slideIndex }) => {
  const cat   = CATEGORY[achievement.category];
  const num   = String(slideIndex + 1).padStart(2, '0');
  const fadeCls = phase === 'exit' ? 'ach-fade fade-out' : phase === 'enter' ? 'ach-fade fade-in' : 'ach-fade';

  return (
    <div className="ach-slide" style={{ '--cat-color': cat.color }}>
      {/* Giant background watermark number */}
      <span className="ach-slide-bg-num">{num}</span>

      {/* ── Left column ── */}
      <div className="ach-col-left">
        <div className="ach-tags-row">
          <ScatterText text={cat.label} phase={phase} tag="span" className="ach-slide-cat" baseDelay={0} />
          {achievement.year && (
            <>
              <span className={`ach-tags-sep ${fadeCls}`}>·</span>
              <span className={`ach-slide-year ${fadeCls}`}>{achievement.year}</span>
            </>
          )}
        </div>

        {/* Only the title gets the dramatic scatter effect */}
        <ScatterText
          text={achievement.title}
          phase={phase}
          tag="h3"
          className="ach-slide-title"
          baseDelay={0.03}
        />

        {/* Subtitle, detail, divider — clean fade transitions */}
        <p className={`ach-slide-subtitle ${fadeCls}`} style={{ '--fade-delay': '0.08s' }}>
          {achievement.subtitle}
        </p>

        <div className={`ach-slide-divider ${fadeCls}`} style={{ '--fade-delay': '0.12s' }} />

        <p className={`ach-slide-detail ${fadeCls}`} style={{ '--fade-delay': '0.16s' }}>
          {achievement.detail}
        </p>

        {/* Unique visual element per achievement */}
        {achievement.visual && (
          <AchVisual visual={achievement.visual} phase={phase} />
        )}
      </div>

      {/* ── Right column ── */}
      <div className="ach-col-right">
        <NanoBotIcon icon={achievement.icon} phase={phase} color={cat.color} />

        {achievement.issuer && (
          <p className={`ach-slide-issuer ${fadeCls}`} style={{ '--fade-delay': '0.14s' }}>
            {achievement.issuer}
          </p>
        )}

        {achievement.link && (
          <button
            className={`ach-slide-cert-btn ${fadeCls}`}
            style={{ '--fade-delay': '0.18s' }}
            onClick={() => onViewCert(achievement)}
          >
            {achievement.linkLabel}
            <span className="ach-cert-arrow">↗</span>
          </button>
        )}
      </div>
    </div>
  );
};

// ── Main section ──────────────────────────────────────────────────────────
const Achievements = () => {
  const sectionRef  = useRef(null);
  const stickyRef   = useRef(null);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });

  const [headerVisible, setHeaderVisible] = useState(false);
  const [displayIndex,  setDisplayIndex]  = useState(0);
  const [phase,         setPhase]         = useState('idle');
  const [certModal,     setCertModal]     = useState(null);

  const displayIndexRef = useRef(0);
  const phaseRef        = useRef('idle');
  const pendingRef      = useRef(0);
  const timerRef        = useRef(null);

  const N = ACHIEVEMENTS.length;

  // Section enter → animate header
  useEffect(() => {
    const el  = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Transition engine
  const startTransition = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    phaseRef.current = 'exit';
    setPhase('exit');

    timerRef.current = setTimeout(() => {
      const target = pendingRef.current;
      displayIndexRef.current = target;
      setDisplayIndex(target);
      phaseRef.current = 'enter';
      setPhase('enter');

      timerRef.current = setTimeout(() => {
        phaseRef.current = 'idle';
        setPhase('idle');
        if (pendingRef.current !== displayIndexRef.current) startTransition();
      }, 700);
    }, 520);
  }, []);

  // Scroll → index
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect      = el.getBoundingClientRect();
      const scrolledIn = -rect.top;
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, scrolledIn / scrollable));
      const newIndex = Math.min(Math.floor(progress * N), N - 1);

      pendingRef.current = newIndex;
      if (newIndex !== displayIndexRef.current && phaseRef.current === 'idle') {
        startTransition();
      }
    };

    root.addEventListener('scroll', onScroll, { passive: true });
    return () => root.removeEventListener('scroll', onScroll);
  }, [N, startTransition]);

  // Mouse → spotlight + starfield parallax
  const handleMouseMove = useCallback((e) => {
    const el = stickyRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mousePosRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height,
    };
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const currentCat = CATEGORY[ACHIEVEMENTS[displayIndex].category];
  const fillPct    = ((displayIndex + 1) / N) * 100;

  return (
    <div
      className="achievements-page"
      ref={sectionRef}
      style={{ height: `calc(${N} * 80vh + 100vh)` }}
    >
      <div
        className="ach-sticky"
        ref={stickyRef}
        onMouseMove={handleMouseMove}
        style={{ '--mx': '50%', '--my': '50%' }}
      >
        {/* Thin progress line — top of panel, color follows category */}
        <div className="ach-prog-track">
          <div
            className="ach-prog-fill"
            style={{ width: `${fillPct}%`, '--cat-color': currentCat.color }}
          />
        </div>

        <StarField mousePosRef={mousePosRef} />
        <div className="ach-spotlight" />
        <div className="ach-ambient-1" />
        <div className="ach-ambient-2" />

        <div className="ach-sticky-inner">

          {/* ── Header ── */}
          <header className={`ach-header${headerVisible ? ' visible' : ''}`}>
            <h2 className="ach-main-title">
              <span className="ach-title-line">ACHIEVE</span>
              <span className="ach-title-line ach-title-accent">MENTS</span>
            </h2>
            <p className="ach-main-subtitle">Certifications, rankings &amp; milestones</p>
          </header>

          {/* Spacer pushes card to the bottom */}
          <div className="ach-spacer" />

          {/* ── Cinematic card — half hidden below viewport ── */}
          <div className="ach-slide-area">
            <AchievementSlide
              key={displayIndex}
              achievement={ACHIEVEMENTS[displayIndex]}
              slideIndex={displayIndex}
              phase={phase}
              onViewCert={setCertModal}
            />
          </div>

        </div>
      </div>

      {certModal && (
        <CertificateModal achievement={certModal} onClose={() => setCertModal(null)} />
      )}
    </div>
  );
};

export default Achievements;
