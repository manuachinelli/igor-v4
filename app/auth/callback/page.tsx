'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function GoogleCallbackPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      // Paso 1: obtener usuario autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        setErrorMsg('No se pudo recuperar el usuario. Intentá iniciar sesión de nuevo.')
        setLoading(false)
        return
      }

      // Paso 2: verificar si ya tiene perfil
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        setErrorMsg('Error al verificar el perfil del usuario.')
        setLoading(false)
        return
      }

      // Paso 3: si no existe perfil, lo insertamos
      if (!existingProfile) {
        const { error: insertError } = await supabase.from('profiles').insert([
          {
            id: user.id,
            full_name: user.user_metadata.name || user.user_metadata.full_name || user.email,
            company_name: '',
          }
        ])
        if (insertError) {
          setErrorMsg('No se pudo guardar el perfil del usuario.')
          setLoading(false)
          return
        }
      }

      // Paso 4: guardar en localStorage
      localStorage.setItem('user_id', user.id)
      localStorage.setItem('igor-user-id', user.id)

      // Paso 5: redirigir
      router.push('/onboarding')
    }

    run()
  }, [])

  if (loading) {
    return (
      <p style={{ color: 'white', textAlign: 'center', marginTop: '30vh' }}>
        Redirigiendo...
      </p>
    )
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '30vh', color: 'red' }}>
      <p>{errorMsg || 'Algo salió mal.'}</p>
      <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>Volver al inicio</a>
    </div>
  )
}
