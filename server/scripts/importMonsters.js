const axios = require('axios');
const mongoose = require('mongoose');
const Monster = require('../models/monster');

const MONGODB_URI = 'mongodb://localhost:27017/sw-maxrune'; // Passe dies an deine MongoDB-Verbindung an
const SWARFARM_API = 'https://swarfarm.com/api/v2/';

async function fetchAllMonsters() {
  let allMonsters = [];
  let nextUrl = `${SWARFARM_API}monsters/`;

  while (nextUrl) {
    console.log(`Fetching monsters from ${nextUrl}`);
    const response = await axios.get(nextUrl);
    allMonsters = allMonsters.concat(response.data.results);
    nextUrl = response.data.next;
    if (nextUrl) await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return allMonsters;
}

async function fetchSkills(skillIds) {
  const skills = [];
  for (const skillId of skillIds) {
    try {
      const response = await axios.get(`${SWARFARM_API}skills/${skillId}/`);
      const skill = response.data;
      // Prüfe die Effekte auf fehlende 'name'-Werte
      if (skill.effects) {
        skill.effects.forEach((effect, index) => {
          if (!effect.name) {
            console.warn(`Skill ${skillId} hat einen Effekt ohne 'name' an Position ${index}: ${JSON.stringify(effect)}`);
            effect.name = 'Unknown Effect'; // Standardwert setzen
          }
        });
      }
      skills.push(skill);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Fehler beim Abrufen von Skill ${skillId}: ${error.message}`);
    }
  }
  return skills;
}

async function importMonsters() {
  try {
    // Mit MongoDB verbinden
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB verbunden');

    // Bestehende Monster löschen
    await Monster.deleteMany({});
    console.log('Bestehende Monster gelöscht');

    // Monster-Daten abrufen
    const monsters = await fetchAllMonsters();
    console.log(`Insgesamt ${monsters.length} Monster abgerufen`);

    // Für jedes Monster die Skills abrufen und speichern
    for (const monster of monsters) {
      const skills = await fetchSkills(monster.skills || []);
      const monsterData = {
        id: monster.id,
        name: monster.name,
        element: monster.element,
        archetype: monster.archetype,
        base_stars: monster.base_stars,
        skills: skills.map(skill => ({
          id: skill.id,
          name: skill.name,
          description: skill.description,
          multiplier_formula: skill.multiplier_formula,
          effects: skill.effects || [],
        })),
      };

      await Monster.create(monsterData);
      console.log(`Monster ${monster.name} importiert`);
    }

    console.log('Import abgeschlossen');
  } catch (error) {
    console.error('Fehler beim Importieren der Monster:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB-Verbindung geschlossen');
  }
}

importMonsters();