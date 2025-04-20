import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [file, setFile] = useState(null);
  const [optimizedResults, setOptimizedResults] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Kein Token gefunden.');
        }

        const response = await axios.get('https://optimizer.stocktropia.com/api/user-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        setError(`Fehler beim Laden der Daten: ${err.response?.status ? `Request failed with status code ${err.response.status}` : err.message}`);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage('Bitte wähle eine Datei aus.');
      return;
    }

    const formData = new FormData();
    formData.append('jsonFile', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://optimizer.stocktropia.com/api/upload-json', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadMessage(response.data.message);
      const userDataResponse = await axios.get('https://optimizer.stocktropia.com/api/user-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(userDataResponse.data);
    } catch (err) {
      setUploadMessage(`Fehler beim Hochladen: ${err.response?.data.message || err.message}`);
    }
  };

  const handleOptimize = async (monsterId) => {
    try {
      const token = localStorage.getItem('token');
      const targetStats = {
        spd: 100,
        critRate: 80,
        critDmg: 150,
        atk: 2000,
        hp: 15000,
      };

      const response = await axios.post(
        'https://optimizer.stocktropia.com/api/optimize',
        { monsterId, targetStats },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOptimizedResults((prev) => ({
        ...prev,
        [monsterId]: response.data,
      }));
    } catch (err) {
      setError(`Fehler bei der Optimierung: ${err.response?.data.message || err.message}`);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        <h2>SWEX-Daten hochladen</h2>
        <input type="file" accept=".json" onChange={handleFileChange} />
        <button onClick={handleUpload}>Hochladen</button>
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userData && userData.monsters && (
        <div>
          <h2>Deine Monster</h2>
          <ul>
            {userData.monsters.map((monster) => {
              const equippedRunes = userData.runes.filter(rune => monster.runes.includes(rune.id));
              const equippedArtifacts = userData.artifacts.filter(artifact => monster.artifacts.includes(artifact.id));
              const optimized = optimizedResults[monster.id];

              return (
                <li key={monster.id}>
                  <strong>{monster.name} ({monster.element})</strong>
                  <div>
                    <h4>Aktuelle Runen:</h4>
                    <ul>
                      {equippedRunes.length > 0 ? (
                        equippedRunes.map(rune => (
                          <li key={rune.id}>
                            Slot {rune.slot} ({rune.set}): {rune.main_stat}
                            <ul>
                              {rune.substats.map((substat, index) => (
                                <li key={index}>{substat.type}: {substat.value}</li>
                              ))}
                            </ul>
                          </li>
                        ))
                      ) : (
                        <li>Keine Runen ausgerüstet</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4>Aktuelle Artefakte:</h4>
                    <ul>
                      {equippedArtifacts.length > 0 ? (
                        equippedArtifacts.map(artifact => (
                          <li key={artifact.id}>
                            {artifact.type}: {artifact.main_stat}
                            <ul>
                              {artifact.substats.map((substat, index) => (
                                <li key={index}>{substat.type}: {substat.value}</li>
                              ))}
                            </ul>
                          </li>
                        ))
                      ) : (
                        <li>Keine Artefakte ausgerüstet</li>
                      )}
                    </ul>
                  </div>
                  <button onClick={() => handleOptimize(monster.id)}>Optimieren</button>
                  {optimized && (
                    <div>
                      <h4>Optimierte Kombination:</h4>
                      <h5>Runen:</h5>
                      <ul>
                        {optimized.runes.map(rune => (
                          <li key={rune.id}>
                            Slot {rune.slot} ({rune.set}): {rune.main_stat}
                            <ul>
                              {rune.substats.map((substat, index) => (
                                <li key={index}>{substat.type}: {substat.value}</li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                      <h5>Artefakte:</h5>
                      <ul>
                        {optimized.artifacts.length > 0 ? (
                          optimized.artifacts.map(artifact => (
                            <li key={artifact.id}>
                              {artifact.type}: {artifact.main_stat}
                              <ul>
                                {artifact.substats.map((substat, index) => (
                                  <li key={index}>{substat.type}: {substat.value}</li>
                                ))}
                              </ul>
                            </li>
                          ))
                        ) : (
                          <li>Keine Artefakte empfohlen</li>
                        )}
                      </ul>
                      <h5>Erreichte Stats:</h5>
                      <ul>
                        <li>SPD: {optimized.stats.spd}</li>
                        <li>Crit Rate: {optimized.stats.critRate}%</li>
                        <li>Crit DMG: {optimized.stats.critDmg}%</li>
                        <li>ATK: {optimized.stats.atk}%</li>
                        <li>HP: {optimized.stats.hp}%</li>
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <button onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }}>
        Abmelden
      </button>
    </div>
  );
};

export default Dashboard;