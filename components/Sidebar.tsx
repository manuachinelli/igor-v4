'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './Sidebar.css'

const menuItems = [
  { href: '/dashboard', icon: '/sidebar-icons/inicio.png', alt: 'Inicio' },
  { href: '/dashboard/chats', icon: '/sidebar-icons/chat.png', alt: 'Chat' },
  { href: '/dashboard/keys', icon: '/sidebar-icons/auto.png', alt: 'Keys' },
  { href: '/dashboard/flows', icon: '/sidebar-icons/flows.png', alt: 'Flows' },
]

const billingItem = {
  href: '/dashboard/billing',
  icon: '/sidebar-icons/billing.png',
  alt: 'Billing',
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <img
              src={item.icon}
              alt={item.alt}
              className={`icon ${pathname === item.href ? 'active' : ''}`}
            />
          </Link>
        ))}
      </div>
      <div className="sidebar-bottom">
        <Link href={billingItem.href}>
          <img
            src={billingItem.icon}
            alt={billingItem.alt}
            className={`icon ${pathname === billingItem.href ? 'active' : ''}`}
          />
        </Link>
      </div>
    </div>
  )
}
