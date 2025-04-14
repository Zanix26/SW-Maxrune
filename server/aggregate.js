const fs = require('fs');
const { aggregateData } = require('./utils/aggregateData');

(async () => {
    try {
        const data = await aggregateData();
        const trainingData = data.map(entry => ({
            monsterName: entry.monsterName,
            stats: entry.stats,
            sets: entry.runes.map(r => r.set),
            substats: entry.runes.flatMap(r => r.substats.map(s => ({ stat: s[0], value: s[1] })))
        }));
        fs.writeFileSync('/var/www/sw-maxrune/server/aggregated_data.json', JSON.stringify(trainingData, null, 2));
        console.log('Daten aggregiert');
    } catch (err) {
        console.error('Fehler bei der Aggregation:', err);
    }
})();