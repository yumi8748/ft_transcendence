var contentDiv = document.getElementById('content');

function displayDashboard() {
    contentDiv.innerHTML = `
    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
        
        <!-- Stats Overview -->
        <main class="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <h3 class="text-lg font-semibold text-indigo-700">Total Players</h3>
                <p class="text-4xl font-bold text-indigo-800" id="total-players">Loading...</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <h3 class="text-lg font-semibold text-indigo-700">Total Games Played</h3>
                <p class="text-4xl font-bold text-indigo-800" id="total-games">Loading...</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <h3 class="text-lg font-semibold text-indigo-700">Champion</h3>
                <p class="text-4xl font-bold text-indigo-800" id="champion">Loading...</p>
            </div>
        </main>

        <!-- Match Records Table -->
        <section class="p-6">
            <h2 class="text-white text-2xl font-semibold mb-2">Match Records</h2>
            <div class="bg-white rounded-lg shadow-md p-6 overflow-x-auto min-h-[600px] min-w-[600px]">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-indigo-600 text-white">
                            <th class="p-3 border-b">Player 1</th>
                            <th class="p-3 border-b">Player 2</th>
                            <th class="p-3 border-b">Score</th>
                            <th class="p-3 border-b">Date</th>
                        </tr>
                    </thead>
                    <tbody id="match-records">
                        <!-- dynamic statics here -->
                    </tbody>
                </table>
            </div>
        </section>
    </div>`;

    fetchMatches();
}

async function fetchMatches() {
    try {
        const response = await fetch(`${window.location.origin}/service2/matches`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // 适用于需要身份验证的 API
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Error ${response.status}: ${errorText}`);
        }

        const matches = await response.json();
        console.log('Fetched matches:', matches); // Debug log

        const matchRecordsTable = document.getElementById('match-records');
        matchRecordsTable.innerHTML = '';

        matches.forEach(match => {
            const matchRow = `
                <tr class="hover:bg-indigo-200 text-indigo-700">
                    <td class="p-3 border-b">${match.player1}</td>
                    <td class="p-3 border-b">${match.player2}</td>
                    <td class="p-3 border-b">${match.player1_score} - ${match.player2_score}</td>
                    <td class="p-3 border-b">${new Date(match.game_start_time).toLocaleDateString()}</td>
                </tr>`;
            matchRecordsTable.innerHTML += matchRow;
        });

        // update Champion
        document.getElementById('champion').textContent = getChampion(matches);
        document.getElementById('total-players').textContent = new Set(matches.flatMap(m => [m.player1, m.player2])).size;
        document.getElementById('total-games').textContent = matches.length;

    } catch (error) {
        console.error('Error loading matches:', error);
    }
}



// calculate Champion（most wins）
function getChampion(matches) {
    const winCounts = {};
    matches.forEach(match => {
        const winner = match.player1_score > match.player2_score ? match.player1 : match.player2;
        winCounts[winner] = (winCounts[winner] || 0) + 1;
    });

    return Object.keys(winCounts).length > 0 ? 
        Object.entries(winCounts).sort((a, b) => b[1] - a[1])[0][0] : 'No Data';
}

export default displayDashboard;
