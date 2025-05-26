'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ChatHistoryBar.module.css';

export default function ChatHistoryBar({ onNewChat }: { onNewChat: () => void }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${styles.chatHistoryBar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.topSection}>
        <Image
          src="/sidebar-icons/chat.png"
          alt="Chat"
          width={48}
          height={48}
          className={styles.logo}
        />
        {!collapsed && (
          <button className={styles.iconButton} onClick={onNewChat}>
            <Plus size={20} />
          </button>
        )}
      </div>
      <button className={styles.toggleButton} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>
  );
}
