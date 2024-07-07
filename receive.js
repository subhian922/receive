const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

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
app.post('/save-lua-code', (req, res) => {
    const username = req.query.username;
    const code = req.body.code;
    const filePath = path.join(__dirname, ${username}_code.txt);

    fs.writeFile(filePath, code, err => {
        if (err) {
            console.error('Error saving Lua code:', err);
            res.status(500).json({ error: 'Failed to save Lua code.' });
        } else {
            console.log('Lua code saved successfully.');
            res.status(200).json({ message: 'Lua code saved successfully.' });
        }
    });
});

app.listen(port, () => {
    console.log(Server running on port ${port});
});
