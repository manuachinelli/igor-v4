// app/dashboard/layout.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Sidebar from './Sidebar'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// Fuerza a que siempre revalide la sesión en cada petición
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1) Creamos el cliente en server usando las cookies
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 2) Si no hay sesión válida, redirigimos al login
  if (!session) {
    redirect('/')
  }

  // 3) Si está logueado, renderizamos el dashboard
  return (
    <html lang="es" className={inter.className}>
      <body style={{ display: 'flex', height: '100vh', margin: 0 }}>
        <Sidebar />
        <main style={{ flexGrow: 1, paddingLeft: '80px' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
