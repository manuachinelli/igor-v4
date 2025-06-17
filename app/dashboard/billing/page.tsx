'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Subscription = {
  plan_price: number
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

      // buscar company_id desde users_metadata
      const { data: metadata } = await supabase
        .from('users_metadata')
        .select('company_id')
        .eq('id', userId)
        .single()

      if (!metadata?.company_id) return
      const company_id = metadata.company_id
      setCompanyId(company_id)

      // traer subscription
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('plan_price, next_billing_date')
        .eq('company_id', company_id)
        .single()

      setSubscription(subs)

      // contar usuarios
      const { count } = await supabase
        .from('users_metadata')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company_id)

      setUserCount(count || 0)

      // traer facturas
      const { data: allInvoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('company_id', company_id)
        .order('date', { ascending: false })

      setInvoices(allInvoices || [])
    }

    fetchData()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Billing</h1>

      {subscription && (
        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h2>${subscription.plan_price} USD / mes</h2>
          <p>{userCount} usuarios activos</p>
          <p>Próxima facturación: {new Date(subscription.next_billing_date).toLocaleDateString()}</p>
        </div>
      )}

      <h3>Facturas</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Descarga</th>
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
    </div>
  )
}
