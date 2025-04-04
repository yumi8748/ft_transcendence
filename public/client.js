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

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.id === "back-game" && data.home === false)
    {
        gameDisplay.handleGameMess(data);
    }
    if (data.id === "back-game" && data.home === true)
    {
        displayHome(socket);
    }
    if (data.id === "back-tournament" && data.type === "fill-players")
    {
        tournamentDisplay.displayPlayers(data);
    }
    if (data.id === "back-tournament" && data.type === "display-game")
    {
        gameDisplay.displayGame(socket);
    }
    if (data.id === "back-tournament" && data.type === "display-tournament")
    {
        tournamentDisplay.displayTournament(socket);
    }
    if (data.id === "back-tournament" && data.type === "home")
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
            gameDisplay.displayGame(socket);
            break;
        case "/tournament":
            tournamentDisplay.displayTournament(socket);
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
