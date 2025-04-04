var contentDiv = document.getElementById('content');

function displayRegister() {
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
            
            <div class="flex flex-col items-center space-y-4">
                <label for="avatar" class="text-white text-lg">Choose Your Avatar</label>
                <div class="flex space-x-4">
                    <input type="radio" id="avatar1" name="avatar" value="default.png" class="hidden" required>
                    <label for="avatar1" class="cursor-pointer"><img src="/avatars/default.png" alt="Avatar 1" class="w-16 h-16 rounded-full avatar-img"></label>
                    
                    <input type="radio" id="avatar2" name="avatar" value="boy.png" class="hidden" required>
                    <label for="avatar2" class="cursor-pointer"><img src="/avatars/boy.png" alt="Avatar 2" class="w-16 h-16 rounded-full avatar-img"></label>
                    
                    <input type="radio" id="avatar3" name="avatar" value="girl.png" class="hidden" required>
                    <label for="avatar3" class="cursor-pointer"><img src="/avatars/girl.png" alt="Avatar 3" class="w-16 h-16 rounded-full avatar-img"></label>

                    <input type="radio" id="avatar4" name="avatar" value="dog.png" class="hidden" required>
                    <label for="avatar4" class="cursor-pointer"><img src="/avatars/dog.png" alt="Avatar 4" class="w-16 h-16 rounded-full avatar-img"></label>
                    
                    <input type="radio" id="avatar5" name="avatar" value="cat.png" class="hidden" required>
                    <label for="avatar5" class="cursor-pointer"><img src="/avatars/cat.png" alt="Avatar 5" class="w-16 h-16 rounded-full avatar-img"></label>
                </div>
            </div>

            <button type="submit" 
                    class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-200">
                Register
            </button>
        </form>

        <div id="error-message" class="text-red-400 text-sm mt-2"></div>

        <p class="mt-4 text-lg">Already have an account? 
            <a href="login.html" class="text-blue-300 hover:underline">Login here</a>
        </p>
    </div>
    <style>
        .avatar-img:hover {
            border: 2px solid #00f;
            transform: scale(1.1);
            transition: transform 0.2s, border 0.2s;
        }
        input[type="radio"]:checked + label .avatar-img {
            border: 2px solid #00f;
        }
    </style>`;

    
    const form = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const avatar = document.querySelector('input[name="avatar"]:checked').value;

        try {
            const response = await fetch(`${window.location.origin}/service1/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'username': username,
                    'password': password,
                    'avatar': avatar
                })
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('token', result.token);
                window.location.href = '/game'; // Redirect to the game page
            } else {
                errorMessage.textContent = result.message;
            }
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
}

export default displayRegister;