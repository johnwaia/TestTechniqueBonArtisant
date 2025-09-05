import React, { useState, useEffect } from 'react';

import './App.css';

function App() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetch('http://localhost:5000')
      .then(response => response.text())
      .then(data => setMessage(data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
       <label>
        identifiant : <input name="myInput" />
        </label>
        <label>
        mot de passe : <input name="myInput" />
        </label>
        <button>Envoyer</button>
        <p>{message}</p>
      </header>
    </div>
 
  );
}

export default App;
