const Monster = require('../models/monster');

const getMonster = async (req, res) => {
    try{
        const userId = req.userId;
        const monsters = await Monster.find({ userId });
        res.status(200).json(monsters);
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Abrufen der Monster', error });
    }
};

const addMonster = async (req, res) => {
    const { name, attributes, level } = req.body;
    try{
        const userId = req.userId;
        const monster = new Monster({ userId, name, attributes, level });
        await monster.save();
        res.status(201).json(monster);
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Hinzufügen des Monsters', error });
    }
};

module.exports = { getMonsters, addMonster};