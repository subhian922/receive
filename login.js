// login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    // Simulated user data (replace with your actual users)
    const users = [
        { username: 'ApexHubZ', password: 'ApexHub111' },
        { username: 'GaiPoloMdrs', password: 'Gai1111' }
    ];

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = loginForm.username.value;
        const password = loginForm.password.value;

        // Find user by username
        const user = users.find(user => user.username === username);

        if (user) {
            // Check password
            if (user.password === password) {
                showMessage('Login successful!');
                setTimeout(() => {
                    window.location.href = 'dashboard.html'; // Redirect to dashboard on successful login
                }, 1000); // Delay for 1 second (1000 milliseconds)
            } else {
                showMessage('Invalid username or password.');
            }
        } else {
            showMessage('Invalid username or password.');
        }

        // Clear the form fields
        loginForm.reset();
    });

    function showMessage(msg) {
        messageDiv.textContent = msg;
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 3000); // Clear message after 3 seconds
    }
});
