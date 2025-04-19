var contentDiv = document.getElementById('content');
let ws;
function displayGame()
{
    contentDiv.innerHTML = `
    <div class="flex min-h-screen flex-col items-center p-16">
        <!-- Top Section: Circles with Text -->
        <div class="mb-8 flex w-full max-w-xl justify-between">
            <!-- Left Circle (Profile) -->
            <div class="flex flex-col items-center">
            <div class="h-20 w-20 rounded-full border-4 border-gray-700 bg-gray-300"></div>
            <p id="result-player1" class="mt-2 text-sm text-gray-900">result</p>
            </div>
            <!-- Middle Box (Game Start) -->
            <div class="flex flex-col items-center">
            <button id="start-game" class="w-full rounded-md bg-gray-300 p-3 transition duration-200 hover:bg-blue-300 text-gray-700">Start</button>
            </div>
            <!-- Right Circle (Game Result) -->
            <div class="flex flex-col items-center">
            <div id="result-player2" class="h-20 w-20 rounded-full border-4 border-gray-700 bg-gray-300"></div>
            <p class="mt-2 text-sm text-gray-900">result</p>
            </div>
        </div>
        <!-- Bottom Section: Game Canvas -->
        <canvas id="game-canvas" class="rounded-lg bg-black" width="600" height="400"></canvas>
    </div>`;
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    
    function drawRect(x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }
    
    function drawCircle(x, y, radius, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawText(text, x, y) {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(text, x, y);
    }

    function draw(message) {
        ctx.clearRect(0, 0, 600, 400);
        if (message.type == "update") {
            drawCircle(message.ball.x, message.ball.y, 10, "white");
            drawRect(10, message.paddles[0].y, 10, 80, "white");
            drawRect(canvas.width - 20, message.paddles[1].y, 10, 80, "white");
            drawText(message.scores.left, 100, 50);
            drawText(message.scores.right, canvas.width - 100, 50);
        }
    }

    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        console.log('WebSocket is already open or connecting');
        // return;
    }

    // if (ws) {
        // ws.onclose = null; // Remove the onclose handler to avoid triggering it during close
        // ws.close(); // Close the existing WebSocket connection if it exists
    // }

    ws = new WebSocket(`ws://localhost:1234/ws`);

    ws.onopen = () => {
        console.log('Connected to server');
    };
 
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        draw(data);
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
            // updateGameState(data);
        }
    };

    ws.onclose = () => {
        console.log('Disconnected from server');
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

export default displayGame;