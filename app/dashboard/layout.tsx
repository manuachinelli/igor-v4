// app/dashboard/layout.tsx
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Sidebar from './Sidebar'
import ChatHistoryBar from '@/components/ChatHistoryBar'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'  // fuerza a siempre revalidar la sesión

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1) creamos el cliente en server y le pasamos las cookies
  const supabase = createServerComponentSupabaseClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  // 2) si no hay sesión válida, redirigimos directamente al login
  if (!session) {
    redirect('/')
  }

  // 3) si está logueado, renderizamos el dashboard normal
  const pathname = ''; // no hace falta usePathname en server
  // Si necesitás isChat, podés calcularlo en cliente dentro de page.tsx
  return (
    <html lang="es" className={inter.className}>
      <body style={{ display: 'flex', height: '100vh', margin: 0 }}>
        <Sidebar />
        {/* Si quisieras ChatHistoryBar sólo en /dashboard/chat, hazlo dentro de la page */}
        <main style={{ flexGrow: 1, paddingLeft: '80px' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
