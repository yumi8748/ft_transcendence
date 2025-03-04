var contentDiv = document.getElementById('content');


function displayDashboard()
{
    contentDiv.innerHTML = `<aside class="w-64 bg-indigo-800 text-white p-6 flex flex-col space-y-6 shadow-lg">
        <h1 class="text-3xl font-bold text-center">Pong Game</h1>
        <nav class="space-y-6">
            <a href="#" class="block py-2 px-4 rounded-lg bg-indigo-700 hover:bg-indigo-600">Home</a>
            <a href="#" class="block py-2 px-4 rounded-lg bg-indigo-700 hover:bg-indigo-600">Game</a>
            <a href="#" class="block py-2 px-4 rounded-lg bg-indigo-700 hover:bg-indigo-600">Match Record</a>
            <a href="#" class="block py-2 px-4 rounded-lg bg-indigo-700 hover:bg-indigo-600">Logout</a>
        </nav>
    </aside>
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
        <!-- Navbar -->
        <header class="bg-gradient-to-r from-indigo-700 to-purple-600 shadow-md p-4 flex justify-between items-center">
            <h2 class="text-white text-3xl font-semibold">Dashboard</h2>
            <input type="text" placeholder="Search..." class="bg-indigo-500 px-4 py-2 border rounded-lg text-white placeholder-white focus:ring-2 focus:ring-indigo-300">
        </header>
        
        <!-- Stats Overview -->
        <main class="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <h3 class="text-lg font-semibold text-indigo-700">Total Players</h3>
                <p class="text-4xl font-bold text-indigo-800">1,234</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <h3 class="text-lg font-semibold text-indigo-700">Total Games Played</h3>
                <p class="text-4xl font-bold text-indigo-800">12,345</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <h3 class="text-lg font-semibold text-indigo-700">Champion</h3>
                <p class="text-4xl font-bold text-indigo-800">player</p>
            </div>
        </main>

        <!-- Match Records Table -->
        <section class="p-6">
            <h2 class="text-indigo-800 text-2xl font-semibold mb-2">Match Records</h2>
            <div class="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-indigo-600 text-white">
                            <th class="p-3 border-b">Player 1</th>
                            <th class="p-3 border-b">Player 2</th>
                            <th class="p-3 border-b">Score</th>
                            <th class="p-3 border-b">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="hover:bg-indigo-100">
                            <td class="p-3 border-b">Alice</td>
                            <td class="p-3 border-b">Bob</td>
                            <td class="p-3 border-b">10 - 8</td>
                            <td class="p-3 border-b">2024-02-25</td>
                        </tr>
                        <tr class="hover:bg-indigo-100">
                            <td class="p-3 border-b">Charlie</td>
                            <td class="p-3 border-b">Dave</td>
                            <td class="p-3 border-b">6 - 10</td>
                            <td class="p-3 border-b">2024-02-24</td>
                        </tr>
                        <tr class="hover:bg-indigo-100">
                            <td class="p-3 border-b">Eve</td>
                            <td class="p-3 border-b">Frank</td>
                            <td class="p-3 border-b">12 - 14</td>
                            <td class="p-3 border-b">2024-02-23</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>`;
}


function changeContent(page) {

    switch (page) {
    case "home":
        displayHome();
        break;
    case "game":
        displayGame();
        break;
    case "tournament":
        displayTournament();
        break;
    case "login":
        displayLogin();
        break;
    case "register":
        displayRegister();
        break;
    case "dashboard":
        displayDashboard();
        break;
    default:
        contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }
        
}


function displayHome()
{
    contentDiv.innerHTML = `<h2>Welcome to the Home Page!</h2>`;
}

function displayGame()
{
    const socket = new WebSocket('ws://localhost:8080');
        
        socket.onopen = function (event) {
            // socket.send("C: Client openend connection");
        };

        socket.onclose = function (event) {
            console.log('C: Client closed connection');
        };

        const message = {
            type: "",
        };
        contentDiv.innerHTML = `<h2>Game Page!</h2><canvas id="tutorial" width="1000" height="1000">salut</canvas>`;
        const canvas = document.getElementById("tutorial");
        const ctx = canvas.getContext("2d");

        socket.onmessage = function (event) {

            const test = JSON.parse(event.data);
            // drawPlayer(test.x, test.y)
            ctx.fillStyle = "rgb(200 0 0)";
            ctx.fillRect(test.x, test.y, 50, 50);
        
        };

        document.addEventListener('keydown', (e) => 
        {
            ctx.clearRect(0,0,1000,1000)
            if (e.key == 's')
                message.type = "s"
            else if (e.key == 'w')
                message.type = "w"
            else if (e.key == 'a')
                message.type = "a"
            else if (e.key == 'd')
                message.type = "d"
            socket.send(JSON.stringify(message));
        });
}

function displayTournament()
{
    contentDiv.innerHTML = `<h2>tournament page</h2>`;
}

function displayLogin()
{
    contentDiv.innerHTML = `<h1 class="text-4xl font-bold mb-8">Pong Game</h1>

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
    </div>`;
}

function displayRegister()
{
    contentDiv.innerHTML = `<h1 class="text-3xl font-bold mb-8">Pong Game</h1>
    <div class="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg text-center">

        <h2 class="text-xl font-semibold mb-6">Register</h2>

        <form id="register-form" class="flex flex-col space-y-7">
            <input type="text" id="username" placeholder="Username" required 
                   class="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
            
            <input type="password" id="password" placeholder="Password" required 
                   class="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
            
            <input type="password" id="confirm-password" placeholder="Confirm Password" required 
                   class="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
            
            <button type="submit" 
                    class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-200">
                Register
            </button>
        </form>

        <div id="error-message" class="text-red-400 text-sm mt-2"></div>

        <p class="mt-4 text-lg">Already have an account? 
            <a href="login.html" class="text-blue-300 hover:underline">Login here</a>
        </p>
    </div>`;
}