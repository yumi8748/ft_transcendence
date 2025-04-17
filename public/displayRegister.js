var contentDiv = document.getElementById('content');

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
            
            <div class="flex flex-col items-center space-y-4">
                <label for="avatar" class="text-white text-lg">Choose Your Avatar</label>
                <div class="flex space-x-4">
                    <input type="radio" id="avatar1" name="avatar" value="avatar1" class="hidden" required>
                    <label for="avatar1" class="cursor-pointer"><img src="path/to/avatar1.png" alt="Avatar 1" class="w-16 h-16 rounded-full"></label>
                    
                    <input type="radio" id="avatar2" name="avatar" value="avatar2" class="hidden" required>
                    <label for="avatar2" class="cursor-pointer"><img src="path/to/avatar2.png" alt="Avatar 2" class="w-16 h-16 rounded-full"></label>
                    
                    <input type="radio" id="avatar3" name="avatar" value="avatar3" class="hidden" required>
                    <label for="avatar3" class="cursor-pointer"><img src="path/to/avatar3.png" alt="Avatar 3" class="w-16 h-16 rounded-full"></label>
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
    </div>`;
}

export default displayRegister;