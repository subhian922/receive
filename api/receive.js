const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

let receivedData = [];

const playerItems = {
    "RICHVIBZZ": ["Item1", "Item2", "Item3"],
};

app.use(bodyParser.json());
app.use(cors());

app.post('/api/receive-data', (req, res) => {
    const playerData = req.body;
    console.log('Received player data:', playerData);

    receivedData.push(playerData);

    res.status(200).json({ message: 'Data received successfully' });
});

app.get('/api/get-players', (req, res) => {
    res.json(receivedData);
});

app.get('/api/get-items', (req, res) => {
    const username = req.query.username;
    const items = playerItems[username] || [];
    res.json(items);
});

app.post('/api/save-lua-code', async (req, res) => {
    const username = req.query.username;
    const code = req.body.code;

    const apiUrl = `https://api.github.com/repos/subhian922/receive/contents/${username}_code.txt`;
    
    const authHeader = {
        Authorization: 'token YOUR_GITHUB_TOKEN',  // Replace YOUR_GITHUB_TOKEN with your actual GitHub token
        'Content-Type': 'application/json',
    };
    
    const fileContent = Buffer.from(code).toString('base64');

    try {
        const existingFileRes = await fetch(apiUrl, {
            headers: authHeader,
        });

        if (existingFileRes.status === 200) {
            const existingFile = await existingFileRes.json();
            const updateRes = await fetch(apiUrl, {
                method: 'PUT',
                headers: authHeader,
                body: JSON.stringify({
                    message: `Updating ${username}'s Lua code`,
                    content: fileContent,
                    sha: existingFile.sha,
                }),
            });

            if (updateRes.status === 200) {
                console.log('Lua code updated successfully on GitHub.');
                res.status(200).json({ message: 'Lua code saved successfully.' });
            } else {
                console.error('Failed to update Lua code on GitHub.');
                res.status(500).json({ error: 'Failed to save Lua code.' });
            }
        } else if (existingFileRes.status === 404) {
            const createRes = await fetch(apiUrl, {
                method: 'PUT',
                headers: authHeader,
                body: JSON.stringify({
                    message: `Creating ${username}'s Lua code`,
                    content: fileContent,
                }),
            });

            if (createRes.status === 201) {
                console.log('Lua code saved successfully on GitHub.');
                res.status(200).json({ message: 'Lua code saved successfully.' });
            } else {
                console.error('Failed to create Lua code on GitHub.');
                res.status(500).json({ error: 'Failed to save Lua code.' });
            }
        } else {
            console.error('Failed to check Lua code on GitHub.');
            res.status(500).json({ error: 'Failed to save Lua code.' });
        }
    } catch (error) {
        console.error('Error saving Lua code to GitHub:', error);
        res.status(500).json({ error: 'Failed to save Lua code.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
