'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import CredentialModal from '@/components/CredentialModal';
import './page.css';

type Cred = {
  id: string;
  app_name: string;
  cred_username: string;
};

export default function KeysPage() {
  const [creds, setCreds] = useState<Cred[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchCreds = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('credentials')
      .select('id, app_name, cred_username')
      .order('inserted_at', { ascending: false });
    if (error) console.error(error);
    else setCreds(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCreds();
  }, []);

  const handleSave = async (app: string, user: string, secret: string) => {
    const { error } = await supabase.from('credentials').insert({
      app_name: app,
      cred_username: user,
      cred_secret: secret,
    });
    if (error) console.error(error);
    else fetchCreds();
  };

  return (
    <div className="keys-page">
      <button className="add-btn" onClick={() => setModalOpen(true)}>
        + Add credentials
      </button>

      {loading && <p className="status">Loading…</p>}
      {!loading && creds.length === 0 && (
        <p className="status">No tienes credenciales. Crea una!</p>
      )}

      <div className="pills">
        {creds.map(c => (
          <div key={c.id} className="pill">
            {c.app_name}
          </div>
        ))}
      </div>

      <CredentialModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
