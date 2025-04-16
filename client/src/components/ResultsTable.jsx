import React from 'react';
import StatChart from './StatChart';

function ResultsTable({ results }) {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold">Ergebnisse</h2>
            {results.map((result, index) => (
                <div key={index} className="border p-4 mb-4 rounded">
                    <h3 className="text-xl">{result.monsterName}</h3>
                    <p><strong>Rolle:</strong> {result.role}</p>
                    <p><strong>Sets:</strong> {result.sets.join(' oder ')}</p>
                    <p><strong>Stats:</strong> {result.stats.join(', ')}</p>
                    <p><strong>Runen:</strong></p>
                    <ul>
                        {result.runes.map((rune, i) => (
                            <li key={i}>
                                Slot {rune.slot}: {rune.set} (+{rune.level}, {rune.substats.join(', ')})
                            </li>
                        ))}
                    </ul>
                    <StatChart stats={result.totalStats} />
                </div>
            ))}
        </div>
    );
}

export default ResultsTable;