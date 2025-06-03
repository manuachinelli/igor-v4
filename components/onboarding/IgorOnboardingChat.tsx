'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './IgorOnboardingChat.module.css'
import { useRouter } from 'next/navigation'

export default function IgorOnboardingChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [waiting, setWaiting] = useState(false)
  const [onboardingDone, setOnboardingDone] = useState(false)
  const messagesEndRef = useRef(null) as React.MutableRefObject<HTMLDivElement | null>
  const router = useRouter()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getUserId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('igor-user-id') || 'igor-temp'
    }
    return 'igor-temp'
  }

  const sendToN8N = async (text: string) => {
    if (!text.trim()) return
    setWaiting(true)
    const newMessages = [...messages, { sender: 'user', text }]
    setMessages(newMessages)

    try {
      const res = await fetch('https://manuachinelli.app.n8n.cloud/webhook/89bebd77-ed15-4cde-96a1-d04681f3bcd1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userId: getUserId(),
        }),
      })

      const data = await res.json()
      const reply = data.output || data.reply || '...'
      setMessages([...newMessages, { sender: 'assistant', text: reply }])

      if (reply.toLowerCase().includes('onboarding ha finalizado')) {
        setOnboardingDone(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      }
    } catch {
      setMessages([...newMessages, { sender: 'assistant', text: 'Error al conectar con Igor.' }])
    } finally {
      setWaiting(false)
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    sendToN8N(input)
    setInput('')
  }

  if (onboardingDone) {
    return (
      <div className={styles.fullScreenOverlay}>
        Igor se está alistando para ser tu asesor
      </div>
    )
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.userBubble : styles.assistantBubble}`}
          >
            {msg.text}
          </div>
        ))}
        {waiting && <div className={styles.waiting}>Igor está respondiendo...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputSection}>
        <div className={styles.inputBox}>
          <input
            type="text"
            className={styles.input}
            placeholder="Escribí tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={waiting}
          />
          <button
            className={`${styles.iconButton} ${waiting ? styles.disabled : ''}`}
            onClick={handleSend}
            disabled={waiting}
          >
            ➤
          </button>
        </div>
        <div className={styles.status}>Estás hablando con Igor v1.0.0</div>
      </div>
    </div>
  )
}
