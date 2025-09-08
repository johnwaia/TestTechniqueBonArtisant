// src/App.js
import React, { useState } from 'react';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('Envoi...');

    try {
      const res = await fetch('/api/users/register', { // <-- URL relative (proxy)
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        setMsg(`❌ ${data?.message || `Erreur ${res.status}`}`);
        return;
      }

      setMsg(`✅ Utilisateur créé : ${data.username} (id: ${data.id})`);
      setUsername('');
      setPassword('');
    } catch {
      setMsg('❌ Erreur réseau. Vérifie que le serveur tourne.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        id="username"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        minLength={3}
        maxLength={30}
        autoComplete="username"
      />
      <input
        id="password"
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        autoComplete="new-password"
      />
      <button type="submit">Créer le compte</button>
      {msg && <div>{msg}</div>}
    </form>
  );
}
