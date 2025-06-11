'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        setErrorMsg('No se pudo recuperar el usuario. Intentá iniciar sesión de nuevo.')
        setLoading(false)
        return
      }

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!existingProfile) {
        await supabase.from('profiles').insert([
          {
            id: user.id,
            full_name: user.user_metadata.full_name || user.email,
            company_name: '',
          },
        ])
      }

      localStorage.setItem('user_id', user.id)
      localStorage.setItem('igor-user-id', user.id)

      router.push('/onboarding')
    }

    run()
  }, [])

  if (loading) {
    return <p style={{ color: 'white', textAlign: 'center', marginTop: '30vh' }}>Redirigiendo...</p>
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '30vh', color: 'red' }}>
      <p>{errorMsg || 'Algo salió mal.'}</p>
      <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>Volver al inicio</a>
    </div>
  )
}
