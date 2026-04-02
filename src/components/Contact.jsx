import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Contact.css';

const REASON_CARDS = [
  {
    label: 'Projects',
    desc: 'Build something amazing together',
    color: '#4ecdc4',
    x: 2,
    y: 0,
    rotate: -3,
    float: 'float-1',
    template: "Hey Tushar! I have a project idea I'd love to discuss with you. Let's build something great together!",
  },
  {
    label: 'Freelance',
    desc: 'Bring your ideas to life',
    color: '#ff6b6b',
    x: 50,
    y: 5,
    rotate: 2,
    float: 'float-2',
    template: "Hi! I'm looking for a freelance developer for my project. Would love to chat about the details.",
  },
  {
    label: 'Coffee Chat',
    desc: 'Just a casual conversation',
    color: '#8b5cf6',
    x: 5,
    y: 42,
    rotate: -2,
    float: 'float-3',
    template: "Hey! No agenda, just wanted to say hi and maybe grab a virtual coffee sometime.",
  },
  {
    label: 'Open Source',
    desc: 'Collaborate on cool projects',
    color: '#FF79C6',
    x: 48,
    y: 45,
    rotate: 3,
    float: 'float-4',
    template: "Hi Tushar! I saw your work and would love to collaborate on an open source project together.",
  },
];

const SOCIAL_LINKS = [
  { label: 'GitHub', value: 'https://github.com/tushar7k9', color: '#ff6b6b', action: 'link' },
  { label: 'LinkedIn', value: 'https://www.linkedin.com/in/tushar-ab0964213', color: '#8b5cf6', action: 'link' },
  { label: 'Email', value: 'tushar7k9@gmail.com', color: '#4ecdc4', action: 'copy' },
];

const Contact = () => {
  const sectionRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [typedText, setTypedText] = useState('');
  const typeIntervalRef = useRef(null);
  const userEditedRef = useRef(false);

  // Scroll progress tracking
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Progress starts when section top is 10% from viewport top (early trigger)
      // but uses a longer scroll range so animations play out smoothly
      const startPoint = viewportHeight * 0.50;
      const scrolled = startPoint - rect.top;
      const scrollRange = viewportHeight * 0.75;

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

  // Typewriter effect when hovering reason cards
  useEffect(() => {
    // Don't override if user has manually typed a message
    if (userEditedRef.current) return;

    if (hoveredCard !== null) {
      // Stop any existing typing
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }

      const template = REASON_CARDS[hoveredCard].template;
      let charIndex = 0;
      setTypedText('');
      setFormData((prev) => ({ ...prev, message: '' }));

      typeIntervalRef.current = setInterval(() => {
        charIndex++;
        const text = template.slice(0, charIndex);
        setTypedText(text);
        setFormData((prev) => ({ ...prev, message: text }));
        if (charIndex >= template.length) {
          clearInterval(typeIntervalRef.current);
          typeIntervalRef.current = null;
        }
      }, 30);
    }
    // On hover out: do NOT clear interval — let typing finish
  }, [hoveredCard]);

  // Track if user manually edits the message
  const handleMessageChange = useCallback((e) => {
    const { value } = e.target;
    userEditedRef.current = value.length > 0;
    setFormData((prev) => ({ ...prev, message: value }));
    setTypedText(value);
  }, []);

  // Card entrance calculation
  const getCardEntrance = useCallback((cardIndex, p) => {
    const threshold = 0.1 + cardIndex * 0.12;
    const cardProgress = Math.max(0, Math.min(1, (p - threshold) / 0.2));
    const eased = 1 - Math.pow(1 - cardProgress, 3);
    return { opacity: eased, scale: 0.7 + eased * 0.3 };
  }, []);

  const handleCopyEmail = useCallback(async (e, email) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
      const body = encodeURIComponent(
        `From: ${formData.name} (${formData.email})\n\n${formData.message}`
      );
      window.location.href = `mailto:tushar7k9@gmail.com?subject=${subject}&body=${body}`;
      setFormStatus('sent');
      setTimeout(() => {
        setFormStatus('idle');
        setFormData({ name: '', email: '', message: '' });
        userEditedRef.current = false;
      }, 3000);
    },
    [formData]
  );

  const p = scrollProgress;

  // Header rises and shrinks as content arrives, stays visible
  const headerOpacity = 1;
  const headerScale = 1 - p * 0.3;
  const headerY = p * -30;

  // Content entrance
  const contentEntrance = Math.max(0, Math.min(1, (p - 0.05) / 0.35));
  const contentEased = 1 - Math.pow(1 - contentEntrance, 3);

  // Form entrance (slightly after cards)
  const formEntrance = Math.max(0, Math.min(1, (p - 0.3) / 0.3));
  const formEased = 1 - Math.pow(1 - formEntrance, 3);

  return (
    <div className="contact-page" ref={sectionRef}>
      <div className={`contact-sticky ${isVisible ? 'animate-in' : ''}`}>
        {/* SVG filter for sketch borders */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="sketch-filter-contact">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.02"
                numOctaves="3"
                result="noise"
                seed="5"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="2"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        {/* Header */}
        <div
          className="contact-header"
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px) scale(${headerScale})`,
          }}
        >
          <h2 className="contact-section-title">
            <span className="title-line">Contact</span>
            <span className="title-line title-highlight">Let's Connect</span>
          </h2>
          <p className="contact-subtitle">
            Always open to new opportunities and conversations
          </p>
        </div>

        {/* Split Layout */}
        <div className="contact-split">
          {/* Left Panel */}
          <div
            className="contact-left"
            style={{
              opacity: contentEased,
              transform: `translateY(${(1 - contentEased) * 25}px)`,
            }}
          >
            <p className="contact-left-heading">
              Whether it's a <span>project</span>, a <span>freelance gig</span>,
              or just a <span>casual chat</span> — I'd love to hear from you.
            </p>

            {/* Floating Reason Cards */}
            <div className="reason-cards-area">
              {REASON_CARDS.map((card, i) => {
                const entrance = getCardEntrance(i, p);
                return (
                  <div
                    key={card.label}
                    className={`reason-card ${card.float} ${hoveredCard === i ? 'reason-card-hovered' : ''}`}
                    style={{
                      '--card-color': card.color,
                      '--base-rotate': `${card.rotate}deg`,
                      '--hover-transform': `translate(${card.x}%, ${card.y - 3}%) rotate(${card.rotate}deg) translateY(-5px)`,
                      left: `${card.x}%`,
                      top: `${card.y}%`,
                      opacity: entrance.opacity,
                      filter: `url(#sketch-filter-contact)`,
                    }}
                    onMouseEnter={() => { if (!userEditedRef.current) setHoveredCard(i); }}
                    onMouseLeave={() => { if (!userEditedRef.current) setHoveredCard(null); }}
                  >
                    <span className="reason-card-label">{card.label}</span>
                    <span className="reason-card-desc">{card.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="contact-socials">
              {SOCIAL_LINKS.map((link, i) => (
                <React.Fragment key={link.label}>
                  {i > 0 && <span className="social-separator">·</span>}
                  {link.action === 'link' ? (
                    <a
                      className="social-link"
                      href={link.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ '--link-color': link.color }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span
                      className="social-link"
                      style={{ '--link-color': link.color }}
                      onClick={(e) => handleCopyEmail(e, link.value)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleCopyEmail(e, link.value);
                      }}
                    >
                      {copiedEmail ? 'Copied!' : link.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Panel — Form */}
          <div
            className="contact-right"
            style={{
              opacity: formEased,
              transform: `translateY(${(1 - formEased) * 30}px)`,
            }}
          >
            <span className="form-label">Drop me a message</span>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="form-field">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="form-field">
                <textarea
                  name="message"
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={handleMessageChange}
                  required
                  rows={5}
                  className={hoveredCard !== null && !userEditedRef.current ? 'typing-active' : ''}
                />
              </div>
              <button
                type="submit"
                className={`form-submit ${formStatus}`}
                disabled={formStatus === 'sending'}
              >
                {formStatus === 'idle' && 'Send Message'}
                {formStatus === 'sending' && 'Sending...'}
                {formStatus === 'sent' && 'Sent!'}
                {formStatus === 'error' && 'Try Again'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
