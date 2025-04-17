import { useState } from "react";
import axios from "axios";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      setToken(token);
      localStorage.setItem('token', token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login fehlgeschlagen:", error);
      alert
    }
  };

  const register = async ( username, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });
      setToken(token);
      localStorage.setItem('token', token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registrierung fehlgeschlagen:", error);
      alert('Registrierung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.');
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate("/");
  };

  return (
    <div className="min-h-screen relative">
      {/* Navigationsleiste nur sichtbar wenn eingeloggt*/}
      {token && (
      <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 shadow-lg z-10">
        <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2x1 font-bold mana-gradient">SW MaxRune</h1>
            </div>
            <a href="/dashboard" className="text-grey-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
            <button onClick={logout} className="bg-red-500 text-white px-4 py2 rounded hover:bg-red-600 transition duration-200">Abmelden</button>
          </div>
        </div>
      </nav>
      )}
      {/*Hauptinhalt */}
  <div className="{token ? 'pt-16' : ''}">
      <Routes>
        <Route path="/" element={<Login login={login} register={register} />} />
        <Route path="/dashboard" element={<Dashboard token={token} logout={logout} />} />
      </Routes>
    </div>
    </div>
  );
}
export default App;