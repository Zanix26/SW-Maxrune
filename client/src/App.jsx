import React, { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import ResultsTable from './components/ResultsTable';
import AuthForm from './components/AuthForm';
import axios from 'axios';
import './index.css';

function App() {
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/auth/me');
        setUser(response.data.user);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Fehler beim Abmelden:', err);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">SW MaxRune</h1>
          <nav>
            <ul className="nav-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </nav>
          {user && (
            <button onClick={handleLogout} className="logout-button">
              Abmelden
            </button>
          )}
        </div>
      </header>
      <main className="main">
        <div className="container">
          {user ? (
            <>
              <h2 className="welcome-message">Willkommen, {user.username}!</h2>
              <p className="description">
                Lade deine Runen-Daten hoch und optimiere deine Monster für den Kampf!
              </p>
              <UploadForm setResults={setResults} />
              {results.length > 0 && <ResultsTable results={results} />}
            </>
          ) : (
            <AuthForm setUser={setUser} />
          )}
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 SW MaxRune. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;