'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signupError || !signupData.user) {
      setError(signupError?.message || 'Error al registrar usuario')
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
      setError('Usuario creado, pero falló la creación del perfil')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}>
        <input type="text" placeholder="Nombre completo" value={fullName} onChange={e => setFullName(e.target.value)} required />
        <input type="text" placeholder="Empresa" value={company} onChange={e => setCompany(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Registrarme</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}
