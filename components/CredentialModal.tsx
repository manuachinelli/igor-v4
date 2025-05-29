'use client'

import { useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
import styles from './CredentialModal.module.css'

export type Credential = {
  id: string
  user_id: string
  app_name: string
  cred_username: string
  cred_password?: string
}

type Props = {
  credential: Credential | null
  onClose: () => void
}

export default function CredentialModal({ credential, onClose }: Props) {
  const [appName, setAppName] = useState(credential?.app_name ?? '')
  const [username, setUsername] = useState(credential?.cred_username ?? '')
  const [password, setPassword] = useState(credential?.cred_password ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError || !session) throw new Error('No autenticado')

      const payload = {
        user_id: session.user.id,
        app_name: appName,
        cred_username: username,
        cred_password: password,
      }

      const query = credential
        ? supabase.from('credentials').update(payload).eq('id', credential.id)
        : supabase.from('credentials').insert([payload])

      const { error: resError } = await query
      if (resError) throw resError

      onClose()
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        <h2 className={styles.header}>
          {credential ? 'Editar credencial' : 'Nueva credencial'}
        </h2>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* ← AQUÍ REINGRESAMOS LOS CAMPOS */}
          <div className={styles.field}>
            <label htmlFor="app" className={styles.label}>Aplicación</label>
            <input
              id="app"
              className={styles.input}
              value={appName}
              onChange={e => setAppName(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="user" className={styles.label}>Usuario</label>
            <input
              id="user"
              className={styles.input}
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="pass" className={styles.label}>Clave</label>
            <input
              id="pass"
              type="password"
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required={!credential}
            />
          </div>

          {/* botones */}
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancel}`}
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.submit}`}
              disabled={submitting}
            >
              {submitting
                ? credential ? 'Guardando…' : 'Creando…'
                : credential ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
