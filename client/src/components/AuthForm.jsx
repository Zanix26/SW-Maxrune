import React, { useState } from 'react';
import './AuthForm.css';

function AuthForm({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    const errors = {};
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      errors.username = 'Benutzername darf nur Buchstaben und Zahlen enthalten.';
    }
    if (password.length < 8) {
      errors.password = 'Passwort muss mindestens 8 Zeichen lang sein.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateInputs();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`/auth/${isLogin ? 'login' : 'register'}`, { username, password });
      setUser(response.data.user);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Fehler bei der Authentifizierung');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>{isLogin ? 'Anmelden' : 'Registrieren'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Benutzername</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Benutzername eingeben"
          />
          {validationErrors.username && <p className="validation-error">{validationErrors.username}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Passwort</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort eingeben"
          />
          {validationErrors.password && <p className="validation-error">{validationErrors.password}</p>}
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Lädt...' : isLogin ? 'Anmelden' : 'Registrieren'}
        </button>
      </form>
      <p>
        {isLogin ? 'Noch kein Konto?' : 'Bereits registriert?'}{' '}
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="toggle-button">
          {isLogin ? 'Registrieren' : 'Anmelden'}
        </button>
      </p>
    </div>
  );
}

export default AuthForm;