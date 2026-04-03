import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Skills.css';

const CATEGORIES = [
  { id: 'all', label: 'All', color: '#ffffff' },
  { id: 'languages', label: 'Languages', color: '#FF79C6' },
  { id: 'frontend', label: 'Frontend', color: '#4ecdc4' },
  { id: 'backend', label: 'Backend', color: '#ff6b6b' },
  { id: 'databases', label: 'Databases', color: '#8b5cf6' },
  { id: 'devops', label: 'DevOps', color: '#7ee787' },
  { id: 'tools', label: 'Tools', color: '#79c0ff' },
];

const SKILLS_DATA = [
  { name: 'JavaScript', category: 'languages', level: 92 },
  { name: 'TypeScript', category: 'languages', level: 85 },
  { name: 'Python', category: 'languages', level: 80 },
  { name: 'Java', category: 'languages', level: 72 },
  { name: 'C++', category: 'languages', level: 65 },
  { name: 'React', category: 'frontend', level: 90 },
  { name: 'Next.js', category: 'frontend', level: 82 },
  { name: 'Tailwind CSS', category: 'frontend', level: 88 },
  { name: 'Three.js', category: 'frontend', level: 70 },
  { name: 'Node.js', category: 'backend', level: 87 },
  { name: 'Express', category: 'backend', level: 85 },
  { name: 'Django', category: 'backend', level: 68 },
  { name: 'REST APIs', category: 'backend', level: 90 },
  { name: 'PostgreSQL', category: 'databases', level: 78 },
  { name: 'MongoDB', category: 'databases', level: 82 },
  { name: 'Redis', category: 'databases', level: 65 },
  { name: 'Docker', category: 'devops', level: 75 },
  { name: 'AWS', category: 'devops', level: 70 },
  { name: 'CI/CD', category: 'devops', level: 72 },
  { name: 'Git', category: 'devops', level: 90 },
  { name: 'VS Code', category: 'tools', level: 95 },
  { name: 'Figma', category: 'tools', level: 70 },
  { name: 'Linux', category: 'tools', level: 78 },
  { name: 'Postman', category: 'tools', level: 80 },
];

const getCategoryColor = (categoryId) => {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  return cat ? cat.color : '#ffffff';
};

const fibonacciSphere = (count) => {
  const points = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / count);
    const phi = (2 * Math.PI * i) / goldenRatio;
    points.push({
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(theta),
    });
  }
  return points;
};

const generateLightning = (x1, y1, x2, y2, depth) => {
  if (depth === 0) return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const offset = (Math.random() - 0.5) * len * 0.35;
  const nx = -dy / len;
  const ny = dx / len;
  const mx = midX + nx * offset;
  const my = midY + ny * offset;
  const left = generateLightning(x1, y1, mx, my, depth - 1);
  const right = generateLightning(mx, my, x2, y2, depth - 1);
  return [...left, ...right.slice(1)];
};

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const cloudRef = useRef(null);
  const pointsRef = useRef(fibonacciSphere(SKILLS_DATA.length));
  const rotationRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0.003, y: 0.005 });
  const mouseRef = useRef({ active: false, dragging: false, x: 0, y: 0, lastX: 0, lastY: 0 });
  const animFrameRef = useRef(null);
  const wordElsRef = useRef([]);
  const canvasRef = useRef(null);
  const lightningRef = useRef({
    targets: [],
    nextSwitch: 0,
    bolts: [],
    shockedWords: new Set(),
  });

  // Scroll progress tracking
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      // How far we've scrolled into the section (0 = just entered, 1 = about to leave)
      const scrolled = -rect.top;
      const scrollRange = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolled / scrollRange));
      setScrollProgress(progress);
    };

    root.addEventListener('scroll', handleScroll, { passive: true });
    return () => root.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 3D sphere rotation + lightning animation
  useEffect(() => {
    if (!isVisible) return;

    const RADIUS = 1;
    const points = pointsRef.current;

    const rotatePoint = (p, rx, ry) => {
      let x = p.x * Math.cos(ry) - p.z * Math.sin(ry);
      let z = p.x * Math.sin(ry) + p.z * Math.cos(ry);
      let y = p.y;
      const y2 = y * Math.cos(rx) - z * Math.sin(rx);
      const z2 = y * Math.sin(rx) + z * Math.cos(rx);
      return { x, y: y2, z: z2 };
    };

    const animate = () => {
      const mouse = mouseRef.current;

      if (mouse.wordHovered) {
        velocityRef.current.x *= 0.85;
        velocityRef.current.y *= 0.85;
      } else if (mouse.dragging) {
        velocityRef.current.y = mouse.dx * 0.008;
        velocityRef.current.x = mouse.dy * 0.008;
        mouse.dx = 0;
        mouse.dy = 0;
      } else if (mouse.active) {
        const targetVY = mouse.x * 0.012;
        const targetVX = mouse.y * -0.006;
        velocityRef.current.y += (targetVY - velocityRef.current.y) * 0.04;
        velocityRef.current.x += (targetVX - velocityRef.current.x) * 0.04;
      } else {
        velocityRef.current.x *= 0.98;
        velocityRef.current.y *= 0.98;
        if (Math.abs(velocityRef.current.y) < 0.004) {
          velocityRef.current.y += (0.005 - velocityRef.current.y) * 0.01;
        }
        if (Math.abs(velocityRef.current.x) < 0.002) {
          velocityRef.current.x += (0.003 - velocityRef.current.x) * 0.01;
        }
      }

      rotationRef.current.x += velocityRef.current.x;
      rotationRef.current.y += velocityRef.current.y;

      const rx = rotationRef.current.x;
      const ry = rotationRef.current.y;

      for (let i = 0; i < points.length; i++) {
        const el = wordElsRef.current[i];
        if (!el) continue;

        const rotated = rotatePoint(points[i], rx, ry);
        const scale = (rotated.z + RADIUS) / (2 * RADIUS);
        const opacity = 0.15 + scale * 0.85;
        const size = 0.6 + scale * 0.5;
        const blur = Math.max(0, (1 - scale) * 2.5);

        const projX = rotated.x * 42 + 50;
        const projY = rotated.y * 42 + 50;

        el.style.left = `${projX}%`;
        el.style.top = `${projY}%`;
        el.style.opacity = opacity;
        el.style.transform = `translate(-50%, -50%) scale(${size})`;
        el.style.filter = `blur(${blur}px)`;
        el.style.zIndex = Math.round(scale * 100);
      }

      // --- Lightning ---
      const canvas = canvasRef.current;
      const cloud = cloudRef.current;
      if (canvas && cloud) {
        const cw = cloud.offsetWidth;
        const ch = cloud.offsetHeight;
        if (canvas.width !== cw * 2 || canvas.height !== ch * 2) {
          canvas.width = cw * 2;
          canvas.height = ch * 2;
          canvas.style.width = cw + 'px';
          canvas.style.height = ch + 'px';
        }
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const now = performance.now();
        const lt = lightningRef.current;

        if (now > lt.nextSwitch) {
          const count = 1 + Math.floor(Math.random() * 2);
          const candidates = [];
          for (let i = 0; i < points.length; i++) {
            if (wordElsRef.current[i]) candidates.push(i);
          }
          lt.targets = [];
          lt.shockedWords = new Set();
          for (let c = 0; c < count && candidates.length > 0; c++) {
            const pick = Math.floor(Math.random() * candidates.length);
            lt.targets.push(candidates[pick]);
            lt.shockedWords.add(candidates[pick]);
            candidates.splice(pick, 1);
          }
          lt.nextSwitch = now + 1500 + Math.random() * 1500;
        }

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (const idx of lt.targets) {
          const el = wordElsRef.current[idx];
          if (!el) continue;

          const elLeft = parseFloat(el.style.left) / 100;
          const elTop = parseFloat(el.style.top) / 100;
          const tx = elLeft * canvas.width;
          const ty = elTop * canvas.height;

          const boltPoints = generateLightning(centerX, centerY, tx, ty, 5);

          if (Math.random() > 0.25) {
            ctx.beginPath();
            ctx.moveTo(boltPoints[0].x, boltPoints[0].y);
            for (let p = 1; p < boltPoints.length; p++) ctx.lineTo(boltPoints[p].x, boltPoints[p].y);
            ctx.strokeStyle = 'rgba(180, 200, 255, 0.9)';
            ctx.lineWidth = 2;
            ctx.shadowColor = 'rgba(140, 180, 255, 0.8)';
            ctx.shadowBlur = 15;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(boltPoints[0].x, boltPoints[0].y);
            for (let p = 1; p < boltPoints.length; p++) ctx.lineTo(boltPoints[p].x, boltPoints[p].y);
            ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
            ctx.lineWidth = 6;
            ctx.shadowColor = 'rgba(100, 150, 255, 0.5)';
            ctx.shadowBlur = 30;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(boltPoints[0].x, boltPoints[0].y);
            for (let p = 1; p < boltPoints.length; p++) ctx.lineTo(boltPoints[p].x, boltPoints[p].y);
            ctx.strokeStyle = 'rgba(220, 235, 255, 0.95)';
            ctx.lineWidth = 1;
            ctx.shadowColor = 'rgba(200, 220, 255, 1)';
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.shadowBlur = 0;

            for (let p = 2; p < boltPoints.length - 1; p += 2) {
              if (Math.random() < 0.3) {
                const branchLen = 15 + Math.random() * 25;
                const angle = Math.atan2(ty - centerY, tx - centerX) + (Math.random() - 0.5) * 2;
                ctx.beginPath();
                ctx.moveTo(boltPoints[p].x, boltPoints[p].y);
                ctx.lineTo(boltPoints[p].x + Math.cos(angle) * branchLen, boltPoints[p].y + Math.sin(angle) * branchLen);
                ctx.strokeStyle = 'rgba(160, 190, 255, 0.5)';
                ctx.lineWidth = 1;
                ctx.shadowColor = 'rgba(140, 180, 255, 0.4)';
                ctx.shadowBlur = 8;
                ctx.stroke();
                ctx.shadowBlur = 0;
              }
            }
          }

          if (el && lt.shockedWords.has(idx)) el.classList.add('word-shocked');
        }

        for (let i = 0; i < wordElsRef.current.length; i++) {
          const el = wordElsRef.current[i];
          if (el && !lt.shockedWords.has(i)) el.classList.remove('word-shocked');
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isVisible]);

  const handleMouseDown = useCallback((e) => {
    const m = mouseRef.current;
    m.dragging = true;
    m.lastX = e.clientX;
    m.lastY = e.clientY;
    m.dx = 0;
    m.dy = 0;
  }, []);

  const handleMouseMove = useCallback((e) => {
    const m = mouseRef.current;
    if (m.dragging) {
      m.dx = e.clientX - m.lastX;
      m.dy = e.clientY - m.lastY;
      m.lastX = e.clientX;
      m.lastY = e.clientY;
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      m.active = true;
      m.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      m.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.dragging = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.dragging = false;
    mouseRef.current.active = false;
  }, []);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    const m = mouseRef.current;
    m.dragging = true;
    m.lastX = touch.clientX;
    m.lastY = touch.clientY;
    m.dx = 0;
    m.dy = 0;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    const m = mouseRef.current;
    if (m.dragging) {
      m.dx = touch.clientX - m.lastX;
      m.dy = touch.clientY - m.lastY;
      m.lastX = touch.clientX;
      m.lastY = touch.clientY;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    mouseRef.current.dragging = false;
  }, []);

  // Scroll-driven values
  // Phase 1 (0-0.33): header fades out, filters start rising
  // Phase 2 (0.15-0.8): sphere grows, filters glide to top and scale up
  // Phase 3 (0.8-1.0): fully expanded, interactive zone
  const p = scrollProgress;

  // Header: original speed — fades 0→0.33
  const headerOpacity = Math.max(0, 1 - p * 3);
  const headerY = p * -60;

  // Subtitle: starts invisible, fades in when visible, then fades out fast before filter overlaps
  const subtitleOpacity = !isVisible ? 0 : Math.max(0, 1 - p * 7);

  const filterScale = 1 + Math.min(p, 0.8) * 0.25;        // 1 → 1.2
  const filterRise = Math.min(p * 1.25, 1);
  const filterTranslateY = filterRise * -290;
  const filterBgOpacity = Math.max(0, (filterRise - 0.5) * 2);
  const sphereScale = 1 + Math.min(Math.max(p - 0.15, 0) / 0.65, 1) * 0.6;
  const sphereRise = Math.min(p * 1.25, 1);
  const sphereTranslateY = sphereRise * -140;

  return (
    <div className="skills-page" ref={sectionRef}>
      <div
        className={`skills-sticky ${isVisible ? 'animate-in' : ''}`}
        ref={stickyRef}
      >
        {/* Header — fades out as user scrolls */}
        <div
          className="skills-header"
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            pointerEvents: headerOpacity < 0.1 ? 'none' : 'auto',
          }}
        >
          <h2 className="skills-section-title">
            <span className="title-line">Skills</span>
            <span className="title-line title-highlight">& Expertise</span>
          </h2>
          <p className="skills-subtitle" style={{ opacity: subtitleOpacity }}>
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Filters — grow and stick to top */}
        <div
          className="skills-filters"
          style={{
            transform: `translateY(${filterTranslateY}px) scale(${filterScale})`,
            background: 'transparent',
            padding: filterRise > 0.3 ? `${12 * filterRise}px ${20 * filterRise}px` : undefined,
            borderRadius: filterRise > 0.5 ? '0 0 16px 16px' : undefined,
            backdropFilter: filterBgOpacity > 0 ? `blur(${filterBgOpacity * 12}px)` : undefined,
            WebkitBackdropFilter: filterBgOpacity > 0 ? `blur(${filterBgOpacity * 12}px)` : undefined,
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              style={{ '--filter-color': cat.color }}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 3D Word Cloud Sphere — grows as user scrolls */}
        <div
          className="sphere-cloud"
          ref={cloudRef}
          style={{
            transform: `translateY(${sphereTranslateY}px) scale(${sphereScale})`,
            zIndex: 100,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="sphere-glow" aria-hidden="true" />
          <div className="orbit-ring orbit-ring-1" aria-hidden="true" />
          <div className="orbit-ring orbit-ring-2" aria-hidden="true" />
          <div className="orbit-ring orbit-ring-3" aria-hidden="true" />
          <canvas ref={canvasRef} className="lightning-canvas" aria-hidden="true" />

          {SKILLS_DATA.map((skill, i) => {
            const color = getCategoryColor(skill.category);
            const isDimmed = activeCategory !== 'all' && skill.category !== activeCategory;
            const isHovered = hoveredSkill === skill.name;
            const baseFontSize = 0.8 + (skill.level - 60) / 60;

            return (
              <span
                key={skill.name}
                ref={(el) => (wordElsRef.current[i] = el)}
                className={`sphere-word ${isDimmed ? 'dimmed' : ''} ${isHovered ? 'word-hovered' : ''}`}
                style={{
                  '--word-color': color,
                  '--base-size': `${baseFontSize}rem`,
                  opacity: 0,
                }}
                onMouseEnter={() => { setHoveredSkill(skill.name); mouseRef.current.wordHovered = true; }}
                onMouseLeave={() => { setHoveredSkill(null); mouseRef.current.wordHovered = false; }}
              >
                {skill.name}
                {isHovered && (
                  <span className="sphere-tooltip">
                    <span className="tooltip-level">{skill.level}%</span>
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Skills;
