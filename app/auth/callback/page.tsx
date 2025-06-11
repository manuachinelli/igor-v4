'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function GoogleCallbackPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const handleGoogleLogin = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (!user || error) {
        console.error('No se encontró el usuario:', error?.message)
        return
      }

      // Verificar si ya existe el perfil
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!existingProfile) {
        await supabase.from('profiles').insert([{
          id: user.id,
          full_name: user.user_metadata.full_name || user.email,
          company_name: '',
        }])
      }

      // Guardar ID en localStorage
      localStorage.setItem('user_id', user.id)
      localStorage.setItem('igor-user-id', user.id)

      router.push('/onboarding')
    }

    handleGoogleLogin()
  }, [])

  return <p style={{ color: 'white', textAlign: 'center', marginTop: '30vh' }}>Redirigiendo...</p>
}
