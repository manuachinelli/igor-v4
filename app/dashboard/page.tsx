'use client';

import React from 'react';
import Link from 'next/link';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <Link href="/dashboard">
          <img src="/sidebar-icons/home.png" alt="Inicio" className="sidebar-icon" />
        </Link>
        <Link href="/dashboard/chat">
          <img src="/sidebar-icons/chat.png" alt="Chat" className="sidebar-icon" />
        </Link>
        <Link href="/dashboard/automation">
          <img src="/sidebar-icons/automation.png" alt="Automation" className="sidebar-icon" />
        </Link>
        <Link href="/dashboard/flows">
          <img src="/sidebar-icons/flows.png" alt="Flows" className="sidebar-icon" />
        </Link>
      </div>
      <div className="sidebar-bottom">
        <Link href="/dashboard/billing">
          <img src="/sidebar-icons/billing.png" alt="Billing" className="sidebar-icon" />
        </Link>
      </div>
    </div>
  );
}
