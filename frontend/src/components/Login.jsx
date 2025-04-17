import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login({login}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(email, password);
    };

return (
    <div className='flex items-center justify-center min-h-screen'>
        <div className='bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700'>
            <h1 className='text-3x1 font-bold text-center mana-gradient mb-6'>Willkommen Summoner!</h1>
            <form onSubmit={handleSubmit}>
                <div className='mb-6'>
                    <label className='block text-gray-300 text-sm font-semibold mb-2'>E-Mail</label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full p-3 bg-gray-900 text-white border-gray-600 rounded focus:outline-none focus:border-blue-500 transition duration-200'
                        required
                    />
                </div> 
                <div className='mb-6'>
                    <label className='block text-gray-300 text-sm font-semibold mb-2'>Password</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full p-3 bg-gray-900 text-white border-gray-600 rounded focus:outline-none focus:border-blue-500 transition duration-200'
                        required
                    />
                </div>
                <button
                    type='submit'
                    className='w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200'
                >
                    Login
                </button>
            </form>
            <p className='text-center text-gray-400 mt-4'>
                Noch kein Konto?{' '}
                <Link to='/register' className='text-blue-500 hover:underline'>
                   Registrieren
                </Link>
            </p>
            </div>
        </div>
    );
}
export default Login;