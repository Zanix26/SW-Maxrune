import React, { useState } from 'react';
import axios from 'axios';

function AuthForm({ setUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/auth/${isLogin ? 'login' : 'register'}`, { username, password });
            setUser(response.data.user);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Fehler bei der Authentifizierung');
        }
    };

    return (
        <div className="space-y-4">
            <h2 /