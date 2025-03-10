import displayHome from "./displayHome.js";
import displayGame from "./displayGame.js";
import displayTournament from "./displayTournament.js";
import displayLogin from "./displayLogin.js";
import displayRegister from "./displayRegister.js";
import displayDashboard from "./displayDashboard.js";

var contentDiv = document.getElementById('content');

document.getElementById("navigation").addEventListener("click", (e)=>{

    switch (e.target.id)
    {
        case "home":
            displayHome();
            break;
        case "game":
            displayGame();
            break;
        case "tournament":
            displayTournament();
            break;
        case "login":
            displayLogin();
            break;
        case "register":
            displayRegister();
            break;
        case "dashboard":
            displayDashboard();
            break;
        default:
            contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }

})
