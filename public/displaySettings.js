var contentDiv = document.getElementById('content');

function displaySettings() {
    contentDiv.innerHTML = `
    <div class="mx-auto max-w-4xl py-16 sm:py-20 lg:py-24 text-white">
        <!-- Game Settings Section -->
        <div class="text-center">
            <div class="mx-auto max-w-lg">
                <form id="settings-form" class="space-y-8 p-8 rounded-lg shadow-xl bg-gray-800">
                <div class="space-y-4">
                <h2 class="text-3xl font-mono text-indigo-200">Game Settings</h2>
                        <!-- Victory Score Selection -->
                        <div>
                            <label class="block text-lg font-medium text-white" for="score-limit">Victory Score:</label>
                            <div class="flex justify-center space-x-4 mt-2">
                                <button type="button" class="score-btn w-24 py-2 rounded-md bg-indigo-500 text-white font-semibold hover:bg-indigo-500" data-value="5">5 Points</button>
                                <button type="button" class="score-btn w-24 py-2 rounded-md bg-indigo-500 text-white font-semibold hover:bg-indigo-500" data-value="10">10 Points</button>
                                <button type="button" class="score-btn w-24 py-2 rounded-md bg-indigo-500 text-white font-semibold hover:bg-indigo-500" data-value="15">15 Points</button>
                            </div>
                        </div>

                        <!-- Game Difficulty Selection -->
                        <div>
                            <label class="block text-lg font-medium text-white" for="difficulty">Game Difficulty:</label>
                            <div class="flex justify-center space-x-4 mt-2">
                                <button type="button" class="difficulty-btn w-24 py-2 rounded-md bg-indigo-500 text-white font-semibold hover:bg-indigo-500" data-value="easy">Easy</button>
                                <button type="button" class="difficulty-btn w-24 py-2 rounded-md bg-indigo-500 text-white font-semibold hover:bg-indigo-500" data-value="medium">Medium</button>
                                <button type="button" class="difficulty-btn w-24 py-2 rounded-md bg-indigo-500 text-white font-semibold hover:bg-indigo-500" data-value="hard">Hard</button>
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="w-full bg-indigo-700 hover:bg-indigo-500 text-white font-semibold py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">Save Settings</button>
                    <div>
                    <h2 class="text-3xl font-mono text-indigo-200">General Settings</h2>
                    <button id="logout-btn" class="mt-6 bg-indigo-700 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">Log Out</button>
                    </div>
                    </form>
            </div>
        </div>

    </div>`;

    // Store selected score and difficulty values
    let selectedScoreLimit = '5';
    let selectedDifficulty = 'easy';

    // Handle score selection
    document.querySelectorAll('.score-btn').forEach((button) => {
        button.addEventListener('click', () => {
            selectedScoreLimit = button.getAttribute('data-value');
            // Highlight the selected button
            document.querySelectorAll('.score-btn').forEach((btn) => btn.classList.remove('bg-indigo-500'));
            button.classList.add('bg-indigo-500');
        });
    });

    // Handle difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach((button) => {
        button.addEventListener('click', () => {
            selectedDifficulty = button.getAttribute('data-value');
            // Highlight the selected button
            document.querySelectorAll('.difficulty-btn').forEach((btn) => btn.classList.remove('bg-indigo-500'));
            button.classList.add('bg-indigo-500');
        });
    });

    // Listen for form submission and save settings
    document.getElementById('settings-form').addEventListener('submit', (event) => {
        event.preventDefault();

        localStorage.setItem('scoreLimit', selectedScoreLimit);
        localStorage.setItem('difficulty', selectedDifficulty);

        alert('Settings saved successfully!');
    });

    // Listen to logout button
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    });
}

export default displaySettings;
