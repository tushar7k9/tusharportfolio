import React from 'react'
import HomePage from './components/HomePage'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Contact from './components/Contact'
import './App.css'

function App() {
  return (
    <div className="app">
      <div className="page-section">
        <HomePage />
      </div>
      <div className="page-section">
        <About />
      </div>
      <div className="page-section">
        <Skills />
      </div>
      <div className="page-section">
        <Experience />
      </div>
      <div className="page-section">
        <Contact />
      </div>
    </div>
  )
}

export default App
