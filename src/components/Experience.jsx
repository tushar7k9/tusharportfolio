import React, { useState, useEffect, useRef } from 'react';
import './Experience.css';

const EXPERIENCE_DATA = [
  {
    year: '2024',
    company: 'Tech Company',
    role: 'Full-Stack Developer',
    description:
      'Building scalable web applications and leading frontend architecture decisions. Working with React, Node.js, and cloud infrastructure.',
    bullets: [
      'Architected and shipped a customer-facing dashboard serving 10k+ users',
      'Reduced page load time by 40% through code-splitting and lazy loading',
      'Mentored junior developers on React best practices',
    ],
    color: '#FF79C6',
  },
  {
    year: '2023',
    company: 'Startup Inc.',
    role: 'Frontend Engineer',
    description:
      'Developed interactive web experiences using modern frontend technologies. Collaborated closely with design and product teams.',
    bullets: [
      'Built a real-time collaborative editor with WebSocket integration',
      'Implemented a design system used across 5 product verticals',
      'Improved accessibility scores from 65 to 95 across all pages',
    ],
    color: '#4ecdc4',
  },
  {
    year: '2022',
    company: 'Innovation Labs',
    role: 'Software Engineering Intern',
    description:
      'Gained hands-on experience in full-stack development, working with agile teams on production-grade applications.',
    bullets: [
      'Developed RESTful APIs with Express and PostgreSQL',
      'Created automated test suites increasing code coverage to 85%',
      'Contributed to an internal tool that reduced deployment time by 30%',
    ],
    color: '#8b5cf6',
  },
];

const Experience = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [timelineActive, setTimelineActive] = useState(false);
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);

  // Observe section for timeline activation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimelineActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Observe individual timeline items
  useEffect(() => {
    const observers = [];

    itemRefs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, index]));
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div
      className={`experience-page ${timelineActive ? 'animate-in' : ''}`}
      ref={sectionRef}
    >
      {/* Header */}
      <div className="experience-header">
        <h2 className="experience-section-title">
          <span className="title-line">Experience</span>
          <span className="title-line title-highlight">Professional Journey</span>
        </h2>
        <p className="experience-subtitle">
          Building impactful software across teams and technologies
        </p>
      </div>

      {/* Timeline */}
      <div className="exp-timeline-container">
        <div className="exp-timeline-line">
          <div className="exp-timeline-progress" />
        </div>

        {EXPERIENCE_DATA.map((exp, i) => (
          <div
            key={i}
            className={`exp-timeline-item ${visibleItems.has(i) ? 'in-view' : ''}`}
            ref={(el) => (itemRefs.current[i] = el)}
            style={{ '--item-color': exp.color, '--index': i }}
          >
            <div className="exp-timeline-marker">
              <span className="exp-timeline-year">{exp.year}</span>
            </div>
            <div className="exp-timeline-content">
              <span className="exp-timeline-badge">{exp.company}</span>
              <h3 className="exp-timeline-title">{exp.role}</h3>
              <p className="exp-timeline-description">{exp.description}</p>
              <ul className="exp-timeline-bullets">
                {exp.bullets.map((bullet, j) => (
                  <li key={j}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
