'use client'
import Link from 'next/link'
import './Sidebar.css'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link href="/dashboard">
        <img src="/sidebar-icons/home.png" alt="Inicio" />
      </Link>
      <Link href="/dashboard/chat">
        <img src="/sidebar-icons/chat.png" alt="Chat" />
      </Link>
      <Link href="/dashboard/automation">
        <img src="/sidebar-icons/automation.png" alt="Automation" />
      </Link>
      <Link href="/dashboard/flows">
        <img src="/sidebar-icons/flows.png" alt="Flows" />
      </Link>

      <div className="sidebar-bottom">
        <Link href="/dashboard/billing">
          <img src="/sidebar-icons/billing.png" alt="Billing" />
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
