'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import './CredentialModal.module.css'

type Props = {
  credential: {
    id: string
    app_name: string
    cred_username: string
    cred_secret?: string
  } | null
  onClose: () => void
}

export default function CredentialModal({ credential, onClose }: Props) {
  const router = useRouter()
  const isEdit = Boolean(credential)
  const [app, setApp] = useState(credential?.app_name || '')
  const [username, setUsername] = useState(credential?.cred_username || '')
  const [secret, setSecret] = useState(credential?.cred_secret || '')
  const [showSecret, setShowSecret] = useState(false)
  const [error, setError] = useState('')

  // Si cambian las props, recarga el formulario
  useEffect(() => {
    setApp(credential?.app_name || '')
    setUsername(credential?.cred_username || '')
    setSecret(credential?.cred_secret || '')
  }, [credential])

  const handleSave = async () => {
    setError('')
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return router.push('/')

    const payload = {
      user_id: session.user.id,
      app_name: app,
      cred_username: username,
      cred_secret: secret,
    }

    let res
    if (isEdit && credential) {
      res = await supabase
        .from('credentials')
        .update(payload)
        .eq('id', credential.id)
    } else {
      res = await supabase.from('credentials').insert([payload])
    }

    if (res.error) setError(res.error.message)
    else onClose()
  }

  return (
    <div className="cm-backdrop" onClick={onClose}>
      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? 'Editar' : 'Nueva'} credencial</h3>

        <label>
          Aplicación
          <input value={app} onChange={(e) => setApp(e.target.value)} />
        </label>

        <label>
          Usuario
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label>
          Clave
          <div className="cm-secret">
            <input
              type={showSecret ? 'text' : 'password'}
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
            <button
              type="button"
              className="cm-eye"
              onClick={() => setShowSecret((v) => !v)}
            >
              {showSecret ? '🙈' : '👁'}
            </button>
          </div>
        </label>

        {error && <p className="cm-error">{error}</p>}

        <div className="cm-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSave}>{isEdit ? 'Guardar' : 'Crear'}</button>
        </div>
      </div>
    </div>
  )
}
