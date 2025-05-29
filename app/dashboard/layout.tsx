// app/dashboard/layout.tsx

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import Sidebar from './Sidebar'
import ChatHistoryBar from '@/components/ChatHistoryBar'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// Fuerza a que siempre revalide la sesión en cada petición
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1) Lee la sesión en el server usando la cookie
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 2) Si no hay sesión, redirige inmediatamente al login
  if (!session) {
    redirect('/')
  }

  // 3) Si está logueado, renderiza el dashboard normalmente
  return (
    <html lang="es" className={inter.className}>
      <body style={{ display: 'flex', height: '100vh', margin: 0 }}>
        <Sidebar />
        {/* Si quieres mostrar ChatHistoryBar solo en /dashboard/chat, hazlo dentro de la page correspondiente */}
        <main style={{ flexGrow: 1, paddingLeft: '80px' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
