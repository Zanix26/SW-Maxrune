import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Das erstellte Theme
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './index.css'; // Wir passen die index.css später an

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Setzt grundlegende Stile (z. B. Hintergrundfarbe) */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;