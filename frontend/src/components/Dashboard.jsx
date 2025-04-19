import React, { useState, useEffect } from 'react';
import { Card, Typography, Box, Button } from '@mui/material';
import axios from 'axios';

function Dashboard() {
  const [monsters, setMonsters] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Dashboard.jsx: Fetching monsters from', `${import.meta.env.VITE_API_URL}/monsters`);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/monsters`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Dashboard.jsx: Monsters fetched:', response.data);
        setMonsters(response.data);
      } catch (err) {
        console.error('Dashboard.jsx: Error fetching monsters:', err.message);
        setError('Fehler beim Laden der Monster: ' + err.message);
      }
    };
    fetchMonsters();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  console.log('Dashboard.jsx: Rendering Dashboard component');

  return (
    <Box sx={{ p: 3, position: 'relative', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h1" className="mana-gradient">
          Dashboard
        </Typography>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Abmelden
        </Button>
      </Box>
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {monsters.map((monster) => (
          <Card key={monster.id} sx={{ width: 200 }}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h2">{monster.name}</Typography>
              <Typography variant="body2">Typ: {monster.type}</Typography>
              <Typography variant="body2">Level: {monster.level}</Typography>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default Dashboard;