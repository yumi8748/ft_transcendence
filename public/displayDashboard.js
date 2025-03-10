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

export default displayDashboard;