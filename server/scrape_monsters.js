const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Monster = require('./models/Monster');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://swarfarm.com/bestiary/');

    const monsters = await page.evaluate(() => {
        const data = [];
        document.querySelectorAll('.monster-list-item').forEach(item => {
            const name = item.querySelector('.monster-name')?.innerText;
            const role = item.querySelector('.monster-role')?.innerText || 'Unknown';
            const sets = item.querySelector('.monster-sets')?.innerText.split(', ') || [];
            const stats = item.querySelector('.monster-stats')?.innerText.split(', ') || [];
            const skills = item.querySelector('.monster-skills')?.innerText.split(', ') || [];
            const awakenLevel = item.querySelector('.monster-awaken')?.innerText || 'Second';
            const element = item.querySelector('.monster-element')?.innerText || 'Unknown';
            const goals = {
                pvp: stats.slice(0, 2),
                pve: stats.slice(1, 3),
                toa: stats.slice(0, 2),
                rift: stats.slice(1, 3)
            };
            data.push({ name, role, sets, stats, goals, skills, awakenLevel, element });
        });
        return data;
    });

    await mongoose.connect('mongodb://localhost/sw_maxrune', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    for (const monster of monsters) {
        await Monster.updateOne(
            { name: monster.name },
            { $set: monster },
            { upsert: true }
        );
    }

    await browser.close();
    console.log('Monsterdaten gesammelt und gespeichert');
})();