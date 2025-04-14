#### 5. KI-Module
Die KI nutzt einen genetischen Algorithmus und ein neuronales Netz, um Builds zu optimieren.

- **Neuronales Netz**: `ml/neural_net.py`  
Priorisiert Stats basierend auf Gilden-Daten:
```python
import tensorflow as tf
import json
import sys
import numpy as np

with open('/var/www/sw-maxrune/server/aggregated_data.json') as f:
    data = json.load(f)

X = []
y = []
for entry in data:
    stats = entry['stats']
    role = entry['role']
    X.append([
        stats['spd'], stats['hp'], stats['atk'], stats['def'],
        stats['critRate'], stats['critDmg']
    ])
    if role == "DPS":
        y.append([
            1 if stats['spd'] > 100 else 0,
            1 if stats['critDmg'] > 50 else 0,
            1 if stats['critRate'] > 30 else 0,
            0
        ])
    elif role == "Support":
        y.append([
            1 if stats['spd'] > 120 else 0,
            0,
            0,
            1 if stats['hp'] > 40 else 0
        ])
    else:
        y.append([1, 1, 1, 1])

X = np.array(X)
y = np.array(y)

model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu', input_shape=(6,)),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(4, activation='softmax')
])

model.compile(optimizer='adam', loss='mse')
model.fit(X, y, epochs=20, verbose=0)

def predict_stats(monster_name, goal):
    input_data = np.zeros((1, 6))
    prediction = model.predict(input_data, verbose=0)[0]
    return {
        "stats": ["SPD", "CRIT DMG", "CRIT Rate", "HP%"],
        "weights": prediction.tolist()
    }

if __name__ == "__main__":
    monster_name = sys.argv[1]
    goal = sys.argv[2]
    result = predict_stats(monster_name, goal)
    print(json.dumps(result))