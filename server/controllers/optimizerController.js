const Rune = require('../models/rune');
const Build = require('../models/build');

// Fitness-Funktion: Bewertet eine Runen-Kombination basierend auf gewünschten Stats
const fitnessFunction = (runes, targetStats) => {
  let totalScore = 0;
  const stats = { hp: 0, atk: 0, def: 0, spd: 0 };

  // Summiere die Stats der Runen
  runes.forEach(rune => {
    stats.hp += (rune.mainStat === 'HP' ? 1000 : 0) + (rune.subStats.hp || 0);
    stats.atk += (rune.mainStat === 'ATK' ? 100 : 0) + (rune.subStats.atk || 0);
    stats.def += (rune.mainStat === 'DEF' ? 100 : 0) + (rune.subStats.def || 0);
    stats.spd += (rune.mainStat === 'SPD' ? 10 : 0) + (rune.subStats.spd || 0);
  });

  // Berechne den Fitness-Score basierend auf den gewünschten Stats
  totalScore += (stats.hp * targetStats.hpWeight);
  totalScore += (stats.atk * targetStats.atkWeight);
  totalScore += (stats.def * targetStats.defWeight);
  totalScore += (stats.spd * targetStats.spdWeight);

  return totalScore;
};

// Genetischer Algorithmus
const geneticAlgorithm = (runes, targetStats, populationSize = 10, generations = 20) => {
  // Initiale Population: Zufällige Runen-Kombinationen (je 6 Runen, Slots 1-6)
  let population = [];
  for (let i = 0; i < populationSize; i++) {
    const combination = [];
    for (let slot = 1; slot <= 6; slot++) {
      const availableRunes = runes.filter(rune => rune.slot === slot);
      if (availableRunes.length > 0) {
        const randomRune = availableRunes[Math.floor(Math.random() * availableRunes.length)];
        combination.push(randomRune);
      }
    }
    if (combination.length === 6) population.push(combination);
  }

  // Evolution durch Generationen
  for (let gen = 0; gen < generations; gen++) {
    // Sortiere Population nach Fitness
    population.sort((a, b) => fitnessFunction(b, targetStats) - fitnessFunction(a, targetStats));

    // Behalte die besten 50% und erstelle neue Nachkommen
    const newPopulation = population.slice(0, Math.floor(population.length / 2));
    while (newPopulation.length < populationSize) {
      const parent1 = population[Math.floor(Math.random() * population.length)];
      const parent2 = population[Math.floor(Math.random() * population.length)];
      const child = [];

      // Crossover: Mische Runen von beiden Eltern
      for (let i = 0; i < 6; i++) {
        child.push(Math.random() > 0.5 ? parent1[i] : parent2[i]);
      }

      // Mutation: Ersetze zufällig eine Rune (5% Chance)
      if (Math.random() < 0.05) {
        const slot = Math.floor(Math.random() * 6) + 1;
        const availableRunes = runes.filter(rune => rune.slot === slot);
        if (availableRunes.length > 0) {
          child[slot - 1] = availableRunes[Math.floor(Math.random() * availableRunes.length)];
        }
      }

      newPopulation.push(child);
    }
    population = newPopulation;
  }

  // Beste Kombination zurückgeben
  population.sort((a, b) => fitnessFunction(b, targetStats) - fitnessFunction(a, targetStats));
  return population[0];
};

// API-Endpunkt für den Optimizer
const optimizeBuild = async (req, res) => {
  const { monsterId, targetStats } = req.body; // z. B. { hpWeight: 0.4, atkWeight: 0.3, defWeight: 0.2, spdWeight: 0.1 }
  const userId = req.userId;

  try {
    // Hole alle Runen des Benutzers
    const runes = await Rune.find({ userId });

    if (runes.length < 6) {
      return res.status(400).json({ message: 'Nicht genug Runen für eine Optimierung (mindestens 6 benötigt).' });
    }

    // Führe den genetischen Algorithmus aus
    const bestRunes = geneticAlgorithm(runes, targetStats);

    // Erstelle einen neuen Build mit den optimierten Runen
    const build = new Build({
      userId,
      monsterId,
      runes: bestRunes.map(rune => rune._id),
      optimizedStats: {
        hp: bestRunes.reduce((sum, rune) => sum + (rune.mainStat === 'HP' ? 1000 : 0) + (rune.subStats.hp || 0), 0),
        atk: bestRunes.reduce((sum, rune) => sum + (rune.mainStat === 'ATK' ? 100 : 0) + (rune.subStats.atk || 0), 0),
        def: bestRunes.reduce((sum, rune) => sum + (rune.mainStat === 'DEF' ? 100 : 0) + (rune.subStats.def || 0), 0),
        spd: bestRunes.reduce((sum, rune) => sum + (rune.mainStat === 'SPD' ? 10 : 0) + (rune.subStats.spd || 0), 0),
      },
    });

    await build.save();
    res.status(200).json({ message: 'Build optimiert!', build });
  } catch (error) {
    console.error('Fehler bei der Optimierung:', error);
    res.status(500).json({ message: 'Fehler bei der Optimierung', error });
  }
};

module.exports = { optimizeBuild };