'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function GoogleCallbackPage() {
  const supabase = createClientComponentClient({
  cookieOptions: {
    path: '/',
    sameSite: 'None',
    secure: true,
  },
})

  const router = useRouter()

  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      console.log('🔁 Ejecutando callback...')

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        console.error('❌ auth.getUser ERROR:', authError)
        setErrorMsg('No se pudo recuperar el usuario. Intentá iniciar sesión de nuevo.')
        setLoading(false)
        return
      }

      if (!user) {
        console.warn('⚠️ No hay user, aunque no hubo error.')
        setErrorMsg('Usuario no encontrado. Intentá de nuevo.')
        setLoading(false)
        return
      }

      console.log('✅ Usuario autenticado:', user)

      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Error al buscar perfil:', profileError)
        setErrorMsg('Error al verificar el perfil del usuario.')
        setLoading(false)
        return
      }

      if (!existingProfile) {
        const { error: insertError } = await supabase.from('profiles').insert([
          {
            id: user.id,
            full_name: user.user_metadata.full_name || user.email,
            company_name: '',
          },
        ])

        if (insertError) {
          console.error('❌ No se pudo guardar el perfil:', insertError)
          setErrorMsg('No se pudo guardar el perfil del usuario.')
          setLoading(false)
          return
        }
      }

      localStorage.setItem('user_id', user.id)
      localStorage.setItem('igor-user-id', user.id)

      console.log('🎯 Redirigiendo a onboarding...')
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

