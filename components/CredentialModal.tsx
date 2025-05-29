'use client';

import React, { useState } from 'react';
import './CredentialModal.css';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (app: string, user: string, secret: string) => Promise<void>;
};

export default function CredentialModal({ open, onClose, onSave }: Props) {
  const [appName, setAppName] = useState('');
  const [username, setUsername] = useState('');
  const [secret, setSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(appName.trim(), username.trim(), secret);
    setSaving(false);
    // reset form
    setAppName('');
    setUsername('');
    setSecret('');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Nueva credencial</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            placeholder="Aplicación (ej. Slack)"
            value={appName}
            onChange={e => setAppName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Usuario de la credencial"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <div className="secret-wrapper">
            <input
              type={showSecret ? 'text' : 'password'}
              placeholder="Secreto / Contraseña"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowSecret(v => !v)}
              aria-label={showSecret ? 'Ocultar' : 'Mostrar'}
            >
              {showSecret ? '🙈' : '👁️'}
            </button>
          </div>
          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? 'Guardando…' : 'Save'}
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
}
