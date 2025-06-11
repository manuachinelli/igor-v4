'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const exchangeCode = async () => {
      const code = new URLSearchParams(window.location.search).get('code')
      if (!code) {
        setError('No se encontró el código de autorización.')
        return
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('[IGOR] ❌ Error al intercambiar código:', exchangeError)
        setError('Error al iniciar sesión. Por favor, intentá nuevamente.')
        return
      }

      // ✅ Pedimos la sesión actual
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData?.session?.user?.id) {
        console.error('[IGOR] ❌ Error al obtener la sesión:', sessionError)
        setError('Error al obtener sesión. Por favor, intentá nuevamente.')
        return
      }

      // ✅ Seteamos el user_id en localStorage igual que en el signup normal
      const userId = sessionData.session.user.id
      localStorage.setItem('user_id', userId)
      localStorage.setItem('igor-user-id', userId)

      console.log('[IGOR] ✅ Sesión creada correctamente con user_id:', userId)

      // ✅ Redirigimos a /onboarding
      router.push('/onboarding')
    }

    exchangeCode()
  }, [router])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff'
    }}>
      <img src="/logo.png" alt="Logo" style={{ width: '100px', marginBottom: '20px' }} />
      <h2>Procesando inicio de sesión...</h2>
      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
    </div>
  )
}
