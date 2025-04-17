import { useState } from "react";
import axios from "axios";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
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

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Login login={login} />} />
        <Route path="/dashboard" element={<Dashboard token={token} logout={logout} />} />
      </Routes>
    </div>
  );
}
export default App;