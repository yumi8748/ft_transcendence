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

    // Game part
    if (data.type === "back_game_position")
    {
        gameDisplay.draw(data);
    }
    else if (data.type === "back_game_home")
    {
        displayHome(socket);
    }
    else if (data.type === "back_game_draw")
    {
        gameDisplay.displayGame(socket);
        gameDisplay.draw(data);
    }

    // Tournament part
    if (data.type === "back_tournamentTable_draw")
    {
        tournamentDisplay.displayTournamentTable(socket);
        tournamentDisplay.displayPlayers(data);
    }
    else if (data.type === "back_tournamentTable_next")
    {
        tournamentDisplay.displayTournamentGame(socket);
        tournamentDisplay.draw(data);
    }
    else if (data.type === "back_tournamentGame_position")
    {
        tournamentDisplay.draw(data);
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
            tournamentDisplay.sendDrawTournamentTable(socket);
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
