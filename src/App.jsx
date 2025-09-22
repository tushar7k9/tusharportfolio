import React from 'react'
import HomePage from './components/HomePage'
import About from './components/About'
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
    </div>
  )
}

export default App
