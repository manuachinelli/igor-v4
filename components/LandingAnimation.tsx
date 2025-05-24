'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './LandingAnimation.css';

export default function LandingAnimation() {
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard'); // redirige directamente
  };

  return (
    <div className={`transition-container ${showLogin ? 'split' : 'full'}`}>
      {showLogin && (
        <div className="left-panel">
          <img src="/logo.png" alt="IGOR Logo" className="logo small" />
          <h2 className="form-title">Iniciar sesión</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <label>
              User
              <input type="text" name="user" />
            </label>
            <label>
              Password
              <input type="password" name="password" />
            </label>
            <button type="submit">Login</button>
          </form>
        </div>
      )}
      <div className="right-panel">
        <img src="/logo.png" alt="IGOR Logo" className="logo final" />
        <h1 className="title">Say HI to IGOR</h1>
      </div>
    </div>
  );
}
