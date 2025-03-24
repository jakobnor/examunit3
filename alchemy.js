import fetch from 'node-fetch';
import fs from 'fs';

const PLAYER_NAME = 'jakobno@uia.no';
const BASE_URL = 'https://alchemy-kd0l.onrender.com';

const ALCHEMY_MAP = {
    symbols: {
        '☉': 'Gold',
        '☿': 'Quicksilver',
        '☽': 'Silver',
        '♂': 'Iron',
        '♄': 'Lead'
    }
};

async function solveChallenge(challengeText) {
    const formulaMatch = challengeText.match(/“(.*?)”/);
    if (formulaMatch) {
        return formulaMatch[1].split('')
            .map(s => ALCHEMY_MAP.symbols[s])
            .join('');
    }
    return '';
}

async function main() {
    try {
        const start = await fetch(`${BASE_URL}/start?player=${PLAYER_NAME}`);
        let challenge = await start.json();
        
        // Handle formula challenge directly
        const answer = await solveChallenge(challenge.challenge);
        console.log('Submitting:', answer);

        const result = await fetch(`${BASE_URL}/answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player: PLAYER_NAME, answer }),
        });
        
        const finalResponse = await result.json();
        console.log('Server Response:', finalResponse);
        
        // Extract key from success message
        if (finalResponse.challenge.includes('ALCHEMY')) {
            const key = finalResponse.challenge.match(/ALCHEMY-\w+/)[0];
            fs.writeFileSync('skeletonKey.txt', key);
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}

main();