'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import CredentialModal from '@/components/CredentialModal'
import styles from './styles.module.css'

type Credential = {
  id: string
  user_id: string
  app_name: string
  cred_username: string
}

export default function KeysPage() {
  const router = useRouter()
  const [creds, setCreds] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Credential | null>(null)

  // calcula tamaño dinámico de las pelotitas:
  const circleSize = creds.length > 0
    ? Math.min(120, Math.max(60, 240 / creds.length))
    : 100

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return router.push('/')
      const { data, error } = await supabase
        .from('credentials')
        .select('id, user_id, app_name, cred_username')
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
        {creds.map((c) => (
          <div
            key={c.id}
            className={styles.circle}
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              fontSize: `${circleSize * 0.3}px`,
            }}
            onClick={() => {
              setSelected(c)
              setModalOpen(true)
            }}
          >
            {c.app_name}
          </div>
        ))}
      </div>

      <button
        className={styles.addBtn}
        onClick={() => {
          setSelected(null)
          setModalOpen(true)
        }}
      >
        ＋
      </button>

      {modalOpen && (
        <CredentialModal
          credential={selected}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
