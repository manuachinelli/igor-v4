'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Company = {
  name: string;
  plan: string;
};

type User = {
  id: string;
  name: string;
  role: string;
};

export default function TeamPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Obtener el user actual
      const { data: userData } = await supabase.auth.getUser();
      const user_id = userData?.user?.id;
      if (!user_id) return;

      // Traer el user_metadata para saber company_id
      const { data: userMeta } = await supabase
        .from('users_metadata')
        .select('company_id')
        .eq('id', user_id)
        .single();

      if (!userMeta) return;

      const company_id = userMeta.company_id;

      // Traer la empresa
      const { data: companyData } = await supabase
        .from('companies')
        .select('name, plan')
        .eq('id', company_id)
        .single();

      setCompany(companyData);

      // Traer todos los users de esa empresa
      const { data: usersData } = await supabase
        .from('users_metadata')
        .select('id, name, role')
        .eq('company_id', company_id);

      setUsers(usersData || []);
    };

    fetchData();
  }, []);

  return (
    <main style={{ padding: '2rem', color: '#fff' }}>
      <h1>My Team</h1>

      {company && (
        <div style={{ marginBottom: '2rem' }}>
          <p><strong>Empresa:</strong> {company.name}</p>
          <p><strong>Plan:</strong> {company.plan}</p>
        </div>
      )}

      <h2>Miembros del equipo</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} — {user.role}
          </li>
        ))}
      </ul>

      <button style={{ marginTop: '2rem', padding: '0.5rem 1rem' }}>
        Añadir usuario
      </button>
    </main>
  );
}
