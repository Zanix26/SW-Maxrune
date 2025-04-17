import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ token, logout}) {
    const [monster, setMonster] = useState([]);
    const [runes, setRunes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const monsterResponse = await axios.get('http://localhost:5000/api/monsters/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMonster(monsterResponse.data);

                const runesResponse = await axios.get('http://localhost:5000/api/runes/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRunes(runesResponse.data);
            } catch (error) {
                console.error('Fehler beim Aufrufen der Daten:', error);
                if (error.response?.status === 401) {
                    logout(); // Token ungültig, Benutzer abmelden
                }
            }
        };

        fetchData();
    }, [token, logout]);

    return (
        <div className='p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3x1 font-bold'>Dashboard</h1>
                <button
                    onClick={logout}
                    className='bg-red-500 text-white p-2 rounded'
                >
                    Logout
                </button>
            </div>
            <div className='grid grid-cols-2 gap-6'>
                <div>
                    <h2 className='text-x1 font-semibold mb-2'>Deine Monsters</h2>
                    {monster.length > 0 ? (
                        <ul className='space-y-2'>
                            {monster.map((monster) => (
                                <li key={monster._id} className='p-4 bg-white rounded shadow'>
                                    {monster.name} (Level: {monster.level})
                                    </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Keine Monster gefunden.</p>
                    )}
                </div>
                <div>
                    <h2 className='text-x1 font-semibold mb-2'>Deine Runen</h2>
                    {runes.length > 0 ? (
                        <ul className='space-y-2'>
                            {runes.map((rune) => (
                                <li key={rune._id} className='p-4 bg-white rounded shadow'>
                                    {rune.name} (Slot: {rune.slot}, Main Stat: {rune.mainStat})
                                    </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Keine Runen gefunden.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Dashboard;