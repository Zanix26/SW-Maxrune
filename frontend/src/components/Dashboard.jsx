import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ token, logout }) {
  const [monsters, setMonsters] = useState([]);
  const [runes, setRunes] = useState([]);
  const [builds, setBuilds] = useState([]); // Neue Builds hinzufügen
  const [showMonsterForm, setShowMonsterForm] = useState(false);
  const [showRuneForm, setShowRuneForm] = useState(false);
  const [showOptimizerForm, setShowOptimizerForm] = useState(false);

  // Formulardaten
  const [monsterData, setMonsterData] = useState({
    name: '',
    attributes: { hp: 0, atk: 0, def: 0, spd: 0 },
    level: 1,
  });
  const [runeData, setRuneData] = useState({
    type: '',
    slot: 1,
    mainStat: '',
    subStats: { atk: 0, spd: 0 },
    grade: 1,
  });
  const [optimizerData, setOptimizerData] = useState({
    monsterId: '',
    targetStats: { hpWeight: 0.4, atkWeight: 0.3, defWeight: 0.2, spdWeight: 0.1 },
  });

  // Daten abrufen
  useEffect(() => {
    const fetchData = async () => {
      try {
        const monsterResponse = await axios.get('http://localhost:5000/api/monsters', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMonsters(monsterResponse.data);

        const runeResponse = await axios.get('http://localhost:5000/api/runes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRunes(runeResponse.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        if (error.response?.status === 401) {
          logout();
        }
      }
    };
    fetchData();
  }, [token, logout]);

  // Monster hinzufügen
  const handleAddMonster = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/monsters/add', monsterData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonsters([...monsters, response.data]);
      setShowMonsterForm(false);
      setMonsterData({ name: '', attributes: { hp: 0, atk: 0, def: 0, spd: 0 }, level: 1 });
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Monsters:', error);
    }
  };

  // Rune hinzufügen
  const handleAddRune = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/runes/add', runeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRunes([...runes, response.data]);
      setShowRuneForm(false);
      setRuneData({ type: '', slot: 1, mainStat: '', subStats: { atk: 0, spd: 0 }, grade: 1 });
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Rune:', error);
    }
  };

  // Optimizer ausführen
  const handleOptimize = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/optimize', optimizerData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuilds([...builds, response.data.build]);
      setShowOptimizerForm(false);
      setOptimizerData({ monsterId: '', targetStats: { hpWeight: 0.4, atkWeight: 0.3, defWeight: 0.2, spdWeight: 0.1 } });
    } catch (error) {
      console.error('Fehler bei der Optimierung:', error);
      alert(error.response?.data?.message || 'Fehler bei der Optimierung');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mana-gradient mb-8">Dein Sky Arena Dashboard</h1>

      {/* Monster Sektion */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-200">Deine Monster</h2>
          <button
            onClick={() => setShowMonsterForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Monster hinzufügen
          </button>
        </div>
        {monsters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {monsters.map((monster) => (
              <div
                key={monster._id}
                className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg border border-gray-700 hover:scale-105 transition duration-200"
              >
                <h3 className="text-xl font-bold text-gray-200">{monster.name}</h3>
                <p className="text-gray-400">Level: {monster.level}</p>
                <p className="text-gray-400">HP: {monster.attributes.hp}</p>
                <p className="text-gray-400">ATK: {monster.attributes.atk}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Keine Monster gefunden.</p>
        )}
      </div>

      {/* Runen Sektion */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-200">Deine Runen</h2>
          <button
            onClick={() => setShowRuneForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Rune hinzufügen
          </button>
        </div>
        {runes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {runes.map((rune) => (
              <div
                key={rune._id}
                className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg border border-gray-700 hover:scale-105 transition duration-200"
              >
                <h3 className="text-xl font-bold text-gray-200">{rune.type}</h3>
                <p className="text-gray-400">Slot: {rune.slot}</p>
                <p className="text-gray-400">Main Stat: {rune.mainStat}</p>
                <p className="text-gray-400">Grade: {rune.grade}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Keine Runen gefunden.</p>
        )}
      </div>

      {/* Optimizer Sektion */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-200">Runen-Optimierung</h2>
          <button
            onClick={() => setShowOptimizerForm(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-200"
          >
            Build optimieren
          </button>
        </div>
        {builds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {builds.map((build) => (
              <div
                key={build._id}
                className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg border border-gray-700"
              >
                <h3 className="text-xl font-bold text-gray-200">Build für Monster ID: {build.monsterId}</h3>
                <p className="text-gray-400">Optimierte Stats:</p>
                <p className="text-gray-400">HP: {build.optimizedStats.hp}</p>
                <p className="text-gray-400">ATK: {build.optimizedStats.atk}</p>
                <p className="text-gray-400">DEF: {build.optimizedStats.def}</p>
                <p className="text-gray-400">SPD: {build.optimizedStats.spd}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Keine optimierten Builds vorhanden.</p>
        )}
      </div>

      {/* Modal für Monster hinzufügen (bereits vorhanden) */}
      {showMonsterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mana-gradient mb-4">Monster hinzufügen</h2>
            <form onSubmit={handleAddMonster}>
              <div className="mb-4">
                <label className="block text-gray-300">Name</label>
                <input
                  type="text"
                  value={monsterData.name}
                  onChange={(e) => setMonsterData({ ...monsterData, name: e.target.value })}
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">HP</label>
                <input
                  type="number"
                  value={monsterData.attributes.hp}
                  onChange={(e) => setMonsterData({ ...monsterData, attributes: { ...monsterData.attributes, hp: Number(e.target.value) } })}
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">ATK</label>
                <input
                  type="number"
                  value={monsterData.attributes.atk}
                  onChange={(e) => setMonsterData({ ...monsterData, attributes: { ...monsterData.attributes, atk: Number(e.target.value) } })}
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">DEF</label>
                <input
                  type="number"
                  value={monsterData.attributes.def}
                  onChange={(e) => setMonsterData({ ...monsterData, attributes: { ...monsterData.attributes, def: Number(e.target.value) } })}
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">SPD</label>
                <input
                  type="number"
                  value={monsterData.attributes.spd}
                  onChange={(e) => setMonsterData({ ...monsterData, attributes: { ...monsterData.attributes, spd: Number(e.target.value) } })}
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowMonsterForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Abbrechen
                </button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Hinzufügen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal für Rune hinzufügen (bereits vorhanden) */}
      {showRuneForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mana-gradient mb-4">Rune hinzufügen</h2>
            <form onSubmit={handleAddRune}>
              <div className="mb-4">
                <label className="block text-gray-300">Typ</label>
                <input
                  type="text"
                  value={runeData.type}
                  onChange={(e) => setRuneData({ ...runeData, type: e.target.value })}
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">Slot</label>
                <select
                  value={runeData.slot}
                  onChange={(e) => setRuneData({ ...runeData, slot: Number(e.target.value) })}
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
                >
                  {[1, 2, 3, 4, 5, 6].map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">Main Stat</label>
                <input
                  type="text"
                  value={runeData.mainStat}
                  onChange={(e) => setRuneData({ ...runeData, mainStat: e.target.value })}
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">Grade</label>
                <select
                  value={runeData.grade}
                  onChange={(e) => setRuneData({ ...runeData, grade: Number(e.target.value) })}
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
                >
                  {[1, 2, 3, 4, 5, 6].map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowRuneForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Abbrechen
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Hinzufügen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal für Optimizer */}
      {showOptimizerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mana-gradient mb-4">Build optimieren</h2>
            <form onSubmit={handleOptimize}>
              <div className="mb-4">
                <label className="block text-gray-300">Monster auswählen</label>
                <select
                  value={optimizerData.monsterId}
                  onChange={(e) => setOptimizerData({ ...optimizerData, monsterId: e.target.value })}
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
                  required
                >
                  <option value="">-- Wähle ein Monster --</option>
                  {monsters.map(monster => (
                    <option key={monster._id} value={monster._id}>{monster.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">HP Gewichtung</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={optimizerData.targetStats.hpWeight}
                  onChange={(e) => setOptimizerData({
                    ...optimizerData,
                    targetStats: { ...optimizerData.targetStats, hpWeight: Number(e.target.value) }
                  })}
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">ATK Gewichtung</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={optimizerData.targetStats.atkWeight}
                  onChange={(e) => setOptimizerData({
                    ...optimizerData,
                    targetStats: { ...optimizerData.targetStats, atkWeight: Number(e.target.value) }
                  })}
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">DEF Gewichtung</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={optimizerData.targetStats.defWeight}
                  onChange={(e) => setOptimizerData({
                    ...optimizerData,
                    targetStats: { ...optimizerData.targetStats, defWeight: Number(e.target.value) }
                  })}
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">SPD Gewichtung</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={optimizerData.targetStats.spdWeight}
                  onChange={(e) => setOptimizerData({
                    ...optimizerData,
                    targetStats: { ...optimizerData.targetStats, spdWeight: Number(e.target.value) }
                  })}
                  className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowOptimizerForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Abbrechen
                </button>
                <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                  Optimieren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;