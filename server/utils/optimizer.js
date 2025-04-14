const { PythonShell } = require('python-shell');
const Monster = require('../models/Monster');
const redis = require('redis');

const redisClient = redis.createClient();
redisClient.connect();

async function optimizeRunes(jsonData, goal, weights) {
    const monsters = jsonData.unit_list || [];
    const runes = jsonData.runes || [];
    const results = [];

    for (const monster of monsters) {
        const monsterName = mapUnitMasterId(monster.unit_master_id) || 'Unbekannt';
        let monsterInfo = await Monster.findOne({ name: monsterName }) || monsterDB[monsterName];

        if (!monsterInfo) {
            monsterInfo = {
                role: "Generic",
                sets: ["Energy/Energy"],
                stats: ["HP%", "SPD"],
                goals: { general: ["HP%", "SPD"] }
            };
            await Monster.create({ name: monsterName, ...monsterInfo });
        }

        const geneticResult = await runGeneticOptimizer(runes, monsterInfo, goal, weights);
        const nnResult = await runNeuralNet(monsterName, goal);

        const recommendedSets = geneticResult.sets || monsterInfo.sets;
        const statPriority = nnResult.weights.map((w, i) => `${nnResult.stats[i]} (${w.toFixed(2)})`);

        results.push({
            monsterName,
            role: monsterInfo.role,
            sets: recommendedSets,
            stats: statPriority,
            runes: geneticResult.runes,
            totalStats: geneticResult.totalStats
        });
    }

    return results;
}

async function runGeneticOptimizer(runes, monsterInfo, goal, weights) {
    const runeData = runes.map(r => ({
        id: r.rune_id,
        slot: r.slot_no,
        set: r.set_id,
        substats: (r.sec_eff || []).map(([id, val]) => [mapStatId(id), val])
    }));

    const weightData = Object.entries(weights).map(([k, v]) => [k.toUpperCase(), v]);

    let bestScore = -Infinity;
    let bestBuild = null;
    const populationSize = 200;
    const generations = 100;

    let population = Array(populationSize).fill().map(() => ({
        runes: Array(6).fill().map((_, slot) => {
            const validRunes = runeData.filter(r => r.slot === slot + 1);
            return validRunes[Math.floor(Math.random() * validRunes.length)] || runeData[0];
        }),
        score: 0
    }));

    for (let gen = 0; gen < generations; gen++) {
        population.forEach(build => {
            build.score = evaluateBuild(build, weightData, monsterInfo.role, goal);
        });
        population.sort((a, b) => b.score - a.score);

        if (population[0].score > bestScore) {
            bestScore = population[0].score;
            bestBuild = population[0];
        }

        const newPopulation = population.slice(0, populationSize / 5);
        while (newPopulation.length < populationSize) {
            const parent1 = population[Math.floor(Math.random() * populationSize / 2)];
            const parent2 = population[Math.floor(Math.random() * populationSize / 2)];
            const child = {
                runes: parent1.runes.map((r, i) => Math.random() < 0.5 ? r : parent2.runes[i]),
                score: 0
            };
            if (Math.random() < 0.1) {
                const slot = Math.floor(Math.random() * 6);
                const validRunes = runeData.filter(r => r.slot === slot + 1);
                child.runes[slot] = validRunes[Math.floor(Math.random() * validRunes.length)] || runeData[0];
            }
            newPopulation.push(child);
        }
        population = newPopulation;
    }

    return {
        sets: monsterInfo.sets,
        runes: bestBuild.runes.map(r => ({
            slot: r.slot,
            set: r.set,
            level: runes.find(real => real.rune_id === r.id)?.upgrade_curr || 0,
            substats: r.substats.map(([stat, val]) => `${stat} +${val}`)
        })),
        totalStats: calculateTotalStats(bestBuild.runes)
    };
}

function evaluateBuild(build, weights, role, goal) {
    let score = 0;
    const setCounts = {};
    const totalStats = {};

    build.runes.forEach(r => {
        setCounts[r.set] = (setCounts[r.set] || 0) + 1;
        r.substats.forEach(([stat, value]) => {
            const weight = weights.find(w => w[0] === stat)?.[1] || 1;
            score += value * weight;
            totalStats[stat] = (totalStats[stat] || 0) + value;
        });
    });

    if (goal === 'pvp' && role === 'Support' && setCounts['Violent'] >= 4) score *= 1.3;
    if (goal === 'pve' && role === 'DPS' && setCounts['Fatal'] >= 4) score *= 1.2;
    if (totalStats['SPD'] > 150) score += (totalStats['SPD'] - 150) * 0.5;

    return score;
}

async function runNeuralNet(monsterName, goal) {
    return new Promise((resolve, reject) => {
        PythonShell.run('/var/www/sw-maxrune/ml/neural_net.py', {
            args: [monsterName, goal]
        }, (err, results) => {
            if (err) reject(err);
            resolve(JSON.parse(results[0]));
        });
    });
}

function mapStatId(id) {
    const statMap = {
        1: "HP flat", 2: "HP%", 3: "ATK flat", 4: "ATK%", 5: "DEF flat", 6: "DEF%",
        8: "SPD", 9: "CRIT Rate", 10: "CRIT DMG", 11: "RES", 12: "ACC"
    };
    return statMap[id] || "Unknown";
}

function calculateTotalStats(runes) {
    const stats = { spd: 0, hp: 0, atk: 0, def: 0, critRate: 0, critDmg: 0 };
    runes.forEach(rune => {
        rune.substats.forEach(([stat, value]) => {
            const key = stat.toLowerCase().replace('%', '').replace(' ', '');
            if (stats[key]) stats[key] += value;
        });
    });
    return stats;
}

module.exports = { optimizeRunes };