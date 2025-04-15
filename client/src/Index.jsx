import React, { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import ResultsTable from './components/ResultsTable';
import AuthForm from './components/AuthForm';
import axios from 'axios';
import './index.css';

function App() {
    const [results, setResults] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/auth/me');
                setUser(response.data.user);
            } catch (err) {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get('/auth/logout');
            setUser(null);
        } catch (err) {
            console.error('Fehler beim Abmelden:', err);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">SW MaxRune</h1>
            {user ? (
                <>
                    <p>Willkommen, {user.username}! <button onClick={handleLogout} className="text-blue-500">Abmelden</button></p>
                    <p className="mb-4">Optimiere deine Runen für Summoners War!</p>
                    <UploadForm setResults={setResults} />
                    {results.length > 0 && <ResultsTable results={results} />}
                </>
            ) : (
                <AuthForm setUser={setUser} />
            )}
        </div>
    );
}

export default App;