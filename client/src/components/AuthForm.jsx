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
            <h2 /{isLogin ? ‘Anmelden’ : ‘Registrieren’}</h2> <form onSubmit={handleSubmit}> <div className="mb-3"> <label className="block">Benutzername</label> <input type=“text” className=“w-full p-2 border” value={username} onChange={(e) => setUsername(e.target.value)} required /> </div> <div className="mb-3"> <label className="block">Passwort</label> <input type=“password” className=“w-full p-2 border” value={password} onChange={(e) => setPassword(e.target.value)} required /> </div> {error && <div className="text-red-500">{error}</div>} <button type="submit" className="bg-blue-500 text-white p-2 rounded"> {isLogin ? ‘Anmelden’ : ‘Registrieren’} </button> </form> <button onClick={() => setIsLogin(!isLogin)} className=“text-blue-500”> {isLogin ? ‘Noch kein Konto? Registrieren’ : ‘Bereits ein Konto? Anmelden’} </button> </div> ); }
export default AuthForm;