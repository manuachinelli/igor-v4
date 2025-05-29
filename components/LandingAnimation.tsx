'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import './LandingAnimation.css';

export default function LandingAnimation() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Usuario o contraseña incorrectos.');
    } else {
      router.push('/dashboard');
    }
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
              <input
                type="email"
                name="user"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit">Login</button>
            {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
            <p style={{ fontSize: '0.9rem', textAlign: 'center' }}>
              ¿No tenés cuenta?{' '}
              <a href="/signup" style={{ color: '#0070f3', textDecoration: 'underline' }}>
                Crear una cuenta
              </a>
            </p>
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
