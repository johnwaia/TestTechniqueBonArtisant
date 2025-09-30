import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Welcome from './pageAcceuil';
import AddProduct from './addProduct';
import EditProduct from './editProduct';
import './App.css';
import carnetImg from './assets/lesbonsartisans_logo.jpg';


/*const API_BASE = (
(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
process.env.REACT_APP_API_BASE ||
'Localhost:5000'
).replace(/\/+$/, '');
*/

const API_BASE = ''
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


const regData = await regRes.json().catch(() => null);


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

const loginData = await loginRes.json().catch(() => null);


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


const data = await res.json().catch(() => null);


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
alt="Catalogue produits futuriste"
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
<Route path="/addProduct" element={<AddProduct />} />
<Route path="/editProduct/:id" element={<EditProduct />} />
</Routes>
</BrowserRouter>
);
}