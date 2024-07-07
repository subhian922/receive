const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');


const app = express();
const port = process.env.PORT || 3000; // Use the port provided by Vercel

let receivedData = []; // Store received player data in memory

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// POST endpoint to receive player data
app.post('/receive-data', (req, res) => {
    const playerData = req.body;
    console.log('Received player data:', playerData);

    receivedData.push(playerData); // Store received data in memory

    res.status(200).json({ message: 'Data received successfully' });
});

// GET endpoint to retrieve all received player data
app.get('/get-players', (req, res) => {
    res.json(receivedData); // Respond with all received player data
});

// POST endpoint to save Lua code as text file
module.exports = async (req, res) => {
    const { method, body, query } = req;
    
    if (method === 'POST' && req.url === '/save-lua-code') {
        const { username } = query;
        const { code } = body;

        const apiUrl = `https://api.github.com/repos/subhian922/receive/contents/${username}_code.txt`;

        const authHeader = {
            Authorization: 'token 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',
            'Content-Type': 'application/json',
        };

        const fileContent = Buffer.from(code).toString('base64');

        try {
            // Your GitHub API logic here
            // Ensure to handle responses and errors appropriately
        } catch (error) {
            console.error('Error saving Lua code to GitHub:', error);
            res.status(500).json({ error: 'Failed to save Lua code.' });
        }
    } else {
        res.status(404).json({ error: 'Route not found' });
    }
};
app.listen(port, () => {
    console.log(Server running on port ${port});
});
