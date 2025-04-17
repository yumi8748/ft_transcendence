import displayHome from "./displayHome.js";
import displayGame from "./displayGame.js";
import displayLogin from "./displayLogin.js";
import displayRegister from "./displayRegister.js";

const render = () => {
	switch (window.location.pathname) {
		case "/":
			displayHome();
			break;
		case "/home":
			displayHome();
			break;
		case "/game":
			displayGame();
			break;
		case "/login":
			displayLogin();
			break;
		case "/register":
			displayRegister();
			break;
	}
}

const updateAuthUI = async () => {
	let isLoggedIn = false
	let username = ''
	try {
		const res = await fetch('/auth/status', {
			method: 'GET',
			credentials: 'include'
		})
		const data = await res.json()
		isLoggedIn = data.loggedIn === true
		username = data.username + " 🟢 " || ''
	} catch (error) {
		console.error('Login check failed:', err)
	}
	console.log('User logged in:', isLoggedIn, 'Username:', username)
	document.getElementById('username').textContent = username
	document.getElementById('auth-buttons').style.display = isLoggedIn ? 'none' : 'block';
	document.getElementById('logout-section').style.display = isLoggedIn ? 'block' : 'none';
}

updateAuthUI();
render();

  