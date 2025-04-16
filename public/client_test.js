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

// const closeWebSocket = () => {
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       socket.close();
//       socket = null;
//     }
// };

const render = async () => {
    displaySideMenu();
    if (location.pathname !== "/game") {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close();
            ws = null;
        }
    }
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

const navigationElement = document.getElementById("navigation");
if (navigationElement) {
    navigationElement.addEventListener("click", (e) => {
        console.log('Link clicked:', e.target);
        if (e.target.matches("[data-link]"))
        {
            e.preventDefault();
            const href = e.target.getAttribute("href");
            history.pushState(null, null, href);
            // render();
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

    // Connect to the correct WebSocket endpoint
    ws = new WebSocket(`ws://${location.host}/ws`);

    ws.onopen = () => {
        console.log('Connected to game server');
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);
            
            switch (data.type) {
                case "connected":
                    // Store player ID
                    localStorage.setItem('playerID', data.playerID);
                    console.log('Connected as player:', data.playerID);
                    setupKeyboardControls(data.playerID);
                    break;
                    
                case "waiting":
                    displayWaitingMessage(data.message);
                    break;
                    
                case "gameReady":
                    displayReadyToStartMessage();
                    break;
                    
                case "gameStart":
                    hideMessages();
                    break;
                    
                case "update":
                    updateGameState(data);
                    break;
                    
                case "gameEnd":
                    displayGameEndMessage(data);
                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    ws.onclose = () => {
        console.log('Disconnected from game server');
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

function setupKeyboardControls(playerID) {
    // Remove any existing event listeners (optional, to prevent duplicates)
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    
    // Add new event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    function handleKeyDown(event) {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        
        // Prevent default arrow key scrolling
        if (['ArrowUp', 'ArrowDown', 'w', 's'].includes(event.key)) {
            event.preventDefault();
        }
        
        // Convert keyboard input to paddle movement
        if (event.key === 'ArrowUp' || event.key === 'w') {
            ws.send(JSON.stringify({
                type: "paddleMove",
                direction: "up",
                playerID: playerID
            }));
        } else if (event.key === 'ArrowDown' || event.key === 's') {
            ws.send(JSON.stringify({
                type: "paddleMove",
                direction: "down",
                playerID: playerID
            }));
        } else if (event.key === ' ' || event.key === 'Enter') {
            // Space or Enter to start game
            ws.send(JSON.stringify({
                type: "startGame",
                playerID: playerID
            }));
        }
    }
    
    function handleKeyUp(event) {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        
        if (['ArrowUp', 'ArrowDown', 'w', 's'].includes(event.key)) {
            ws.send(JSON.stringify({
                type: "paddleStop",
                playerID: playerID
            }));
        }
    }
}

function updateGameState(gameState) {
    // This function should update the canvas with the current game state
    // You'll need to implement this based on your displayGame.js structure
    const gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) return;
    
    const ctx = gameCanvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Draw paddles
    ctx.fillStyle = '#FFFFFF';
    gameState.paddles.forEach(paddle => {
        ctx.fillRect(
            paddle.side === 'left' ? 10 : gameCanvas.width - 20, 
            paddle.y, 
            10, 
            80
        );
    });
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw scores
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.scores.left.toString(), gameCanvas.width / 4, 50);
    ctx.fillText(gameState.scores.right.toString(), (gameCanvas.width / 4) * 3, 50);
}

function displayWaitingMessage(message) {
    const messageDiv = document.getElementById('gameMessages') || createMessageDiv();
    messageDiv.innerHTML = `<p class="waiting-message">${message}</p>`;
    messageDiv.style.display = 'block';
}

function displayReadyToStartMessage() {
    const messageDiv = document.getElementById('gameMessages') || createMessageDiv();
    messageDiv.innerHTML = `
        <p class="ready-message">Both players connected! Press Space or Enter to start the game.</p>
    `;
    messageDiv.style.display = 'block';
}

function displayGameEndMessage(data) {
    const messageDiv = document.getElementById('gameMessages') || createMessageDiv();
    messageDiv.innerHTML = `
        <p class="end-message">Game Over!</p>
        <p>Winner: ${data.winner === 'left' ? 'Left' : 'Right'} Player</p>
        <p>Score: ${data.scores.left} - ${data.scores.right}</p>
        <button id="playAgainBtn">Play Again</button>
    `;
    messageDiv.style.display = 'block';
    
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        location.reload(); // Simple way to restart - reloads the page
    });
}

function hideMessages() {
    const messageDiv = document.getElementById('gameMessages');
    if (messageDiv) {
        messageDiv.style.display = 'none';
    }
}

function createMessageDiv() {
    const gameDiv = document.getElementById('gameContainer') || contentDiv;
    const messageDiv = document.createElement('div');
    messageDiv.id = 'gameMessages';
    messageDiv.className = 'game-messages';
    gameDiv.appendChild(messageDiv);
    return messageDiv;
}
