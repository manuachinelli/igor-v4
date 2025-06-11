'use client'

import { useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
import styles from './CredentialModal.module.css'

export type Credential = {
  id: string
  user_id: string
  app_name: string
  cred_username: string
  cred_secret?: string
}

type Props = {
  credential: Credential | null
  onClose: () => void
}

const APPS = [
  { name: 'Google Sheets' },
  { name: 'Google Docs' },
  { name: 'Google Slides' },
  { name: 'Google Drive' },
  { name: 'Microsoft Excel' },
  { name: 'Microsoft Word' },
  { name: 'Microsoft PowerPoint' },
  { name: 'Microsoft OneDrive' },
  { name: 'Dropbox' },
  { name: 'Box' },
  { name: 'Gmail' },
  { name: 'Outlook' },
  { name: 'Microsoft Exchange' },
  { name: 'Yahoo Mail' },
  { name: 'Apple Mail' },
  { name: 'Mailchimp' },
  { name: 'ActiveCampaign' },
  { name: 'Brevo' },
  { name: 'Klaviyo' },
  { name: 'HubSpot Email' },
  { name: 'MailerLite' },
  { name: 'Drip' },
  { name: 'Campaign Monitor' },
  { name: 'Slack' },
  { name: 'Microsoft Teams' },
  { name: 'Discord' },
  { name: 'WhatsApp' },
  { name: 'WhatsApp Business API' },
  { name: 'Telegram' },
  { name: 'Signal' },
  { name: 'Twilio SMS' },
  { name: 'SMSAPI' },
  { name: 'Trello' },
  { name: 'Asana' },
  { name: 'Jira' },
  { name: 'ClickUp' },
  { name: 'Monday.com' },
  { name: 'Notion' },
  { name: 'Airtable' },
  { name: 'Basecamp' },
  { name: 'Todoist' },
  { name: 'Wrike' },
  { name: 'Salesforce' },
  { name: 'HubSpot CRM' },
  { name: 'Pipedrive' },
  { name: 'Zoho CRM' },
  { name: 'Copper' },
  { name: 'Close.io' },
  { name: 'Freshsales' },
  { name: 'Streak CRM' },
  { name: 'Nimble' },
  { name: 'Zendesk' },
  { name: 'Freshdesk' },
  { name: 'Help Scout' },
  { name: 'Intercom' },
  { name: 'Front' },
  { name: 'Crisp' },
  { name: 'LiveAgent' },
  { name: 'Gorgias' },
  { name: 'Zoho Desk' },
  { name: 'Zapier' },
  { name: 'Make' },
  { name: 'n8n' },
  { name: 'Workato' },
  { name: 'Pabbly Connect' },
  { name: 'IFTTT' },
  { name: 'Tray.io' },
  { name: 'Google BigQuery' },
  { name: 'PostgreSQL' },
  { name: 'MySQL' },
  { name: 'MongoDB' },
  { name: 'Firebase' },
  { name: 'Supabase' },
  { name: 'Google Analytics' },
  { name: 'Looker Studio' },
  { name: 'Mixpanel' },
  { name: 'Amplitude' },
  { name: 'Tableau' },
  { name: 'Power BI' },
  { name: 'Metabase' },
  { name: 'Stripe' },
  { name: 'PayPal' },
  { name: 'Square' },
  { name: 'Mercado Pago' },
  { name: 'Shopify Payments' },
  { name: 'QuickBooks' },
  { name: 'Xero' },
  { name: 'Wave' },
  { name: 'ContaSimple' },
  { name: 'Shopify' },
  { name: 'WooCommerce' },
  { name: 'Magento' },
  { name: 'BigCommerce' },
  { name: 'Prestashop' },
  { name: 'Wix' },
  { name: 'Squarespace' },
  { name: 'Ecwid' },
  { name: 'GitHub' },
  { name: 'GitLab' },
  { name: 'Bitbucket' },
  { name: 'AWS' },
  { name: 'Google Cloud' },
  { name: 'Azure' },
  { name: 'Cloudflare' },
  { name: 'Netlify' },
  { name: 'Vercel' },
  { name: 'Okta' },
  { name: 'Auth0' },
  { name: 'Microsoft Azure AD' },
  { name: 'Google Workspace Admin' },
  { name: 'Google Ads' },
  { name: 'Meta Ads' },
  { name: 'LinkedIn Ads' },
  { name: 'TikTok Ads' },
  { name: 'Twitter Ads' },
  { name: 'Pinterest Ads' },
  { name: 'Google Forms' },
  { name: 'Typeform' },
  { name: 'Jotform' },
  { name: 'Tally' },
  { name: 'Wufoo' },
  { name: 'Paperform' },
  { name: 'SurveyMonkey' },
  { name: 'Aircall' },
  { name: 'RingCentral' },
  { name: 'Twilio Voice' },
  { name: 'Dialpad' },
  { name: 'CloudTalk' },
  { name: 'Confluence' },
  { name: 'Guru' },
  { name: 'Slite' },
  { name: 'Coda' }
];

export default function CredentialModal({ credential, onClose }: Props) {
  const [appName, setAppName] = useState(credential?.app_name ?? '')
  const [username, setUsername] = useState(credential?.cred_username ?? '')
  const [secret, setSecret] = useState<string>(credential?.cred_secret ?? '')
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
        user_id:       session.user.id,
        app_name:      appName,
        cred_username: username,
        cred_secret:   secret,
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
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className={styles.header}>
          {credential ? 'Editar credencial' : 'Nueva credencial'}
        </h2>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="app" className={styles.label}>Aplicación</label>
            <input
              id="app"
              className={styles.input}
              list="apps-list"
              value={appName}
              onChange={e => setAppName(e.target.value)}
              required
            />
            <datalist id="apps-list">
              {APPS.map(app => (
                <option key={app.name} value={app.name} />
              ))}
            </datalist>
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
            <label htmlFor="secret" className={styles.label}>Clave</label>
            <input
              id="secret"
              type="password"
              className={styles.input}
              value={secret}
              onChange={e => setSecret(e.target.value)}
              required={!credential}
            />
          </div>

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
                ? credential
                  ? 'Guardando…'
                  : 'Creando…'
                : credential
                ? 'Guardar'
                : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
