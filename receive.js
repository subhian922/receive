const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS package
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // For generating unique filenames

const app = express();
const port = process.env.PORT || 3000; // Use the port provided by Vercel or default to 3000

let receivedData = []; // Store received player data in memory

// Mock player items data (replace with actual data retrieval logic)
const playerItems = {
    "RICHVIBZZ": ["Item1", "Item2", "Item3"],
};

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// POST endpoint to receive player data
app.post('/receive-data', (req, res) => {
    const playerData = req.body;
    console.log('Received player data:', playerData);

    receivedData.push(playerData); // Store received data in memory

    // Respond with success message or other data as needed
    res.status(200).json({ message: 'Data received successfully' });
});

// GET endpoint to retrieve all received player data
app.get('/get-players', (req, res) => {
    res.json(receivedData); // Respond with all received player data
});

// GET endpoint to retrieve player items by username
app.get('/get-items', (req, res) => {
    const username = req.query.username;
    const items = playerItems[username] || [];
    res.json(items);
});

// POST endpoint to save Lua code
app.post('/save-lua-code', (req, res) => {
    const username = req.query.username;
    const code = req.body.code;

    // Generate a unique filename for the Lua code
    const filename = `${uuidv4()}.txt`;

    // Logic to save Lua code (this example uses in-memory storage, replace with external storage logic)
    fs.writeFile(filename, code, err => {
        if (err) {
            console.error('Error saving Lua code:', err);
            res.status(500).json({ error: 'Failed to save Lua code.' });
        } else {
            console.log('Lua code saved successfully.');
            res.status(200).json({ message: 'Lua code saved successfully.', filename: filename });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
