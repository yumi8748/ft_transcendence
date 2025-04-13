var contentDiv = document.getElementById('content');

async function displayHome()
{
    
    const res = await fetch('/api/session')
    const data = await res.json()
    if (data.authenticated) {
        contentDiv.innerHTML = `<h2>Welcome to the Home Page ${data.user}!</h2>`;
    } else {
    // //   showLogin()
        contentDiv.innerHTML = `<h2>Welcome to the Home Page!</h2>`;

    }
}

export default displayHome;