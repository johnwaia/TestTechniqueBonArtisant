import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


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
        const regRes = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contactname: cname, contactPhone, contactFirstname }),
        });

        let regData = null;
        try { regData = await regRes.json(); } catch {}

        if (!regRes.ok && regRes.status !== 409) {
            setMsg(`❌ ${regData?.message || `Erreur ${regRes.status}`}`);
            return;
        }
        if (regRes.ok) setMsg(`✅ contact créé : ${regData.contactname}. Connexion...`);

        } catch {
        setMsg('❌ Erreur réseau. Vérifie que le serveur tourne.');
        }
    };

  return (
    <div>
    <form onSubmit={handleRegisterContact}>
      <input
        id="contactname"
        placeholder="contactname"
        value={contactname}
        onChange={(e) => setContactname(e.target.value)}
        required
        minLength={3}
        maxLength={30}
        autoComplete="contactname"
      />
      <input
        id="contactFirstname"
        placeholder="contactFirstname"
        type="contactFirstname"
        value={contactFirstname}
        onChange={(e) => setcontactFirstname(e.target.value)}
        required
        minLength={6}
        autoComplete="current-contactFirstname"
      />
      <input
        id="contactPhone"
        placeholder="contactPhone"
        type="contactPhone"
        value={contactPhone}
        onChange={(e) => setcontactPhone(e.target.value)}
        required
        minLength={6}
        autoComplete="current-contactPhone"
      />
      <button type="submit">Créer le contact</button>
    </form>
    </div>
  );
}


