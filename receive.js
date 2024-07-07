const fetch = require('node-fetch');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// POST endpoint to save Lua code as text file
app.post('/save-lua-code', async (req, res) => {
    const username = req.query.username;
    const code = req.body.code;
    
    const apiUrl = `https://api.github.com/repos/subhian922/receive/contents/${username}_code.txt`;
    const authHeader = {
        Authorization: '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',
        'Content-Type': 'application/json',
    };
    
    const fileContent = Buffer.from(code).toString('base64');
    
    try {
        // Check if file exists
        const existingFileRes = await fetch(apiUrl, {
            headers: authHeader,
        });

        if (existingFileRes.status === 200) {
            // Update file
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
                console.error('Failed to update Lua code on GitHub:', updateRes.statusText);
                res.status(500).json({ error: 'Failed to save Lua code.' });
            }
        } else if (existingFileRes.status === 404) {
            // Create new file
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
                console.error('Failed to create Lua code on GitHub:', createRes.statusText);
                res.status(500).json({ error: 'Failed to save Lua code.' });
            }
        } else {
            console.error('Failed to check Lua code on GitHub:', existingFileRes.statusText);
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
