// components/Sidebar.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import './Sidebar.css'

const menuItems = [
  { name: 'Inicio', icon: '/sidebar-icons/igor.png', href: '/dashboard' },
  { name: 'Catchup', icon: '/sidebar-icons/chat.png', href: '/dashboard/catchup' },
  { name: 'Automation', icon: '/sidebar-icons/automation.png', href: '/dashboard/automation' },
  { name: 'Flows', icon: '/sidebar-icons/flows.png', href: '/dashboard/flows' },
  { name: 'Billing', icon: '/sidebar-icons/billing.png', href: '/dashboard/billing' }
]

export default function Sidebar() {
  return (
    <div className="sidebar">
      {menuItems.map(item => (
        <Link key={item.name} href={item.href} className="icon-button" title={item.name}>
          <Image src={item.icon} alt={item.name} width={28} height={28} />
        </Link>
      ))}
    </div>
  )
}
