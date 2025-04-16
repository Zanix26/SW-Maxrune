import React, { useState } from 'react';
import axios from 'axios';

function AuthForm({ setUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Clientseitige Validierung
    const validateInputs = () => {
        const errors = {};
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            errors.username = 'Benutzername darf nur Buchstaben und Zahlen enthalten.';
        }
        if (password.length < 8) {
            errors.password = 'Passwort muss mindestens 8 Zeichen lang sein.';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateInputs();

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setValidationErrors({});
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(`/auth/${isLogin ? 'login' : 'register'}`, { username, password });
            setUser(response.data.user);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Fehler bei der Authentifizierung');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                {isLogin ? 'Anmelden' : 'Registrieren'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Benutzername</label>
                    <input
                        type="text"
                        className={`w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.username ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    {validationErrors.username && (
                        <p className="mt-1 text-sm text-red-500">{validationErrors.username}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Passwort</label>
                    <input
                        type="password"
                        className={`w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    {validationErrors.password && (
                        <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
                    )}
                </div>
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                <button
                    type="submit"
                    className={`w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <svg
                            className="animate-spin h-5 w-5 mx-auto text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                    ) : isLogin ? (
                        'Anmelden'
                    ) : (
                        'Registrieren'
                    )}
                </button>
            </form>
            <button
                onClick={() => setIsLogin(!isLogin)}
                className="mt-4 w-full text-blue-500 hover:underline text-center"
                disabled={isLoading}
            >
                {isLogin ? 'Noch kein Konto? Registrieren' : 'Bereits ein Konto? Anmelden'}
            </button>
        </div>
    );
}

export default AuthForm;