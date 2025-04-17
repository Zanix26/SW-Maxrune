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
        const response = await axios.get('http://localhost:5000/api/monsters', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMonsters(response.data);
      } catch (err) {
        setError('Fehler beim Laden der Monster');
      }
    };
    fetchMonsters();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

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