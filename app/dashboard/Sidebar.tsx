'use client'
import './Sidebar.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', icon: '/sidebar-icons/home.png', alt: 'Inicio' },
    { href: '/dashboard/chat', icon: '/sidebar-icons/chat.png', alt: 'Chat' },
    { href: '/dashboard/flows', icon: '/sidebar-icons/flows.png', alt: 'Flows' },
    { href: '/dashboard/keys', icon: '/sidebar-icons/automation.png', alt: 'Keys' }
    
  ]

  return (
    <div className="sidebar">
      <div className="top-icons">
        {links.map(({ href, icon, alt }) => (
          <Link key={href} href={href}>
            <img
              src={icon}
              alt={alt}
              className={`icon ${pathname === href ? 'active' : ''}`}
            />
          </Link>
        ))}
      </div>
      <div className="bottom-icon">
        <Link href="/dashboard/billing">
          <img
            src="/sidebar-icons/billing.png"
            alt="Billing"
            className={`icon ${pathname === '/dashboard/billing' ? 'active' : ''}`}
          />
        </Link>
      </div>
    </div>
  )
}
