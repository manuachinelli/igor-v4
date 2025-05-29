'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        // No hay sesión → volvemos al login
        router.replace('/')
      }
    }
    check()
  }, [router])

  return <>{children}</>
}
