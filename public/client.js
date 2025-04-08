import displayHome from "./displayHome.js";
import {TournamentDisplay} from "./displayTournament.js";
import displayLogin from "./displayLogin.js";
import displayRegister from "./displayRegister.js";
import displayDashboard from "./displayDashboard.js";
import { GameDisplay } from './displayGame.js';

const socket = new WebSocket(`ws://${location.host}/ws`);
const gameDisplay = new GameDisplay();
const tournamentDisplay = new TournamentDisplay();

socket.onopen = function (event) {
    // socket.send("C: Client openend connection");
};

socket.onclose = function (event) {
    // console.log('C: Client closed connection');
};

socket.onmessage = function (event) 
{
    const data = JSON.parse(event.data);
    console.log(data)
    if (data.type === "back-game-position-update")
    {
        gameDisplay.draw(data);
    }
    else if (data.type === "back-game-home")
    {
        displayHome(socket);
    }
    else if (data.type === "back-game-draw-game")
    {
        gameDisplay.displayGame(socket);
        gameDisplay.draw(data);
    }
    else if (data.type === "back-tournament-draw-tournament" || data.type === "back-game-draw-tournament")
    {
        tournamentDisplay.displayTournament(socket);
        tournamentDisplay.displayPlayers(data);
    }
    else if (data.type === "back-tournament-draw-game")
    {
        gameDisplay.sendDrawGame(socket);
    }
    else if (data.type === "back-tournament-home")
    {
        displayHome(socket);
    }
    
};

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
            gameDisplay.sendDrawGame(socket);
            break;
        case "/tournament":
            tournamentDisplay.sendDrawTournament(socket);
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
