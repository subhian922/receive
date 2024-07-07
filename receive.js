const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// GitHub API Configuration
const owner = 'subhian922'; // Replace with your GitHub username
const repo = 'receive'; // Replace with your repository name
const token = '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'; // Replace with your GitHub personal access token
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;

// Endpoint to receive player data
app.post('/receive-data', (req, res) => {
    const playerData = req.body;
    console.log('Received player data:', playerData);

    // Process received data as needed

    res.status(200).json({ message: 'Data received successfully' });
});

// Endpoint to retrieve all received player data
app.get('/get-players', (req, res) => {
    // Return receivedData or retrieve from database
    res.json(receivedData);
});

// Endpoint to save Lua code and upload to GitHub
app.post('/save-lua-code', async (req, res) => {
    const { username, code } = req.body;

    try {
        // Encode Lua code to Base64 (GitHub API requirement)
        const content = Buffer.from(code).toString('base64');

        // Check if file already exists on GitHub
        const checkUrl = `${apiUrl}/${username}_code.txt`;
        const checkResponse = await fetch(checkUrl, {
            headers: {
                Authorization: `token ${token}`,
                'User-Agent': 'Node.js App', // Replace with your user agent
            },
        });

        if (checkResponse.status === 200) {
            // File already exists, update it
            const existingFile = await checkResponse.json();
            const updateUrl = `${apiUrl}/${username}_code.txt`;
            const updateResponse = await fetch(updateUrl, {
                method: 'PUT',
                headers: {
                    Authorization: `token ${token}`,
                    'User-Agent': 'Node.js App',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Update Lua code',
                    content,
                    sha: existingFile.sha,
                }),
            });

            const updateData = await updateResponse.json();
            console.log('File updated on GitHub:', updateData);
            res.status(200).json({ message: 'Lua code updated on GitHub' });
        } else {
            // File does not exist, create new file
            const createUrl = `${apiUrl}/${username}_code.txt`;
            const createResponse = await fetch(createUrl, {
                method: 'PUT',
                headers: {
                    Authorization: `token ${token}`,
                    'User-Agent': 'Node.js App',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Create Lua code',
                    content,
                }),
            });

            const createData = await createResponse.json();
            console.log('File created on GitHub:', createData);
            res.status(200).json({ message: 'Lua code uploaded to GitHub' });
        }
    } catch (error) {
        console.error('Error uploading Lua code to GitHub:', error);
        res.status(500).json({ error: 'Failed to upload Lua code to GitHub' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
