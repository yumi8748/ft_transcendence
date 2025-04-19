import displayHome from "./displayHome.js";
import displayGame from "./displayGame.js";
import displayTournament from "./displayTournament.js";
import displayLogin from "./displayLogin.js";
import displayRegister from "./displayRegister.js";
import displayDashboard from "./displayDashboard.js";
import displayFriends from "./displayFriends.js";
import displaySideMenu from "./displaySideMenu.js";
import displaySettings from "./displaySettings.js";

var contentDiv = document.getElementById('content');
let ws;

const render = async () => {
    displaySideMenu();
    switch (location.pathname)
    {
        case "/":
            displayHome();
            break;
        case "/home":
            displayHome();
            break;
        case "/game":
            displayGame();
            break;
        case "/tournament":
            displayTournament();
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
        case "/friends":
            displayFriends();
            break;
        case "/settings":
            displaySettings();
            break;
        default:
            contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }
};

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
