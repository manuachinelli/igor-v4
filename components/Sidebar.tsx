'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import './Sidebar.css'

const menuItems = [
  { href: '/dashboard', icon: '/sidebar-icons/home.png', alt: 'Inicio' },
  { href: '/dashboard/chat', icon: '/sidebar-icons/chat.png', alt: 'Chat' },
  { href: '/dashboard/keys', icon: '/sidebar-icons/automation.png', alt: 'Keys' },
  { href: '/dashboard/flows', icon: '/sidebar-icons/flows.png', alt: 'Flows' },
]

// Ya no usamos billingItem directo aquí

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showAccountMenu, setShowAccountMenu] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  const toggleAccountMenu = () => setShowAccountMenu(v => !v)

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        {menuItems.map(item => (
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
        {/* My Account */}
        <button
          type="button"
          className="icon account-btn"
          onClick={toggleAccountMenu}
          aria-label="My account"
        >
          <img
            src="/sidebar-icons/billing.png"
            alt="My Account"
            className="icon"
          />
        </button>

        {/* Menú desplegable */}
        {showAccountMenu && (
          <div className="account-menu">
            <Link href="/dashboard/billing">
              <div className="menu-item">Billing</div>
            </Link>
            <Link href="/dashboard/team">
              <div className="menu-item">My Team</div>
            </Link>
            <div className="menu-item logout-item" onClick={handleLogout}>
              Log out
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
