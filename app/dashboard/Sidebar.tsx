'use client'

import React from 'react'
import Link from 'next/link'
import './Sidebar.css'

const navItems = [
  { href: '/dashboard', icon: '/my-igor.png', alt: 'My IGOR' },
  { href: '/catchup', icon: '/igor-catchup.png', alt: 'Catchup' },
  { href: '/automation', icon: '/igor-automation.png', alt: 'Automation' },
  { href: '/flows', icon: '/igor-flows.png', alt: 'Flows' }
]

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="nav-buttons">
        {navItems.map((item, index) => (
          <Link key={index} href={item.href} className="sidebar-button" title={item.alt}>
            <img src={item.icon} alt={item.alt} />
          </Link>
        ))}
      </div>
      <div className="billing-button">
        <Link href="/billing" className="sidebar-button" title="Billing Info">
          <img src="/billing.png" alt="Billing Info" />
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
