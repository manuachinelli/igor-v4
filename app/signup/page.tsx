'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import './page.css'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== repeatPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signupError || !signupData.user) {
      setError(signupError?.message || 'Error al crear usuario')
      return
    }

    const userId = signupData.user.id
    localStorage.setItem('user_id', userId)       // Para compatibilidad con el resto de la app
    localStorage.setItem('igor-user-id', userId)  // Para que onboarding lo use bien

    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: userId,
        full_name: fullName,
        company_name: company,
      },
    ])

    if (profileError) {
      setError('Usuario creado, pero falló al guardar el perfil')
      return
    }

    router.push('/onboarding')
  }

  return (
    <div className="signup-wrapper">
      <div className="signup-left">
        <img src="/logo.png" alt="Logo" className="signup-logo-final" />
        <h1 className="signup-title">Say HI to IGOR</h1>
      </div>

      <div className="signup-right">
        <img src="/logo.png" alt="Logo" className="signup-logo-small" />
        <h2 className="signup-form-title">Crear cuenta</h2>
        <form onSubmit={handleSignup} className="signup-form">
          <input type="text" placeholder="Nombre completo" value={fullName} onChange={e => setFullName(e.target.value)} required />
          <input type="text" placeholder="Empresa" value={company} onChange={e => setCompany(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="password" placeholder="Repetir contraseña" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} required />
          <button type="submit">Registrarme</button>
          {error && <p className="signup-error">{error}</p>}
          <div className="google-login-wrapper">
  <p className="signup-divider">o</p>
  <button
    type="button"
    className="google-button"
    onClick={async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://www.igors.app/auth/callback', // ← cambiá esto si tu dominio es otro
        },
      });

      if (error) {
        console.error('Error al iniciar sesión con Google:', error.message);
      }
    }}
  >
    Registrarme con Google
  </button>
</div>

        </form>
        <p className="signup-footer">
          ¿Ya tenés cuenta?{' '}
          <a href="/">Iniciar sesión</a>
        </p>
      </div>
    </div>
  )
}
