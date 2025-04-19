import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://optimizer.stocktropia.com/api/auth/register', {
        username, // Muss "username" heißen, wie das Backend es erwartet
        email,    // Muss "email" heißen
        password, // Muss "password" heißen
      });
      // Token und Benutzerdaten speichern
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Zum Dashboard weiterleiten
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || `Request failed with status code ${err.response?.status}`);
    }
  };

  return (
    <div>
      <h2>Registrieren</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Benutzername:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>E-Mail:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Passwort:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrieren</button>
      </form>
      <p>
        Bereits ein Konto? <a href="/login">Einloggen</a>
      </p>
    </div>
  );
};

export default Register;