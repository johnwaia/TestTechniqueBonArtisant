import React from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  'https://authentification-fullstack.onrender.com'
).replace(/\/+$/, '');

export default function AddContact() {
  const [contactname, setContactname] = React.useState('');
  const [contactFirstname, setcontactFirstname] = React.useState('');
  const [contactPhone, setcontactPhone] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const navigate = useNavigate();

  const handleRegisterContact = async (e) => {
    e.preventDefault();
    setMsg('Envoi...');

    try {
      const token = localStorage.getItem('token');
      const regRes = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contactname: contactname.trim(),
          contactFirstname: contactFirstname.trim(),
          contactPhone: contactPhone.trim(),
        }),
      });

      let regData = null;
      try { regData = await regRes.json(); } catch {}

      if (!regRes.ok) {
        setMsg(`❌ ${regData?.message || `Erreur ${regRes.status}`}`);
        return;
      }
      setMsg(`✅ Contact créé : ${regData.contactname}`);
    } catch {
      setMsg('❌ Erreur réseau. Vérifie que le serveur tourne.');
    }
  };

  const isError = msg.startsWith('❌');
  const isSuccess = msg.startsWith('✅');

  return (
    <main className="container">
      <header className="header">
        <div className="brand">
          <div className="logo" />
          <span>Nouveau contact</span>
        </div>
        <div className="actions">
          <button type="button" onClick={() => navigate(-1)} className="btn">Retour</button>
        </div>
      </header>

      <section className="card">
        <form onSubmit={handleRegisterContact} className="form">
          <div className="row">
            <input
              id="contactname"
              placeholder="Nom"
              value={contactname}
              onChange={(e) => setContactname(e.target.value)}
              required
              minLength={3}
              maxLength={30}
              autoComplete="family-name"
              className="input"
              autoFocus
            />
            <input
              id="contactFirstname"
              placeholder="Prénom"
              value={contactFirstname}
              onChange={(e) => setcontactFirstname(e.target.value)}
              required
              minLength={2}
              autoComplete="given-name"
              className="input"
            />
          </div>

          <input
            id="contactPhone"
            placeholder="Téléphone"
            value={contactPhone}
            onChange={(e) => setcontactPhone(e.target.value)}
            required
            minLength={6}
            autoComplete="tel"
            className="input"
          />

          <div className="actions">
            <button type="submit" className="btn btn-primary">Créer le contact</button>
            <button type="button" onClick={() => navigate(-1)} className="btn">Retour</button>
          </div>

          {msg && (
            <div className={`msg ${isError ? 'error' : ''} ${isSuccess ? 'success' : ''}`}>
              {msg}
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
