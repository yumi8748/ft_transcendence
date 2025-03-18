import displayHome from "./displayHome.js";
import displayGame from "./displayGame.js";
import displayTournament from "./displayTournament.js";
import displayLogin from "./displayLogin.js";
import displayRegister from "./displayRegister.js";
import displayDashboard from "./displayDashboard.js";

const socket = new WebSocket(`ws://${location.host}/ws`);

var contentDiv = document.getElementById('content');

const render = async () => {

    switch (location.pathname)
    {
        case "/":
            displayHome();
            break;
        case "/home":
            displayHome();
            break;
        case "/game":
            displayGame(socket);
            break;
        case "/tournament":
            displayTournament(socket);
            break;
        case "/login":
            displayLogin();
            break;
        case "/register":
            displayRegister();
            break;
        case "/dashboard":
            displayDashboard();
            break;
        default:
            contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }

}

document.addEventListener("DOMContentLoaded", render)

window.addEventListener("popstate", render);

document.getElementById("navigation").addEventListener("click", (e)=>{

    if (e.target.matches("[data-link]"))
    {
        e.preventDefault();
        history.pushState(null,null,e.target.href);
        render()
    }
})
