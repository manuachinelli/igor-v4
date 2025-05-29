'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

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
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'black',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Crear cuenta</h2>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '90%', maxWidth: '300px' }}>
        <input type="text" placeholder="Nombre completo" value={fullName} onChange={e => setFullName(e.target.value)} required />
        <input type="text" placeholder="Empresa" value={company} onChange={e => setCompany(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" style={{ backgroundColor: 'white', color: 'black', padding: '0.6rem', fontWeight: 'bold' }}>Registrarme</button>
        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
      </form>
    </div>
  )
}

