// app/dashboard/layout.tsx

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import Sidebar from './Sidebar'
import ChatHistoryBar from '@/components/ChatHistoryBar'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'

export const dynamic = 'force-dynamic'
const inter = Inter({ subsets: ['latin'] })

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  // 1) Creamos el cliente con las cookies
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 2) Si no hay sesión, redirigimos antes de renderizar nada
  if (!session) {
    redirect('/')
  }

  // 3) Renderizamos sólo el wrapper, sin html/body
  return (
    <div className={inter.className} style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      {/* Si quisieras ChatHistoryBar sólo en /dashboard/chat, haz esa lógica en la page en vez de aquí */}
      <ChatHistoryBar onNewChat={() => {}} />
      <main style={{ flexGrow: 1, paddingLeft: '80px' }}>
        {children}
      </main>
    </div>
  )
}
