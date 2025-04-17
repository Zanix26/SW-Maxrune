import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({ register }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    register(username, email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mana-gradient mb-6">Werde ein Summoner!</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              className="w-full"
              required
            />
            <label>Benutzername</label>
          </div>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="w-full"
              required
            />
            <label>E-Mail</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="w-full"
              required
            />
            <label>Passwort</label>
          </div>
          <button type="submit" className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition duration-200">
            Registrieren
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          Schon ein Konto?{' '}
          <Link to="/" className="text-blue-500 hover:underline">Anmelden</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;