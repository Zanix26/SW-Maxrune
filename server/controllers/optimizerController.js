const Rune = require('../models/rune');
const Build = require('../models/build');

//Fitness-Funktion: Bewertet deine Runen-Kombination basierend auf gewünschten Stats
const fitnessFuction = (runes, targetStats) => {
    let totalScore = 0;
    const stats = {hp:0, atk:0, def:0, spd:0, critRate:0, critDmg:0, acc:0, res:0};

    //Summiere die Stats der Runen
    runes.forEach(rune => {
        stats.hp += (rune.mainStat === 'HP' ? 1000: 0) + (rune.subStats.hp || 0);
        stats.atk += (rune.mainStat === 'ATK' ? 100: 0) + (rune.subStats.atk || 0);
        stats.def += (rune.mainStat === 'DEF' ? 100: 0) + (rune.subStats.def || 0);
        stats.spd += (rune.mainStat === 'SPD' ? 10: 0) + (rune.subStats.spd || 0);
    });

}