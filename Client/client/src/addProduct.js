import React from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import carnetImg from './assets/carnet.png';

const API_BASE = ''

export default function AddProduct() {
const [name, setName] = React.useState('');
const [type, setType] = React.useState('');
const [price, setPrice] = React.useState('');
const [rating, setRating] = React.useState('');
const [warrantyYears, setWarrantyYears] = React.useState('');
const [available, setAvailable] = React.useState(true);
const [msg, setMsg] = React.useState('');
const navigate = useNavigate();


const handleRegisterProduct = async (e) => {
e.preventDefault();
setMsg('Envoi...');


try {
const token = localStorage.getItem('token');
const res = await fetch(`${API_BASE}/api/product`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({
name: name.trim(),
type: type.trim(),
price: parseFloat(price),
rating: rating === '' ? undefined : parseFloat(rating),
warranty_years: warrantyYears === '' ? undefined : parseInt(warrantyYears, 10),
available,
}),
});


let data = null;
try { data = await res.json(); } catch {}


if (!res.ok) {
setMsg(`❌ ${data?.message || `Erreur ${res.status}`}`);
return;
}


setMsg(`✅ Produit créé : ${data.name}`);
confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
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
<img src={carnetImg} alt="Catalogue produits" className="brand-logo" />
</div>
<span className="brand-text">Créer un produit</span>
<div className="actions">
<button type="button" onClick={() => navigate(-1)} className="btn">Retour</button>
</div>
</header>


<section className="card">
<form onSubmit={handleRegisterProduct} className="form">
<div className="row">
<input
id="name"
placeholder="Nom"
value={name}
onChange={(e) => setName(e.target.value)}
required
minLength={2}
className="input"
autoFocus
/>
<input
id="type"
placeholder="Type (ex: phone)"
value={type}
onChange={(e) => setType(e.target.value)}
required
className="input"
/>
</div>


<div className="row">
<input
id="price"
type="number"
step="0.01"
min="0"
placeholder="Prix"
value={price}
onChange={(e) => setPrice(e.target.value)}
required
className="input"
/>
<input
id="rating"
type="number"
step="0.1"
min="0"
max="5"
placeholder="Note (0-5)"
value={rating}
onChange={(e) => setRating(e.target.value)}
className="input"
/>
</div>


<div className="row">
<input
id="warranty_years"
type="number"
min="0"
placeholder="Garantie (années)"
value={warrantyYears}
onChange={(e) => setWarrantyYears(e.target.value)}
className="input"
/>
<label className="checkbox">
<input
type="checkbox"
checked={available}
onChange={(e) => setAvailable(e.target.checked)}
/>
Disponible
</label>
</div>


<div className="actions">
<button type="submit" className="btn btn-primary">Créer le produit</button>
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