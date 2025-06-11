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
      console.log('[IGOR] 🔁 Callback iniciado')

    const { data, error } = await supabase.auth.getSession()
const session = data.session
console.log('[IGOR] ✅ Sesión recibida:', session)

if (error || !session || !session.user) {

        console.error('[IGOR] ❌ Error al obtener sesión:', error)
        setErrorMsg('No se pudo recuperar el usuario. Intentá iniciar sesión de nuevo.')
        setLoading(false)
        return
      }

      const user = session.user
      console.log('[IGOR] ✅ Usuario:', user)

      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('[IGOR] ❌ Error al buscar perfil:', profileError)
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
          console.error('[IGOR] ❌ Error al guardar perfil:', insertError)
          setErrorMsg('No se pudo guardar el perfil del usuario.')
          setLoading(false)
          return
        }

        console.log('[IGOR] ✅ Perfil insertado')
      } else {
        console.log('[IGOR] 🔎 Perfil ya existe')
      }

      localStorage.setItem('user_id', user.id)
      localStorage.setItem('igor-user-id', user.id)
      console.log('[IGOR] 💾 Usuario guardado en localStorage')

      router.push('/onboarding')
      console.log('[IGOR] 🚀 Redirigiendo a /onboarding')
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
