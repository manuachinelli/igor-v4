'use client';

import { useState } from 'react';
import styles from './ChatHistoryBar.module.css';
import Image from 'next/image';

export default function ChatHistoryBar() {
  const [isOpen, setIsOpen] = useState(true);
  const [chats, setChats] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const handleNewChat = () => {
    if (selected !== null) {
      const currentTitle = `Chat ${chats.length + 1}`;
      setChats([...chats, currentTitle]);
    }
    setSelected(null);
  };

  return (
    <div className={`${styles.historyBar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <Image src="/sidebar-icons/chat.png" alt="Igor Chat" width={48} height={48} />
        <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '←' : '→'}
        </button>
      </div>

      {isOpen && (
        <div className={styles.chatList}>
          {chats.map((title, index) => (
            <div
              key={index}
              className={`${styles.chatItem} ${selected === index ? styles.selected : ''}`}
              onClick={() => setSelected(index)}
            >
              {title}
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className={styles.newChatSection}>
          <button className={styles.newChatButton} onClick={handleNewChat}>
            ＋
          </button>
        </div>
      )}
    </div>
  );
}
