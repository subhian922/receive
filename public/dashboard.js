document.addEventListener('DOMContentLoaded', function() {
    function fetchPlayerData() {
        fetch('https://receive-dun.vercel.app/api/get-players')
            .then(response => response.json())
            .then(data => {
                console.log('Player data received:', data);
                updatePlayerSlots(data);
            })
            .catch(error => {
                console.error('Error fetching player data:', error);
            });
    }

    function updatePlayerSlots(players) {
        const playerSlotsContainer = document.getElementById('playerSlots');
        playerSlotsContainer.innerHTML = ''; // Clear existing player slots

        players.forEach(player => {
            const playerSlot = document.createElement('div');
            playerSlot.classList.add('player-slot');

            const avatarImg = document.createElement('img');
            avatarImg.src = player.avatar;
            avatarImg.alt = `${player.username}'s Avatar`;
            avatarImg.classList.add('avatar');
            playerSlot.appendChild(avatarImg);

            const playerInfo = document.createElement('div');
            playerInfo.classList.add('player-info');

            const playerName = document.createElement('h3');
            playerName.textContent = player.username;
            playerName.addEventListener('click', () => showPlayerDetails(player));
            playerInfo.appendChild(playerName);

            const playerRap = document.createElement('p');
            playerRap.textContent = `RAP: ${player.rap}`;
            playerInfo.appendChild(playerRap);

            playerSlot.appendChild(playerInfo);
            playerSlotsContainer.appendChild(playerSlot);
        });
    }

    function showPlayerDetails(player) {
        document.getElementById('playerName').textContent = `${player.username}'s Items`;

        fetch(`https://receive-dun.vercel.app/api/get-items?username=${player.username}`)
            .then(response => response.json())
            .then(items => {
                const playerItems = document.getElementById('playerItems');
                playerItems.textContent = `Items: ${items.join(', ')}`;
            })
            .catch(error => {
                console.error(`Error fetching ${player.username}'s items:`, error);
            });
    }

    window.saveLuaCode = function() {
        const playerName = document.getElementById('playerName').textContent.split("'s")[0];
        const luaCode = document.getElementById('luaCode').value;

        fetch(`https://receive-dun.vercel.app/api/save-lua-code?username=${playerName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: luaCode })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save Lua code.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Lua code saved:', data);
            alert('Lua code saved successfully!');
        })
        .catch(error => {
            console.error('Error saving Lua code:', error);
            alert('Failed to save Lua code.');
        });
    };

    // Fetch player data initially
    fetchPlayerData();

    // Fetch player data every 5 seconds
    setInterval(fetchPlayerData, 5000);
});
