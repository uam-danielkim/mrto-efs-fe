import { useState, useEffect } from 'react'
import './Header.css'

function Header({ onOpenAmhsModal, onResetDemo }) {
  const [utcTime, setUtcTime] = useState('')
  const [selectedAirport, setSelectedAirport] = useState('RKSI')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = String(now.getUTCHours()).padStart(2, '0')
      const m = String(now.getUTCMinutes()).padStart(2, '0')
      const s = String(now.getUTCSeconds()).padStart(2, '0')
      setUtcTime(`${h}:${m}:${s} UTC`)
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="app-header">
      <div className="app-header__left">
        <div className="brand-badge">
          <svg className="ke-logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22, verticalAlign: 'middle', marginRight: 6 }}>
            <circle cx="16" cy="16" r="14" stroke="#0064d2" strokeWidth="2.5"/>
            <path d="M7 16 C10 10, 22 10, 25 16 C22 22, 10 22, 7 16 Z" fill="#c8102e"/>
          </svg>
          <span className="brand-main">전자비행스트립</span>
          <span className="sub-tag">EFS</span>
        </div>
      </div>

      <div className="app-header__center">
        <div className="clock-badge">{utcTime}</div>
        <select 
          className="airport-select"
          value={selectedAirport}
          onChange={(e) => setSelectedAirport(e.target.value)}
        >
          <option value="RKSI">인천국제공항 (RKSI)</option>
          <option value="RKSS">김포국제공항 (RKSS)</option>
          <option value="RKPC">제주국제공항 (RKPC)</option>
          <option value="RKPK">김해국제공항 (RKPK)</option>
          <option value="RKTU">청주국제공항 (RKTU)</option>
          <option value="RKJY">여수공항 (RKJY)</option>
        </select>
      </div>

      <div className="app-header__right">
        <div className="system-pill">
          <span className="pulse-dot"></span>
          <span>AMHS / SIS ONLINE</span>
        </div>
      </div>
    </header>
  )
}

export default Header
