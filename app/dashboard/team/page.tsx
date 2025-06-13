'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './TeamPage.module.css';

type Company = {
  name: string;
  plan: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function TeamPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('admin');

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user_id = userData?.user?.id;
      if (!user_id) return;

      const { data: userMeta } = await supabase
        .from('users_metadata')
        .select('company_id')
        .eq('id', user_id)
        .single();

      if (!userMeta) return;
      const company_id = userMeta.company_id;

      const { data: companyData } = await supabase
        .from('companies')
        .select('name, plan')
        .eq('id', company_id)
        .single();

      setCompany(companyData);

      const { data: usersData } = await supabase
        .from('users_metadata')
        .select('id, name, email, role')
        .eq('company_id', company_id);

      setUsers(usersData || []);
    };

    fetchData();
  }, []);

  const handleAddUser = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;
    if (!user_id) return;

    const { data: userMeta } = await supabase
      .from('users_metadata')
      .select('company_id')
      .eq('id', user_id)
      .single();

    if (!userMeta) return;
    const company_id = userMeta.company_id;

    await supabase.from('users_metadata').insert({
      id: crypto.randomUUID(),
      company_id,
      name: newName,
      email: newEmail,
      role: newRole,
    });

    setShowModal(false);
    setNewName('');
    setNewEmail('');
    setNewRole('admin');

    // Refrescar users
    const { data: usersData } = await supabase
      .from('users_metadata')
      .select('id, name, email, role')
      .eq('company_id', company_id);

    setUsers(usersData || []);
  };

  const handleDeleteUser = async (id: string) => {
    await supabase.from('users_metadata').delete().eq('id', id);

    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Mi equipo</h1>
        {company && (
          <div className={styles.companyInfo}>
            <p><strong>Empresa:</strong> {company.name}</p>
            <p><strong>Plan:</strong> {company.plan}</p>
          </div>
        )}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className={styles.actionIcon}
                    onClick={() => alert('Editar no implementado todavía')}
                  >
                    ✏️
                  </span>
                  <span
                    className={styles.actionIcon}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    🗑️
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={styles.addButton} onClick={() => setShowModal(true)}>
          +
        </button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Añadir usuario</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <div className={styles.modalActions}>
              <button onClick={handleAddUser}>Guardar</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

