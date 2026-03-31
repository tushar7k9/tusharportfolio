import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Experience.css';

const EXPERIENCE_DATA = [
  {
    year: '2024',
    timeline: 'Jun 2024 — Present',
    company: 'Tech Company',
    role: 'Full-Stack Developer',
    description:
      'Building scalable web applications and leading frontend architecture decisions. Working with React, Node.js, and cloud infrastructure.',
    bullets: [
      'Architected and shipped a customer-facing dashboard serving 10k+ users',
      'Reduced page load time by 40% through code-splitting and lazy loading',
      'Mentored junior developers on React best practices',
    ],
    techStack: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker'],
    achievements: [
      '10k+ active users on dashboard',
      '40% faster page loads',
      'Led team of 4 frontend devs',
    ],
    color: '#FF79C6',
  },
  {
    year: '2023',
    timeline: 'Jan 2023 — May 2024',
    company: 'Startup Inc.',
    role: 'Frontend Engineer',
    description:
      'Developed interactive web experiences using modern frontend technologies. Collaborated closely with design and product teams.',
    bullets: [
      'Built a real-time collaborative editor with WebSocket integration',
      'Implemented a design system used across 5 product verticals',
      'Improved accessibility scores from 65 to 95 across all pages',
    ],
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'WebSockets', 'Figma', 'Jest'],
    achievements: [
      'Design system across 5 products',
      'Accessibility score: 65 → 95',
      'Real-time collab for 500+ users',
    ],
    color: '#4ecdc4',
  },
  {
    year: '2022',
    timeline: 'Jun 2022 — Dec 2022',
    company: 'Innovation Labs',
    role: 'Software Engineering Intern',
    description:
      'Gained hands-on experience in full-stack development, working with agile teams on production-grade applications.',
    bullets: [
      'Developed RESTful APIs with Express and PostgreSQL',
      'Created automated test suites increasing code coverage to 85%',
      'Contributed to an internal tool that reduced deployment time by 30%',
    ],
    techStack: ['Express', 'PostgreSQL', 'Python', 'Git', 'Jenkins', 'Redis'],
    achievements: [
      'Code coverage: 60% → 85%',
      '30% faster deployments',
      'Shipped 3 production features',
    ],
    color: '#8b5cf6',
  },
];

const TOTAL = EXPERIENCE_DATA.length;
const SWIPE_THRESHOLD = 120;
const SWIPE_THRESHOLD_MOBILE = 80;
const CLICK_THRESHOLD = 8;

const Experience = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDir, setSwipeDir] = useState(null);
  const [isSnapping, setIsSnapping] = useState(false);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const sectionRef = useRef(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    maxDelta: 0,
    directionLocked: false,
    isHorizontal: false,
  });

  const isMobile = typeof window !== 'undefined' && 'ontouchstart' in window;
  const threshold = isMobile ? SWIPE_THRESHOLD_MOBILE : SWIPE_THRESHOLD;

  // Cards are "arrived" — cubic ease-out is >0.99 by p=0.78, so cards look stacked early
  const entranceDone = scrollProgress >= 0.75;

  // Scroll progress tracking
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Progress starts when section top hits viewport top (rect.top = 0)
      // and reaches 1 after scrolling ~50% of viewport further
      const scrolled = -rect.top;
      const scrollRange = viewportHeight * 0.5;
      const progress = Math.max(0, Math.min(1, scrolled / scrollRange));
      setScrollProgress(progress);
    };

    root.addEventListener('scroll', handleScroll, { passive: true });
    return () => root.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for header animations
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

  // Global mousemove/mouseup so drag works even if cursor leaves the card
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.startX;
      dragRef.current.maxDelta = Math.max(dragRef.current.maxDelta, Math.abs(dx));
      setDragX(dx);
    };

    const handleGlobalMouseUp = () => {
      if (!dragRef.current.active) return;
      const wasDrag = dragRef.current.maxDelta > CLICK_THRESHOLD;
      dragRef.current.active = false;

      if (!wasDrag) {
        setIsDragging(false);
        setDragX(0);
        toggleFlip(activeIndex);
      } else {
        finishDrag();
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [activeIndex]);

  // Touch move with passive: false for preventDefault
  useEffect(() => {
    const handleTouchMove = (e) => {
      const drag = dragRef.current;
      if (!drag.active) return;

      const touch = e.touches[0];
      const dx = touch.clientX - drag.startX;
      const dy = touch.clientY - drag.startY;

      drag.maxDelta = Math.max(drag.maxDelta, Math.abs(dx));

      if (!drag.directionLocked) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          drag.directionLocked = true;
          drag.isHorizontal = Math.abs(dx) > Math.abs(dy);
        }
        return;
      }

      if (!drag.isHorizontal) {
        drag.active = false;
        setIsDragging(false);
        return;
      }

      e.preventDefault();
      setDragX(dx);
    };

    const handleTouchEnd = () => {
      if (!dragRef.current.active) return;
      const wasDrag = dragRef.current.maxDelta > CLICK_THRESHOLD;
      dragRef.current.active = false;

      if (!wasDrag) {
        setIsDragging(false);
        setDragX(0);
        toggleFlip(activeIndex);
      } else {
        finishDrag();
      }
    };

    const section = sectionRef.current;
    if (!section) return;
    section.addEventListener('touchmove', handleTouchMove, { passive: false });
    section.addEventListener('touchend', handleTouchEnd);
    return () => {
      section.removeEventListener('touchmove', handleTouchMove);
      section.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeIndex]);

  const toggleFlip = useCallback((index) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const finishDrag = useCallback(() => {
    setIsDragging(false);
    setDragX((currentDragX) => {
      if (Math.abs(currentDragX) > threshold) {
        setSwipeDir(currentDragX > 0 ? 'right' : 'left');
      } else {
        setIsSnapping(true);
        setTimeout(() => {
          setDragX(0);
        }, 10);
      }
      return currentDragX;
    });
  }, [threshold]);

  const handleMouseDown = useCallback((e) => {
    if (swipeDir || isSnapping || !entranceDone) return;
    e.preventDefault();
    dragRef.current.active = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.maxDelta = 0;
    setIsDragging(true);
    setDragX(0);
  }, [swipeDir, isSnapping, entranceDone]);

  const handleTouchStart = useCallback((e) => {
    if (swipeDir || isSnapping || !entranceDone) return;
    const touch = e.touches[0];
    dragRef.current.active = true;
    dragRef.current.startX = touch.clientX;
    dragRef.current.startY = touch.clientY;
    dragRef.current.maxDelta = 0;
    dragRef.current.directionLocked = false;
    dragRef.current.isHorizontal = false;
    setIsDragging(true);
    setDragX(0);
  }, [swipeDir, isSnapping, entranceDone]);

  const handleSwipeTransitionEnd = useCallback((e) => {
    if (e.propertyName !== 'transform') return;
    setSwipeDir(null);
    setDragX(0);
    setFlippedCards((prev) => {
      const next = new Set(prev);
      next.delete(activeIndex);
      return next;
    });
    setActiveIndex((prev) => (prev + 1) % TOTAL);
  }, [activeIndex]);

  const handleSnapTransitionEnd = useCallback((e) => {
    if (e.propertyName !== 'transform') return;
    setIsSnapping(false);
    setDragX(0);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (swipeDir || isSnapping || isDragging || !entranceDone) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      setSwipeDir(e.key === 'ArrowLeft' ? 'left' : 'right');
    }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleFlip(activeIndex);
    }
  }, [swipeDir, isSnapping, isDragging, activeIndex, toggleFlip, entranceDone]);

  const getStackPos = (cardIndex) => {
    return (cardIndex - activeIndex + TOTAL) % TOTAL;
  };

  // Scroll-driven card positions
  // p goes 0→1 as user scrolls through the section
  const p = scrollProgress;

  // Header rises and shrinks as cards arrive, but stays visible
  const headerOpacity = 1;
  const headerScale = 1 - p * 0.3; // shrinks to 0.7
  const headerY = p * -30;

  // Cards start scattered far apart (partially off-screen) with rotation
  // As user scrolls (after header hits top), they converge to center and stack
  const getCardFlyTransform = (i) => {
    // Ease out cubic
    const eased = 1 - Math.pow(1 - p, 3);

    // Spread positions: far left, center, far right — like mid-flight
    const spreads = [
      { x: -70, rotate: -15, y: 30 },    // card 0: far left, tilted
      { x: 5, rotate: 3, y: -10 },       // card 1: slightly off center
      { x: 65, rotate: 12, y: 25 },      // card 2: far right, tilted
    ];

    const spread = spreads[i];
    const translateX = spread.x * (1 - eased);    // scattered → 0
    const rotate = spread.rotate * (1 - eased);    // tilted → 0
    const translateY = spread.y * (1 - eased);     // offset → 0

    return { translateX, rotate, translateY, opacity: 1 };
  };

  // Top card transform (only used after entrance)
  const rotation = dragX * 0.08;
  const topCardTransform = swipeDir
    ? undefined
    : `translateX(${dragX}px) rotate(${rotation}deg)`;

  return (
    <div className="experience-page" ref={sectionRef}>
      <div className={`experience-sticky ${isVisible ? 'animate-in' : ''}`}>
        {/* SVG filter for rough/wobbly sketch borders */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="sketch-filter">
              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="2" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        {/* Header — fades out as cards arrive */}
        <div
          className="experience-header"
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px) scale(${headerScale})`,
          }}
        >
          <h2 className="experience-section-title">
            <span className="title-line">Experience</span>
            <span className="title-line title-highlight">Professional Journey</span>
          </h2>
          <p className="experience-subtitle">
            Building impactful software across teams and technologies
          </p>
        </div>

        {/* Card Stack */}
        <div
          className="exp-stack-container"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Experience cards — drag to browse, click to flip"
        >
          {/* Drag hints — show after cards arrive */}
          <div className={`exp-drag-hints ${entranceDone ? 'visible' : ''}`} aria-hidden="true">
            <span className="exp-drag-hint hint-left">&larr;</span>
            <span className="exp-drag-hint hint-right">&rarr;</span>
          </div>

          {EXPERIENCE_DATA.map((exp, i) => {
            const stackPos = getStackPos(i);
            const isTop = stackPos === 0;
            const isFlipped = flippedCards.has(i);

            let cardClass = 'exp-card-wrapper';
            if (entranceDone) {
              if (isTop) {
                cardClass += ' top-card';
                if (isDragging) cardClass += ' dragging';
                if (swipeDir) cardClass += ` swipe-${swipeDir}`;
                if (isSnapping) cardClass += ' snap-back';
              } else {
                cardClass += ' behind';
              }
            }
            if (isFlipped) cardClass += ' flipped';

            // During entrance: scroll-driven position. After: stack position.
            let cardTransform;
            let cardOpacity = 1;
            let cardZIndex = 30 - i * 10;

            if (entranceDone) {
              cardZIndex = 30 - stackPos * 10;
              cardTransform = isTop
                ? topCardTransform
                : `scale(${1 - stackPos * 0.05}) translateY(${stackPos * 15}px)`;
            } else {
              const fly = getCardFlyTransform(i);
              cardTransform = `translateX(${fly.translateX}%) translateY(${fly.translateY}px) rotate(${fly.rotate}deg)`;
              cardOpacity = fly.opacity;
            }

            return (
              <div
                key={i}
                className={cardClass}
                style={{
                  '--card-color': exp.color,
                  zIndex: cardZIndex,
                  transform: cardTransform,
                  opacity: cardOpacity,
                }}
                onMouseDown={isTop && entranceDone ? handleMouseDown : undefined}
                onTouchStart={isTop && entranceDone ? handleTouchStart : undefined}
                onTransitionEnd={isTop && swipeDir ? handleSwipeTransitionEnd : (isTop && isSnapping ? handleSnapTransitionEnd : undefined)}
              >
                {/* Front Face */}
                <div className="exp-card exp-card-front">
                  <span className="exp-card-timeline">{exp.timeline}</span>
                  <span className="exp-card-badge">{exp.company}</span>
                  <h3 className="exp-card-role">{exp.role}</h3>
                  <p className="exp-card-desc">{exp.description}</p>
                  <ul className="exp-card-bullets">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j}>{bullet}</li>
                    ))}
                  </ul>
                  <span className="exp-card-flip-hint">tap to flip &rarr;</span>
                </div>

                {/* Back Face */}
                <div className="exp-card exp-card-back">
                  <span className="exp-card-back-label">Tech Stack</span>
                  <div className="exp-card-tags">
                    {exp.techStack.map((tech, j) => (
                      <span key={j} className="exp-card-tag">{tech}</span>
                    ))}
                  </div>

                  <span className="exp-card-back-label">Key Achievements</span>
                  <ul className="exp-card-achievements">
                    {exp.achievements.map((a, j) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>

                  <span className="exp-card-back-label">Highlights</span>
                  <ul className="exp-card-bullets">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j}>{bullet}</li>
                    ))}
                  </ul>
                  <span className="exp-card-flip-hint">&larr; tap to flip back</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Counter + Dots — visible after cards arrive */}
        <div className={`exp-card-counter ${entranceDone ? 'visible' : ''}`}>
          {activeIndex + 1} / {TOTAL}
        </div>
        <div className={`exp-card-dots ${entranceDone ? 'visible' : ''}`}>
          {EXPERIENCE_DATA.map((exp, i) => (
            <span
              key={i}
              className={`exp-card-dot ${i === activeIndex ? 'active' : ''}`}
              style={{ '--card-color': exp.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
