'use client'
import './LandingAnimation.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingAnimation() {
  const router = useRouter()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true)
    }, 4000) // mostrar login luego de 4 segundos
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = () => {
    router.push('/dashboard') // sin validación
  }

  return (
    <div className={`transition-screen ${showLogin ? 'split' : ''}`}>
      <div className="left-panel">
        {showLogin && (
          <div className="login-container">
            <img src="/logo.png" alt="IGOR Logo" className="small-logo" />
            <h2>Iniciar sesión</h2>
            <input type="text" placeholder="User" />
            <input type="password" placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
          </div>
        )}
      </div>
      <div className="right-panel">
        {!showLogin && (
          <div className="igor-welcome">
            <img src="/logo.png" alt="IGOR Logo" className="glow-logo" />
            <p>Say HI to IGOR</p>
          </div>
        )}
      </div>
    </div>
  )
}
