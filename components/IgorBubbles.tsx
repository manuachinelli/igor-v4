'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import QueryBubble from './QueryBubble'
import styles from './IgorBubbles.module.css'

interface Bubble {
  id: string
  title: string
  value: string
  x_position: number
  y_position: number
  width: number
  height: number
  color: string
}

export default function IgorBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const fetchBubbles = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData?.user?.id
      if (!userId) return

      const { data } = await supabase
        .from('dashboard_queries')
        .select('*')
        .eq('user_id', userId)

      if (data) setBubbles(data as Bubble[])
    }
    fetchBubbles()
  }, [])

  const handleDelete = async (id: string) => {
    if (id.startsWith('temp-')) {
      setBubbles(prev => prev.filter(b => b.id !== id))
    } else {
      await supabase.from('dashboard_queries').delete().eq('id', id)
      setBubbles(prev => prev.filter(b => b.id !== id))
    }
  }

  const handleSubmit = async () => {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id
    if (!userId || !inputValue) return

    const tempId = `temp-${Date.now()}`
    const tempBubble: Bubble = {
      id: tempId,
      title: inputValue,
      value: 'Cargando...',
      x_position: 100,
      y_position: 100,
      width: 200,
      height: 120,
      color: '#f0f0f0'
    }

    setBubbles(prev => [...prev, tempBubble])
    setShowInput(false)
    setInputValue('')

    await fetch('https://manuachinelli.app.n8n.cloud/webhook/8b913fc3-69df-43c7-9874-1b6a9a697680', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, query: inputValue })
    })

    setTimeout(async () => {
      const { data } = await supabase
        .from('dashboard_queries')
        .select('*')
        .eq('user_id', userId)

      if (data) setBubbles(data as Bubble[])
    }, 5000)
  }

  return (
    <div className={styles.canvas}>
      {/* Zona izquierda: burbujas */}
      <div style={{ flex: 1, position: 'relative' }}>
        {bubbles.map(bubble => (
          <QueryBubble key={bubble.id} bubble={bubble} onDelete={handleDelete} />
        ))}

        {showInput && (
          <div className={styles.inputOverlay}>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="¿Qué querés saber?"
            />
          </div>
        )}
      </div>

      {/* Zona derecha: botones */}
      <div className={styles.floatingPanel}>
        <div className={styles.buttonGroup}>
          <button className={styles.floatingButton} onClick={() => setShowInput(true)}>+</button>
          <button className={styles.textButton} onClick={() => { /* funcionalidad T */ }}>T</button>
          <button className={styles.pencilButton} disabled>✎</button>
        </div>
      </div>
    </div>
  )
}
