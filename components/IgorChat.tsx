"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizonal, Mic } from "lucide-react";
import styles from "./IgorChat.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function IgorChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsWaiting(true);

    try {
      const res = await fetch("https://manuachinelli.app.n8n.cloud/webhook/d6a72405-e6de-4e91-80da-9219b57633dd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "igor_user_001",
          message: input,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Ocurrió un error. Intentá de nuevo." }]);
    } finally {
      setIsWaiting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.messageBubble} ${msg.role === "user" ? styles.userBubble : styles.assistantBubble}`}
          >
            {msg.content}
          </div>
        ))}
        {isWaiting && <div className={styles.waiting}>Igor está escribiendo...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className={styles.inputSection}>
        <div className={styles.inputBox}>
          <input
            className={styles.input}
            placeholder="Escribí tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isWaiting}
          />
          <button onClick={sendMessage} className={styles.iconButton} disabled={isWaiting}>
            <SendHorizonal size={18} />
          </button>
          <button className={`${styles.iconButton} ${styles.disabled}`}>
            <Mic size={18} />
          </button>
        </div>
        <div className={styles.status}>Estás hablando con Igor v1.0.0</div>
      </div>
    </div>
  );
}
