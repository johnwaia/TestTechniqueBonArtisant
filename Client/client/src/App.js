import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Welcome     from './pageAcceuil';
import AddContact  from './addContact';
import EditContact from './editContact';
import './App.css';
import carnetImg from './assets/carnet.png';

const API_BASE = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  'https://authentification-fullstack.onrender.com'
).replace(/\/+$/, '');

function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg('Envoi...');
    const uname = username.trim();

    try {
      const regRes = await fetch(`${API_BASE}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: uname, password }),
      });

      let regData = null;
      try { regData = await regRes.json(); } catch {}

      if (!regRes.ok && regRes.status !== 409) {
        setMsg(`❌ ${regData?.message || `Erreur ${regRes.status}`}`);
        return;
      }
      if (regRes.ok) setMsg(`✅ Utilisateur créé : ${regData.username}. Connexion...`);

      const loginRes = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: uname, password }),
      });

      let loginData = null;
      try { loginData = await loginRes.json(); } catch {}

      if (!loginRes.ok) {
        setMsg(`❌ ${loginData?.message || `Erreur login ${loginRes.status}`}`);
        return;
      }

      if (loginData?.token) localStorage.setItem('token', loginData.token);
      localStorage.setItem('lastUsername', loginData?.user?.username || uname);

      navigate('/pageAcceuil', { state: { username: loginData?.user?.username || uname } });
    } catch {
      setMsg('❌ Erreur réseau. Vérifie que le serveur tourne.');
    }
  };

  const handleLoginOnly = async () => {
    setMsg('Connexion...');
    const uname = username.trim();

    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: uname, password }),
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        setMsg(`❌ ${data?.message || `Erreur ${res.status}`}`);
        return;
      }

      if (data?.token) localStorage.setItem('token', data.token);
      localStorage.setItem('lastUsername', data?.user?.username || uname);

      navigate('/pageAcceuil', { state: { username: data?.user?.username || uname } });
    } catch {
      setMsg('❌ Erreur réseau. Vérifie que le serveur tourne.');
    }
  };

  const isError = msg.startsWith('❌');
  const isSuccess = msg.startsWith('✅');

  return (
    <main className="container center">
      <section className="card" aria-label="Authentification">
        <img
          src={carnetImg}
          alt="Carnet de contacts futuriste"
          className="login-illustration"
        />

        <form onSubmit={handleRegister} className="form" autoComplete="on">
          <div className="row">
            <input
              id="username"
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="email"
              className="input"
              autoFocus
            />
            <input
              id="password"
              placeholder="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="input"
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn btn-primary">Créer le compte</button>
            <button type="button" onClick={handleLoginOnly} className="btn">Connexion</button>
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/pageAcceuil" element={<Welcome />} />
        <Route path="/addContact"  element={<AddContact />} />
        <Route path="/editContact/:id" element={<EditContact />} />
      </Routes>
    </BrowserRouter>
  );
}
