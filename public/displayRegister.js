var contentDiv = document.getElementById('content');

function displayRegister() {
    contentDiv.innerHTML = `<div class="bg-gray-800 p-12 rounded-lg shadow-lg w-full max-w-md text-center">

	<h2 class="text-2xl font-semibold mb-4">Register</h2>

	<form id="register-form" class="flex flex-col space-y-5" action="/register" method="POST" enctype="multipart/form-data" novalidate>
		<input type="text" name="username" placeholder="Username" required 
				class="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
        
        <input type="text" name="email" placeholder="email" required 
				class="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
		
		<input type="password" name="password" placeholder="Password" required 
				class="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
		
		<input type="password" name="confirmPassword" placeholder="Confirm Password" required 
				class="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
		
		<label for="avatar" class="text-white text-sm">Upload Your Avatar</label>
		<input type="file" name="avatar" accept="image/*"
				class="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm">

		<button type="submit"
				class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded transition duration-200">Register
		</button>
	</form>

	<div id="error-message" class="text-red-400 text-sm mt-2"></div>

	<p class="mt-3 text-base">Already have an account? 
		<a href="login.html" class="text-blue-300 hover:underline">Login here</a>
	</p>
</div>
`;

    
    const form = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        //const username = document.getElementsByName('username').value;
        //const password = document.getElementsByName('password').value;
        //const avatar = document.getElementsByName('input[name="avatar"]:checked').value;

        try {
            const response = await fetch(`${window.location.origin}/service1/register`, {
                method: "POST",
                //headers: {
                //    'Content-Type': 'multipart/form-data'
                //},
                body: formData
                //body: JSON.stringify({
                //    'username': username,
                //    'password': password,
                //    'avatar': avatar
                //})
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