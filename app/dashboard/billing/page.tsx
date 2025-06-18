'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import styles from './styles.module.css'

type Subscription = {
  next_billing_date: string
}

type Invoice = {
  id: string
  date: string
  amount: number
  status: string
  pdf_url: string
}

export default function BillingPage() {
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [userCount, setUserCount] = useState<number>(0)
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData?.user?.id
      if (!userId) return

      const { data: metadata } = await supabase
        .from('users_metadata')
        .select('company_id')
        .eq('id', userId)
        .single()

      if (!metadata?.company_id) return
      const company_id = metadata.company_id
      setCompanyId(company_id)

      const { data: subs } = await supabase
        .from('subscriptions')
        .select('next_billing_date')
        .eq('company_id', company_id)
        .single()

      setSubscription(subs)

      const { count } = await supabase
        .from('users_metadata')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company_id)

      setUserCount(count || 0)

      const { data: allInvoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('company_id', company_id)
        .order('date', { ascending: false })

      setInvoices(allInvoices || [])
    }

    fetchData()
  }, [])

  const totalMonthly = userCount * 220

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>Tu plan actual: ${totalMonthly} USD / mes</div>
          <div className={styles.title}>{userCount} usuarios activos</div>
          <div className={styles.subinfo}>
            Próxima facturación: {subscription ? new Date(subscription.next_billing_date).toLocaleDateString() : '-'}
          </div>
        </div>

        <div className={styles.divider} />

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha factura</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Descargar</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{new Date(inv.date).toLocaleDateString()}</td>
                <td>${inv.amount}</td>
                <td>{inv.status}</td>
                <td>
                  {inv.pdf_url ? (
                    <a href={inv.pdf_url} target="_blank" rel="noopener noreferrer">
                      Descargar PDF
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className={styles.addButton}>+</button>
      </div>
    </div>
  )
}
