import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import carnetImg from './assets/carnet.png';

const API_BASE = ''

export default function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);


  const username = location.state?.username ||localStorage.getItem('lastUsername') || 'utilisateur';


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastUsername');
    navigate('/', { replace: true });
  };


  const handleAddProduct = () => {
   navigate('/addProduct');
  };


  const handleSeeProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/product`, {
      headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des produits');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };


  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/product/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression du produit');
        setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (error) {
    console.error(error);
    }
  };

  const handleEditProduct = (id) => {
  navigate(`/editProduct/${id}`);
  };

  return (
    <main className="container">
      <header className="header">
      <div className="brand">
      <img
      src={carnetImg}
      alt="Catalogue produits"
      className="brand-logo"
      />
      </div>
      <span className="brand-text">Mes produits</span>
      <div className="actions">
      <button onClick={handleAddProduct} className="btn btn-primary">Ajouter un produit</button>
      <button onClick={handleSeeProducts} className="btn">Voir mes produits</button>
      <button onClick={handleLogout} className="btn btn-ghost">Déconnexion</button>
      </div>
      </header>


    <section className="card">
    <div style={{marginBottom:8}}>Bienvenue, <strong>{username}</strong> !</div>


    {products.length > 0 ? (
    <div className="table-wrap" role="region" aria-label="Liste de produits">
    <table>
    <thead>
    <tr>
    <th>Nom</th>
    <th>Type</th>
    <th>Prix</th>
    <th>Note</th>
    <th>Garantie (ans)</th>
    <th>Dispo</th>
    <th style={{width:180}}>Actions</th>
    </tr>
    </thead>
    <tbody>
    {products.map((p) => {
    const id = p._id || p.id;
    return (
    <tr key={id}>
    <td>{p.name}</td>
    <td>{p.type}</td>
    <td>{p.price}</td>
    <td>{p.rating ?? '-'}</td>
    <td>{p.warranty_years ?? '-'}</td>
    <td>{p.available ? '✅' : '❌'}</td>
    <td>
    <div className="actions">
    <button onClick={() => handleEditProduct(id)} className="btn">Modifier</button>
    <button onClick={() => handleDeleteProduct(id)} className="btn btn-danger">Supprimer</button>
    </div>
    </td>
    </tr>
    );
    })}
    </tbody>
    </table>
    </div>
    ) : (
    <div className="msg">Clique sur <em>“Voir mes produits”</em> pour charger ta liste.</div>
    )}
    </section>
    </main>
  );
}
