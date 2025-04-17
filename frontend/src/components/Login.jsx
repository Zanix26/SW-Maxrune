import { useState } from 'react';

function Login({login}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(email, password);
    };

return (
    <div className='flex items-center justify-center min-h-screen'>
        <div className='bg-white p-6 rounded shadow-md w-full max-w-sm'>
            <h1 className='text-2x1 font-bold mb-4'>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='block text-gray-700'>E-Mail</label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full p-2 border rounded'
                        required
                    />
                </div> 
                <div className='mb-4'>
                    <label className='block text-gray-700'>Password</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full p-2 border rounded'
                        required
                    />
                </div>
                <button
                    type='submit'
                    className='w-full bg-blue-500 text-white p-2 rounded'
                >
                    Login
                </button>
            </form>
            </div>
        </div>
    );
}
export default Login;