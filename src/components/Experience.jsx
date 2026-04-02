import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Experience.css';

const EXPERIENCE_DATA = [
  {
    year: '2026',
    timeline: 'Feb 2026 — Present',
    company: 'Razorpay',
    logoDomain: 'razorpay.com',

    role: 'Senior Software Development Engineer',
    description:
      'Driving global payments innovation by building scalable, merchant-friendly solutions that simplify cross-border transactions. Focused on SDK development, seamless checkout integrations, and expanding international payment capabilities while maintaining high performance and flexibility.',
    bullets: [
      'Leading Replit`s Stripe-to-Razorpay migration, enabling cross-border payments for a 40M+ global user base',
      'Architected and delivered a plug-and-play Address Collection SDK in under 20 days',
      'Built a CDN-delivered SDK with extensible pre-payment flows and one-line integration',
      'Enabled seamless injection of pre-checkout workflows without disrupting native experience',
      'Expanded global payment capabilities by enabling UPI for non-INR users',
      'Working on building scalable, merchant-friendly solutions to simplify cross-border payments',
      'Took ownership of designing the Smart Import Collect Flow, a mini SDK that handles the complete pre-payment logic',
      'Ensured the SDK integrates smoothly with Razorpay’s native checkout experience without disrupting existing flows',
      'Reduced dependency on the checkout team for small changes, allowing faster iterations instead of waiting weeks for updates',
      'Made it easier for merchants to directly plug this SDK into payment links and create more interactive buyer information flows',
      'Helped improve flexibility in pre-checkout experiences, enabling quicker experimentation and better adoption across merchants'
    ],
    techStack: ['Payments', 'SDK Development', 'CDN', 'UPI', 'Distributed Systems'],
    achievements: [
      '40M+ users supported',
      'SDK delivered in <20 days',
      'Enabled international UPI payments'
    ],
    color: '#3395FF',
  },
  {
    year: '2026',
    timeline: 'July 2025 — Jan 2026',
    company: 'Kickdrum',
    logoDomain: 'kickdrum.com',
    role: 'Senior Software Engineer (SDE 3)',
    description:
      'Led large-scale system transformations and automation initiatives to drastically improve performance, reliability, and operational efficiency. Specialized in high-volume distributed systems, log intelligence, and building scalable tooling to reduce manual effort and enable real-time processing.',
    bullets: [
      'Led architectural revamp of high-volume messaging framework using React & Java',
      'Reduced processing time from 85 mins to 2-3 mins (96.5% improvement)',
      'Enabled real-time messaging for millions of users',
      'Built GCP log analysis automation handling 2-3M logs per run',
      'Implemented concurrency, intelligent error categorization, and automated reporting',
      'Developed automated agents for security reports, code quality testing, and risk assessment',
      'Saved 100+ engineering hours and contributed to cost savings during M&A due diligence'
    ],
    techStack: ['React', 'Java', 'GCP', 'Concurrency', 'Automation'],
    achievements: [
      '96.5% performance improvement',
      '2-3M logs processed per run',
      '100+ hours of manual effort saved'
    ],
    color: '#FF9F43',
  },
  {
    year: '2023',
    timeline: 'July 2024 — June 2025',
    company: 'Kickdrum',
    logoDomain: 'kickdrum.com',
    role: 'Software Engineer (SDE 2)',
    description:
      'Improved BigQuery process efficiency, reducing query execution time by 50-60%',
    bullets: [
      'Revamped messaging framework for a large-scale ed-tech initiative, reducing processing time by 60%',
      'Resolved database latency issues and handled peak user loads for better stability',
      'Enhanced deduplication for Email & SMS, reducing processing time by 55-60% for ~500K users',
      'Built Python-based GCP log extraction system with threading & concurrency, improving efficiency by 90%',
      'Integrated Google Cloud Functions & GCS for seamless log processing pipeline'
    ],
    techStack: ['Python', 'BigQuery', 'GCP', 'Cloud Functions', 'Cloud Storage'],
    achievements: [
      '50-60% faster query execution',
      '60% reduction in message processing time',
      '90% improvement in log processing efficiency'
    ],
    color: '#4ecdc4',
  },
 {
    year: '2023',
    timeline: 'Jan 2023 — Jun 2024',
    company: 'Kickdrum',
    logoDomain: 'kickdrum.com',
    role: 'Software Developer (SDE 1)',
    description:
      '',
    bullets: [
      'Executed a migration to a serverless architecture, resulting in a remarkable 10x reduction in AWS costs & a significant boost in efficiency, leveraging Serverless Framework',
      'Implemented a CI/CD pipeline & automated CloudFront invalidation processes through AWS to accelerate deployment efficiency, content delivery, & reduce integration time by 50%',
      'Enchanced system security to grade F to A+ on Mozzila Observatory, achieving 105/100 for extra measures.',
      'Streamlined content delivery by implementing automated CloudFront invalidation processes using AWS CloudFront & Lambda, resulting in a 50% boot in delivery speed',
      'Demonstrated major functionalities to clients, escalating client engagement, addressing numerous follow-up queries',
      'Actively contributed to Agile sprints, conducted code reviews, provided effort estimates, and led 30+ interviews while creating 15+ coding questions for campus recruitment.',
    ],
    techStack: ['AWS', 'Lambda', 'CloudFront', 'CI/CD', 'Serverless Framework', 'Spring Boot', 'GraphQL', 'React', 'Java'],
    achievements: [
      '10x AWS cost reduction',
      '50% faster deployments',
      'A+ security rating (105/100',
    ],
    color: '#8b5cf6',
  },
];

const CompanyLogo = ({ domain, company, color }) => {
  const [failed, setFailed] = React.useState(false);
  const initials = company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  if (failed || !domain) {
    return (
      <span className="exp-logo-fallback" style={{ borderColor: color, color }}>
        {initials}
      </span>
    );
  }

  return (
    <img
      className="exp-logo-img"
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt={`${company} logo`}
      onError={() => setFailed(true)}
    />
  );
};

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
  const [backHasMore, setBackHasMore] = useState({});
  const backScrollRefs = useRef({});
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

  // Check back card overflow whenever a card is flipped
  useEffect(() => {
    flippedCards.forEach((index) => {
      setTimeout(() => {
        const el = backScrollRefs.current[index];
        if (el) {
          const hasMore = el.scrollHeight > el.clientHeight + 2;
          setBackHasMore((prev) => ({ ...prev, [index]: hasMore }));
        }
      }, 350); // after flip animation
    });
  }, [flippedCards]);

  const handleBackScroll = useCallback((e, index) => {
    const el = e.currentTarget;
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 5;
    setBackHasMore((prev) => ({ ...prev, [index]: !atBottom }));
  }, []);

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
  const headerScale = 1 - p * 0.3;
  const headerY = p * -30;

  // Subtitle: hidden while cards are scattered, fades in as they converge
  // Cards are fully stacked around p=0.75, so fade in from p=0.45 → 0.75
  const subtitleOpacity = Math.max(0, Math.min(1, (p - 0.45) / 0.3));

  // Cards start scattered far apart (partially off-screen) with rotation
  // As user scrolls (after header hits top), they converge to center and stack
  const getCardFlyTransform = (i) => {
    // Ease out cubic
    const eased = 1 - Math.pow(1 - p, 3);

    // Spread positions distributed evenly across cards
    const spreadConfigs = [
      { x: -70, rotate: -15, y: 30 },
      { x: -20, rotate: -5, y: -10 },
      { x: 25, rotate: 8, y: 20 },
      { x: 70, rotate: 15, y: -5 },
      { x: 50, rotate: 12, y: 30 },
    ];
    const spread = spreadConfigs[i % spreadConfigs.length];
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
          <p
            className="experience-subtitle"
            style={{ opacity: subtitleOpacity, transform: `translateY(${(1 - subtitleOpacity) * 12}px)` }}
          >
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
                : `scale(${1 - stackPos * 0.04}) translateY(${stackPos * 10}px)`;
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
                  <div className="exp-card-company-row">
                    <CompanyLogo domain={exp.logoDomain} company={exp.company} color={exp.color} />
                    <span className="exp-card-badge">{exp.company}</span>
                  </div>
                  <h3 className="exp-card-role">{exp.role}</h3>
                  {exp.description && <p className="exp-card-desc">{exp.description}</p>}
                  <ul className="exp-card-bullets">
                    {exp.bullets.slice(0, 2).map((bullet, j) => (
                      <li key={j}>{bullet}</li>
                    ))}
                    {exp.bullets.length > 2 && (
                      <li className="exp-bullet-peek">{exp.bullets[2]}</li>
                    )}
                  </ul>
                  {exp.bullets.length > 2 && <div className="exp-front-fade" />}
                  <span className="exp-card-flip-hint">tap to flip &rarr;</span>
                </div>

                {/* Back Face */}
                <div className="exp-card exp-card-back">
                  <div
                    className="exp-back-scroll-area"
                    ref={(el) => (backScrollRefs.current[i] = el)}
                    onScroll={(e) => handleBackScroll(e, i)}
                  >
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

                    <span className="exp-card-back-label">All Highlights</span>
                    <ul className="exp-card-bullets">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                  {backHasMore[i] && <div className="exp-back-fade" />}
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
