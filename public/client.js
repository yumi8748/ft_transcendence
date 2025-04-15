import displayHome from "./displayHome.js";
import displayGame from "./displayGame.js";
import displayTournament from "./displayTournament.js";
import displayLogin from "./displayLogin.js";
import displayRegister from "./displayRegister.js";
import displayDashboard from "./displayDashboard.js";
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
            setupWebSocket();
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
        case "/settings":
            displaySettings();
            break;
        default:
            contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }
};

document.addEventListener("DOMContentLoaded", render)

window.addEventListener("popstate", render);

const navigationElement = document.getElementById("navigation");
if (navigationElement) {
    navigationElement.addEventListener("click", (e) => {
        if (e.target.matches("[data-link]"))
        {
            e.preventDefault();
        }
    });
}

// WebSocket setup and key event handling
function setupWebSocket() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        console.log('WebSocket is already open or connecting');
        return;
    }

    if (ws) {
        ws.onclose = null; // Remove the onclose handler to avoid triggering it during close
        ws.close(); // Close the existing WebSocket connection if it exists
    }

    ws = new WebSocket(`ws://${location.host}/ws`);

    ws.onopen = () => {
        console.log('Connected to server');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'playerID') {
            const playerID = data.playerID;
            document.addEventListener('keydown', (event) => {
                const message = { playerID };
                if (event.key === 's') message.sKey = true;
                if (event.key === 'w') message.wKey = true;
                if (event.key === 'l') message.lKey = true;
                if (event.key === 'o') message.oKey = true;
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(message));
                } else {
                    console.error('WebSocket is not open. Cannot send message.');
                }
            });
        } else if (data.type === 'update') {
            updateGameState(data);
        }
    };

    ws.onclose = () => {
        console.log('Disconnected from server');
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

function updateGameState(gameState) {
    // console.log('Received game state:', gameState);
}