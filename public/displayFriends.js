var contentDiv = document.getElementById('content');

function displayFriends() {
    contentDiv.innerHTML = `
     <div class="p-10">
        <h2 class="text-2xl font-bold text-white mb-6">My Friends</h2>
        <div class="bg-white rounded-lg shadow-md p-6 overflow-x-auto min-h-[600px] min-w-[600px]">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-indigo-600 text-white">
                        <th class="p-3 border-b">Avatar</th>
                        <th class="p-3 border-b">Username</th>
                        <th class="p-3 border-b">Status</th>
                    </tr>
                </thead>
                <tbody id="friend-list">
                    <!-- Friends will be dynamically injected here -->
                </tbody>
            </table>
        </div>
    </div>`;

    fetchFriends();
}

async function fetchFriends() {
    try {
        const response = await fetch(`${window.location.origin}/service2/friends`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Error ${response.status}: ${errorText}`);
        }

        const friends = await response.json();
        console.log('Fetched friends:', friends);

        const friendList = document.getElementById('friend-list');
        friendList.innerHTML = '';

        friends.forEach(friend => {
            const isOnline = friend.is_online;
            const statusColor = isOnline ? 'text-green-600' : 'text-gray-500';
            const statusText = isOnline ? 'Online' : 'Offline';

            const friendItem = `
                <li class="flex items-center py-4">
                    <img src="${friend.avatar_url}" alt="${friend.username}'s avatar" class="w-12 h-12 rounded-full object-cover mr-4 border border-indigo-300">
                    <div class="flex-1">
                        <p class="text-lg font-semibold text-indigo-800">${friend.username}</p>
                        <p class="text-sm ${statusColor}">${statusText}</p>
                    </div>
                </li>`;
            friendList.innerHTML += friendItem;
        });

    } catch (error) {
        console.error('Error loading friends:', error);
    }
}

export default displayFriends;
