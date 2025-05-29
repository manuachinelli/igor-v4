'use client'

import { useState, FormEvent } from 'react'
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // aquí va tu lógica de crear/editar
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
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="app" className={styles.label}>Aplicación</label>
            <input
              id="app"
              className={styles.input}
              value={appName}
              onChange={e => setAppName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="user" className={styles.label}>Usuario</label>
            <input
              id="user"
              className={styles.input}
              value={username}
              onChange={e => setUsername(e.target.value)}
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
            />
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancel}`}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className={`${styles.button} ${styles.submit}`}>
              {credential ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
