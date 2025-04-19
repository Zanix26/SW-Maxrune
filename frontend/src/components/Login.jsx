import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  console.log('Login.jsx: Rendering Login component');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Login.jsx: Sending login request to', `${import.meta.env.VITE_API_URL}/auth/login`);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        username,
        password,
      });
      console.log('Login.jsx: Login successful:', response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login.jsx: Login error:', err.message);
      setError('Ungültige Anmeldedaten: ' + err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ width: '100%', maxWidth: 400 }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h2" className="mana-gradient" gutterBottom>
            Login
          </Typography>
          {error && (
            <Typography color="error" variant="body2" gutterBottom>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Passwort"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Einloggen
            </Button>
          </form>
          <Button
            onClick={() => navigate('/register')}
            color="secondary"
            sx={{ mt: 2 }}
          >
            Noch kein Konto? Registrieren
          </Button>
        </Box>
      </Card>
    </Box>
  );
}

export default Login;