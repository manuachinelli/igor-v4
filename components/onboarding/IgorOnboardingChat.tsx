'use client'

import { useEffect, useRef, useState } from 'react'

type Message = {
  sender: string
  text: string
}

export default function IgorOnboardingChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [waiting, setWaiting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getUserId = () => {
    return localStorage.getItem('igor_user_id') || ''
  }

  const handleSend = async () => {
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
      setMessages((prev) => [...prev, { sender: 'igor', text: data.message }])
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'igor', text: 'Error al responder.' }])
    }

    setText('')
    setWaiting(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div style={{ padding: '24px', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', marginBottom: 12 }}>
            <div style={{ display: 'inline-block', padding: '8px 12px', borderRadius: 16, background: msg.sender === 'user' ? '#eee' : '#d0eaff' }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={waiting}
          placeholder="Escribí tu mensaje..."
          style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button onClick={handleSend} disabled={waiting || !text.trim()} style={{ padding: '0 16px', borderRadius: 8, backgroundColor: '#222', color: '#fff', border: 'none' }}>
          Enviar
        </button>
      </div>
    </div>
  )
}
