'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import CredentialModal, { Credential } from '@/components/CredentialModal'
import styles from './styles.module.css'

// Color palette fija de 4 tonos
const COLORS = ['#5DADE2', '#F7DC6F', '#9B59B6', '#2ECC71']

export default function KeysPage() {
  const router = useRouter()
  const [creds, setCreds] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Credential | null>(null)

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return router.push('/')

      const { data, error } = await supabase
        .from('credentials')
        .select('id, user_id, app_name, cred_username, cred_secret')
        .eq('user_id', session.user.id)
        .order('inserted_at', { ascending: false })

      if (error) console.error(error.message)
      else setCreds(data ?? [])

      setLoading(false)
    }
    load()
  }, [router, modalOpen])

  if (loading) return <p className={styles.loading}>Cargando…</p>

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Tus credenciales</h2>

      <div className={styles.grid}>
        {creds.map((c, idx) => {
          // asigna color cíclico por índice
          const bg = COLORS[idx % COLORS.length]
          // tamaño dinámico
          const size = Math.min(120, Math.max(60, 240 / creds.length))
          return (
            <div
              key={c.id}
              className={styles.circle}
              style={{
                background: bg,
                width:  `${size}px`,
                height: `${size}px`,
                fontSize: `${size * 0.3}px`,
              }}
              onClick={() => {
                setSelected(c)
                setModalOpen(true)
              }}
            >
              <span className={styles.circleText}>{c.app_name}</span>
            </div>
          )
        })}
      </div>

      <div className={styles.addWrap}>
        <button
          className={styles.addBtn}
          onClick={() => {
            setSelected(null)
            setModalOpen(true)
          }}
        >
          ＋
        </button>
        <span className={styles.addLabel}>Agregar credencial</span>
      </div>

      {modalOpen && (
        <CredentialModal
          credential={selected}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
