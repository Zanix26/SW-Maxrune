import { useState } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { HomeIcon, CubeIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login fehlgeschlagen:', error);
      alert('Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.');
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registrierung fehlgeschlagen:', error);
      alert('Registrierung fehlgeschlagen. Bitte überprüfe deine Eingaben.');
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen relative">
      {/* Schwebende Mana-Kristalle */}
      <div className="mana-crystal mana-crystal-1"></div>
      <div className="mana-crystal mana-crystal-2"></div>
      <div className="mana-crystal mana-crystal-3"></div>
      <div className="mana-crystal mana-crystal-4"></div>

      {/* Sidebar (nur sichtbar, wenn eingeloggt) */}
      {token && (
        <div className="bg-[#111827] bg-opacity-90 shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold mana-gradient mb-8">SW MaxRune</h1>
            <nav className="space-y-4">
              <Link to="/dashboard" className="flex items-center text-gray-300 hover:text-white">
                <HomeIcon className="w-6 h-6 mr-3" />
                Dashboard
              </Link>
              <Link to="/monsters" className="flex items-center text-gray-300 hover:text-white">
                <CubeIcon className="w-6 h-6 mr-3" />
                Monster
              </Link>
              <Link to="/runes" className="flex items-center text-gray-300 hover:text-white">
                <CogIcon className="w-6 h-6 mr-3" />
                Runen
              </Link>
              <button onClick={logout} className="flex items-center text-gray-300 hover:text-white w-full text-left">
                <ArrowRightOnRectangleIcon className="w-6 h-6 mr-3" />
                Abmelden
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Hauptinhalt */}
      <div className={token ? 'md:ml-64' : ''}>
        <Routes>
          <Route path="/" element={<Login login={login} />} />
          <Route path="/register" element={<Register register={register} />} />
          <Route path="/dashboard" element={<Dashboard token={token} logout={logout} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;