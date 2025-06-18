'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import './LandingAnimation.css';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '700'] });

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
      setTimeout(() => {
        router.push('/dashboard');
      }, 150);
    }
  };

  return (
    <div className={`${dmSans.className} transition-container ${showLogin ? 'split' : 'full'}`}>
      {showLogin && (
        <div className="left-panel">
          <img src="/logo.png" alt="IGOR Logo" className="logo small" />
          <form className="login-form" onSubmit={handleLogin}>
            <h2 className="form-title">Iniciar sesión</h2>
            <p className="form-subtitle">Accedé a tu cuenta para crear y automatizar.</p>
            <label>
              Email
              <input
                type="email"
                name="user"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit">Ingresar</button>
            {error && <p className="error">{error}</p>}
            <p className="signup-link">
              ¿No tenés cuenta? <a href="/signup">Crear una cuenta</a>
            </p>
          </form>
        </div>
      )}
      <div className="right-panel">
        <img src="/logo.png" alt="IGOR Logo" className="logo final" />
        <h1 className="title">Say HI to IGOR</h1>
        <img src="/images/login-illustration.png" alt="Login illustration" className="illustration" />
      </div>
    </div>
  );
}
