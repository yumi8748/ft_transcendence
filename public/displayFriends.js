var contentDiv = document.getElementById('content');

function displayFriends() {
    contentDiv.innerHTML = `
    <div class="p-10">
        <h2 class="text-2xl font-bold text-white mb-6">My Friends</h2>

        <!-- add friends -->
        <div class="mb-6">
            <input 
                type="text" 
                id="add-friend" 
                placeholder="Enter username to add" 
                class="p-3 w-full max-w-xs rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
                id="add-friend-btn" 
                class="mt-3 p-3 w-full max-w-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
                Add Friend
            </button>
        </div>

        <!-- friends list -->
        <div class="bg-white rounded-lg shadow-md p-6 min-h-[600px] min-w-[600px]">
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


    const addFriendBtn = document.getElementById('add-friend-btn');
    addFriendBtn.addEventListener('click', addFriend);
}

async function fetchFriends() {
    try {
        const response = await fetch(`${window.location.origin}/service2/friends`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
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
            const isOnline = friend.status === 'online';
            const statusColor = isOnline ? 'text-green-600' : 'text-gray-500';
            const statusText = isOnline ? 'Online' : 'Offline';

            const friendItem = `
                <tr class="hover:bg-indigo-100 text-indigo-800">
                    <td class="p-3 border-b">
                        <img src="${friend.avatar_url}" alt="${friend.username}'s avatar" class="w-12 h-12 rounded-full object-cover mr-4 border border-indigo-300">
                    </td>
                    <td class="p-3 border-b font-medium">${friend.username}</td>
                    <td class="p-3 border-b ${statusColor} font-semibold">${statusText}</td>
                </tr>`;
            friendList.innerHTML += friendItem;
        });

    } catch (error) {
        console.error('Error loading friends:', error);
    }
}

// add a new friend
async function addFriend() {
    const username = document.getElementById('add-friend').value.trim();
    if (!username) return;

    try {
        const response = await fetch(`${window.location.origin}/service2/friends`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ username })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error adding friend: ${errorText}`);
        }

        alert('Friend added successfully!');
        fetchFriends(); // Refresh the friends list
    } catch (error) {
        console.error('Error adding friend:', error);
        alert('Failed to add friend.');
    }
}

export default displayFriends;
