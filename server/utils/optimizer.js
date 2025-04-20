const optimizeMonster = (monster, runes, artifacts, targetStats) => {
  const { spd = 0, critRate = 0, critDmg = 0, atk = 0, hp = 0 } = targetStats;

  let bestCombination = null;
  let bestScore = -Infinity;

  const calculateStats = (runeCombo, artifactCombo) => {
    let totalStats = { spd: 0, critRate: 0, critDmg: 0, atk: 0, hp: 0 };

    runeCombo.forEach(rune => {
      if (rune.main_stat === 'SPD') totalStats.spd += rune.main_stat_value || 30;
      if (rune.main_stat === 'ATK%') totalStats.atk += rune.main_stat_value || 20;
      if (rune.main_stat === 'HP%') totalStats.hp += rune.main_stat_value || 20;
      rune.substats.forEach(substat => {
        if (substat.type === 'SPD') totalStats.spd += substat.value;
        if (substat.type === 'CRIT Rate%') totalStats.critRate += substat.value;
        if (substat.type === 'CRIT DMG%') totalStats.critDmg += substat.value;
        if (substat.type === 'ATK%') totalStats.atk += substat.value;
        if (substat.type === 'HP%') totalStats.hp += substat.value;
      });
    });

    artifactCombo.forEach(artifact => {
      if (artifact.main_stat === 'ATK%') totalStats.atk += artifact.main_stat_value || 15;
      if (artifact.main_stat === 'HP%') totalStats.hp += artifact.main_stat_value || 15;
      artifact.substats.forEach(substat => {
        if (substat.type === 'CRIT Rate%') totalStats.critRate += substat.value;
        if (substat.type === 'CRIT DMG%') totalStats.critDmg += substat.value;
        if (substat.type === 'ATK%') totalStats.atk += substat.value;
        if (substat.type === 'HP%') totalStats.hp += substat.value;
      });
    });

    return totalStats;
  };

  const calculateScore = (stats) => {
    return (
      (stats.spd - spd) * 2 +
      (stats.critRate - critRate) +
      (stats.critDmg - critDmg) +
      (stats.atk - atk) * 0.5 +
      (stats.hp - hp) * 0.5
    );
  };

  const runeCombinations = [];
  for (let slot1 of runes.filter(r => r.slot === 1)) {
    for (let slot2 of runes.filter(r => r.slot === 2)) {
      for (let slot3 of runes.filter(r => r.slot === 3)) {
        for (let slot4 of runes.filter(r => r.slot === 4)) {
          for (let slot5 of runes.filter(r => r.slot === 5)) {
            for (let slot6 of runes.filter(r => r.slot === 6)) {
              runeCombinations.push([slot1, slot2, slot3, slot4, slot5, slot6]);
              if (runeCombinations.length > 1000) break;
            }
          }
        }
      }
    }
  }

  const artifactCombinations = [[], ...artifacts.map(a => [a])];

  for (let runeCombo of runeCombinations) {
    for (let artifactCombo of artifactCombinations) {
      const stats = calculateStats(runeCombo, artifactCombo);
      const score = calculateScore(stats);

      if (score > bestScore) {
        bestScore = score;
        bestCombination = { runes: runeCombo, artifacts: artifactCombo, stats };
      }
    }
  }

  return bestCombination;
};

module.exports = { optimizeMonster };
