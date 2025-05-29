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

    router.push('/dashboard')
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <img src="/sidebar-icons/home.png" alt="Logo" className="signup-logo" />
        <h2 className="signup-title">Crear cuenta</h2>
        <form onSubmit={handleSignup} className="signup-form">
          <input type="text" placeholder="Nombre completo" value={fullName} onChange={e => setFullName(e.target.value)} required />
          <input type="text" placeholder="Empresa" value={company} onChange={e => setCompany(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="password" placeholder="Repetir contraseña" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} required />
          <button type="submit">Registrarme</button>
          {error && <p className="signup-error">{error}</p>}
        </form>
      </div>
    </div>
  )
}
