var contentDiv = document.getElementById('content');

function displayAuthentification(username)
{
    contentDiv.innerHTML = ` 
    <h2 id="username">Welcome</h2>
    `;
    document.getElementById("username").textContent = `Welcome ${username}`;
}

function displayRegister()
{
    contentDiv.innerHTML = ` 
    <div class="w-full max-w-xs">
    <form action="/register" method="POST class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        
        <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            Username
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="register-username" type="text"  name="username" placeholder="Username">
        </div>
        
        <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Password
        </label>
        <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="register-password" name="password" type="password" placeholder="******************">
        <p class="text-red-500 text-xs italic">Please choose a password.</p>
        </div>
       
        <div class="flex items-center justify-between">
        <button id="register" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Register
        </button>
        </div>

    </form>

    </div>
    `;

    document.getElementById("register").addEventListener("click", async function register() {
        const username = document.getElementById('register-username').value
        const password = document.getElementById('register-password').value
    
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })
    
        const data = await res.json();
        console.log(data)
        if (data.success) {
          checkSession()
        } else {
          alert('Registration failed')
        }
      })
}

async function checkSession() {
    // console.log("OK")
    const res = await fetch('/api/session')
    const data = await res.json()
    if (data.authenticated) {
      displayAuthentification(data.user)
    } else {
    // //   showLogin()
    }
  }

export default displayRegister;