import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddContact() {
  const [contactname, setContactname] = React.useState('');
  const [contactFirstname, setcontactFirstname] = React.useState('');
  const [contactPhone, setcontactPhone] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const navigate = useNavigate();
  

  const handleRegisterContact = async (e) => {
    e.preventDefault();
    setMsg('Envoi...');
    const cname = contactname.trim();

    try {
      const token = localStorage.getItem('token');
      const regRes = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({
          contactname: contactname.trim(),
          contactFirstname: contactFirstname.trim(),
          contactPhone: contactPhone.trim(),
        }),
      });

      let regData = null;
      try { regData = await regRes.json(); } catch {}

      if (!regRes.ok && regRes.status !== 409) {
        setMsg(`❌ ${regData?.message || `Erreur ${regRes.status}`}`);
        return;
      }
      if (regRes.ok) {
        setMsg(`✅ Contact créé : ${regData.contactname}`);
      }
    } catch {
      setMsg('❌ Erreur réseau. Vérifie que le serveur tourne.');
    }
  };

  return (
    <div>
      <form onSubmit={handleRegisterContact}>
        <input
          id="contactname"
          placeholder="Nom"
          value={contactname}
          onChange={(e) => setContactname(e.target.value)}
          required
          minLength={3}
          maxLength={30}
          autoComplete="contactname"
        />
        <input
          id="contactFirstname"
          placeholder="Prénom"
          value={contactFirstname}
          onChange={(e) => setcontactFirstname(e.target.value)}
          required
          minLength={2}
          autoComplete="given-name"
        />
        <input
          id="contactPhone"
          placeholder="Téléphone"
          value={contactPhone}
          onChange={(e) => setcontactPhone(e.target.value)}
          required
          minLength={6}
          autoComplete="tel"
        />
        <button type="submit">Créer le contact</button>
        <button type="button" onClick={() => navigate(-1)}>Retour</button>
        {msg && <div>{msg}</div>}
      </form>
    </div>
  );
}
