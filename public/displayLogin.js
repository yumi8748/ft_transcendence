var contentDiv = document.getElementById('content');

function displayLogin()
{
    contentDiv.innerHTML = `

    <h1 class="text-4xl font-bold mb-8">Pong Game</h1>

    <div class="bg-gray-800 p-12 rounded-lg shadow-lg w-96 text-center">
        <h2 class="text-2xl font-semibold mb-4">Login</h2>
        
        <form id="login-form" class="flex flex-col">
            <input type="text" id="username" placeholder="Username" required
                class="w-full p-3 mb-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <input type="password" id="password" placeholder="Password" required
                class="w-full p-3 mb-4 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <button type="submit"
                class="w-full p-3 bg-blue-500 rounded-md hover:bg-blue-700 transition duration-200">
                Login
            </button>
        </form>

        <div id="error-message" class="text-red-400 mt-3"></div>

        <p class="mt-4 text-sm">
            Don't have an account? <a href="register.html" class="text-blue-300 hover:underline">Register here</a>
        </p>
    </div>
`;

    const form = document.getElementById('login-form');
        const errorMessage = document.getElementById('error-message');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:3002/login', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', result.token);
                    window.location.href = '/game'; // Redirect to the game page
                } else {
                    errorMessage.textContent = result.message;
                }
            } catch (error) {
                errorMessage.textContent = error;
            }
        });
}

export default displayLogin;