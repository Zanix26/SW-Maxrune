const Json = require('../models/Json');
const Monster = require('../models/Monster');

async function aggregateData() {
    const jsons = await Json.find().populate('userId');
    const data = [];

    for (const json of jsons) {
        const units = json.data.unit_list || [];
        const runes = json.data.runes || [];

        for (const unit of units) {
            const monsterName = mapUnitMasterId(unit.unit_master_id);
            const monster = await Monster.findOne({ name: monsterName });
            const unitRunes = runes.filter(r => unit.runes?.includes(r.rune_id));
            const stats = calculateTotalStats(unitRunes);

            data.push({
                monsterName,
                role: monster?.role || 'Unknown',
                stats,
                runes: unitRunes.map(r => ({
                    set: r.set_id,
                    slot: r.slot_no,
                    substats: r.sec_eff
                })),
                user: json.userId.username,
                uploadedAt: json.uploadedAt
            });
        }
    }

    return data;
}

function mapUnitMasterId(id) {
    const unitMap = {
        14102: "Lushen",
        14913: "Verdehile",
        18302: "Tiana"
    };
    return unitMap[id] || 'Unbekannt';
}

function calculateTotalStats(runes) {
    const stats = { spd: 0, hp: 0, atk: 0, def: 0, critRate: 0, critDmg: 0 };
    runes.forEach(rune => {
        rune.sec_eff.forEach(([stat, value]) => {
            const key = stat.toLowerCase().replace('%', '').replace(' ', '');
            if (stats[key]) stats[key] += value;
        });
    });
    return stats;
}

module.exports = { aggregateData };