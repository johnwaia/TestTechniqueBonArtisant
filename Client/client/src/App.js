import React, { useState, useEffect} from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000')
      .then(response => response.text())
      .then(data => setMessage(data));
  }, []);

    return (
      <div className="App">
        <header className="App-header">
          <label>
            identifiant :
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </label>
          <label>
            mot de passe :
            <input
              type="text"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </label>
          <button>Envoyer</button>
          <p>{message}</p>
         
        </header>
      </div>
    );
  }

  export default App;
