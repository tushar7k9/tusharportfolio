import React from 'react'
import HomePage from './components/HomePage'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
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
    </div>
  )
}

export default App
