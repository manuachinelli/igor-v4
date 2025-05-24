'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './Sidebar.css'

const navItems = [
  { href: '/dashboard', icon: '/sidebar-icons/home.png', alt: 'Inicio' },
  { href: '/dashboard/chat', icon: '/sidebar-icons/chat.png', alt: 'Chat' },
  { href: '/dashboard/automation', icon: '/sidebar-icons/automation.png', alt: 'Automation' },
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
    <div className="sidebar-container">
      <div className="top-items">
        {navItems.map(({ href, icon, alt }) => (
          <Link key={href} href={href}>
            <div className={`icon-box ${pathname === href ? 'active' : ''}`}>
              <img src={icon} alt={alt} />
            </div>
          </Link>
        ))}
      </div>
      <div className="bottom-item">
        <Link href={billingItem.href}>
          <div className={`icon-box ${pathname === billingItem.href ? 'active' : ''}`}>
            <img src={billingItem.icon} alt={billingItem.alt} />
          </div>
        </Link>
      </div>
    </div>
  )
}
