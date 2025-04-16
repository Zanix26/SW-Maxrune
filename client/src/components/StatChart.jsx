import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function StatChart({ stats }) {
    const data = {
        labels: ['SPD', 'HP%', 'ATK%', 'DEF%', 'CRIT Rate', 'CRIT DMG'],
        datasets: [{
            label: 'Stats',
            data: [
                stats.spd || 0,
                stats.hp || 0,
                stats.atk || 0,
                stats.def || 0,
                stats.critRate || 0,
                stats.critDmg || 0
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        }]
    };n

    return <Radar data={data} />;
}

export default StatChart;