import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

function UploadForm({ setResults }) {
    const [file, setFile] = useState(null);
    const [goal, setGoal] = useState('general');
    const [weights, setWeights] = useState({ spd: 1, critDmg: 1, critRate: 1, hp: 1 });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Bitte lade eine JSON-Datei hoch.');
            return;
        }

        const formData = new FormData();
        formData.append('jsonFile', file);
        formData.append('goal', goal);
        formData.append('weights', JSON.stringify(weights));

        try {
            const response = await axios.post('/api/optimize', formData);
            setResults(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Fehler beim Verarbeiten.');
        }
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text('SW MaxRune - Runen-Empfehlungen', 10, 10);
        doc.save('runen-optimierung.pdf');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block">JSON-Datei</label>
                <input
                    type="file"
                    accept=".json"
                    className="w-full p-2 border"
                    onChange={(e) => setFile(e.target.files[0])}
                />
            </div>
            <div>
                <label className="block">Ziel</label>
                <select
                    className="w-full p-2 border"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                >
                    <option value="general">Allgemein</option>
                    <option value="pvp">PvP</option>
                    <option value="pve">PvE</option>
                    <option value="toa">ToA</option>
                    <option value="rift">Rift</option>
                </select>
            </div>
            <div>
                <label className="block">Gewichtungen</label>
                <input
                    type="number"
                    placeholder="SPD"
                    className="w-24 p-2 border mr-2"
                    onChange={(e) => setWeights({ ...weights, spd: parseFloat(e.target.value) })}
                />
                <input
                    type="number"
                    placeholder="CRIT DMG"
                    className="w-24 p-2 border mr-2"
                    onChange={(e) => setWeights({ ...weights, critDmg: parseFloat(e.target.value) })}
                />
                <input
                    type="number"
                    placeholder="CRIT Rate"
                    className="w-24 p-2 border mr-2"
                    onChange={(e) => setWeights({ ...weights, critRate: parseFloat(e.target.value) })}
                />
                <input
                    type="number"
                    placeholder="HP%"
                    className="w-24 p-2 border"
                    onChange={(e) => setWeights({ ...weights, hp: parseFloat(e.target.value) })}
                />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Optimieren</button>
            <button type="button" onClick={exportPDF} className="bg-green-500 text-white p-2 rounded ml-2">PDF Export</button>
        </form>
    );
}

export default UploadForm;