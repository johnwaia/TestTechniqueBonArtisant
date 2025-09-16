import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [contacts, setContacts] = React.useState([]);

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const username =
    location.state?.username ||
    localStorage.getItem('lastUsername') ||
    'utilisateur';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastUsername');
    navigate('/', { replace: true });
  };

  const handleAddContact = () => {
    navigate('/addContact');
  };

  const handleSeeContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/contact', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des contacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      const token = localStorage.getItem('token');  
      const response = await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`},
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression du contact');
      setContacts(contacts.filter(contact => contact._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditContact = (id) => {
    navigate(`/editContact/${id}`);
  };  

  return (
    <div>
      <div>Bienvenue, {username} !</div>
      <button onClick={handleAddContact}>Ajouter un contact</button>
      <button onClick={handleSeeContacts}>Voir mes contacts</button>
      <button onClick={handleLogout}>Déconnexion</button>

      {contacts.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Téléphone</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c._id || c.id}>
                <td>{c.contactname}</td>
                <td>{c.contactFirstname}</td>
                <td>{c.contactPhone}</td>
                <td><button onClick={() => handleEditContact(c._id)}>modifier</button></td>
                <td><button onClick={() => handleDeleteContact(c._id)}>supprimer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
