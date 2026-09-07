import { useState } from 'react'
import Header from './components/header/Header'
import FlightStripBoard from './components/FlightStripBoard'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <FlightStripBoard />
      </main>
    </div>
  )
}

export default App
