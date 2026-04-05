import React, { useState, useEffect, useRef } from 'react'
import HomePage from './components/HomePage'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import homePreview from './assets/previews/home.png'
import aboutPreview from './assets/previews/about.png'
import skillsPreview from './assets/previews/skills.png'
import experiencePreview from './assets/previews/experience.png'
import achievementsPreview from './assets/previews/achievements.png'
import contactPreview from './assets/previews/contact.png'
import './App.css'

const SECTIONS = [
  { id: 'home',         label: 'Home',         color: '#4ecdc4', preview: homePreview },
  { id: 'about',        label: 'About',        color: '#9333ea', preview: aboutPreview },
  { id: 'skills',       label: 'Skills',       color: '#4ecdc4', preview: skillsPreview },
  { id: 'experience',   label: 'Work',         color: '#FF79C6', preview: experiencePreview },
  { id: 'achievements', label: 'Awards',       color: '#FFD700', preview: achievementsPreview },
  { id: 'contact',      label: 'Contact',      color: '#ff6b6b', preview: contactPreview },
]

function App() {
  const [activeSection, setActiveSection] = useState(0)
  const [hoveredDot, setHoveredDot] = useState(null)
  const sectionRefs = useRef([])

  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return

    const handleScroll = () => {
      const scrollTop = root.scrollTop
      const viewportHeight = window.innerHeight

      // Find which section is most visible
      let bestIndex = 0
      let bestVisibility = 0

      sectionRefs.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const visible = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
        if (visible > bestVisibility) {
          bestVisibility = visible
          bestIndex = i
        }
      })

      setActiveSection(bestIndex)
    }

    root.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => root.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (index) => {
    const el = sectionRefs.current[index]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="app">
      <div className="page-section" ref={(el) => (sectionRefs.current[0] = el)}>
        <HomePage />
      </div>
      <div className="page-section" ref={(el) => (sectionRefs.current[1] = el)}>
        <About />
      </div>
      <div className="page-section" ref={(el) => (sectionRefs.current[2] = el)}>
        <Skills />
      </div>
      <div className="page-section" ref={(el) => (sectionRefs.current[3] = el)}>
        <Experience />
      </div>
      <div className="page-section" ref={(el) => (sectionRefs.current[4] = el)}>
        <Achievements />
      </div>
      <div className="page-section" ref={(el) => (sectionRefs.current[5] = el)}>
        <Contact />
      </div>

      {/* Side Nav Dots */}
      <nav className="side-nav" aria-label="Section navigation">
        {SECTIONS.map((section, i) => (
          <button
            key={section.id}
            className={`side-nav-dot ${activeSection === i ? 'active' : ''}`}
            style={{ '--dot-color': section.color }}
            onClick={() => scrollToSection(i)}
            onMouseEnter={() => setHoveredDot(i)}
            onMouseLeave={() => setHoveredDot(null)}
            aria-label={`Go to ${section.label}`}
            aria-current={activeSection === i ? 'true' : undefined}
          >
            <span className="dot-pip" />
            <span
              className={`dot-label ${hoveredDot === i || activeSection === i ? 'visible' : ''}`}
            >
              {section.label}
            </span>
            {hoveredDot === i && section.preview && (
              <span className="dot-preview" style={{ '--dot-color': section.color }}>
                <img src={section.preview} alt={section.label} />
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
