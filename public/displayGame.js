const contentDiv = document.getElementById('content');
let socket;

function displayGame() {
    
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
    
    // add funtion to draw the player profile picture
    
    // add function to draw the game result

    // add function to start the game

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

    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        console.log('WebSocket is already open or connecting');
        return;
    }

    if (socket) {
        socket.onclose = null; // Remove the onclose handler to avoid triggering it during close
        socket.close(); // Close the existing WebSocket connection if it exists
    }

    socket = new WebSocket(`ws://${location.host}/ws`);

    socket.onopen = function (event) {
        console.log('Connected to server yes', socket);
    };
    
    socket.onclose = function (event) {
        console.log('Disconnected from server');
    };

    socket.onmessage = function (event) {
        const message = JSON.parse(event.data);
        draw(message);
    };

    socket.onerror = function (error) {
        console.error('WebSocket error:', error);
    };

    //document.addEventListener('keydown', (e) => {
    //    if (e.key === 's')
    //        keyboard.sKey = true;
    //    else if (e.key === 'w')
    //        keyboard.wKey = true;
    //    else if (e.key === 'o')
    //        keyboard.oKey = true;
    //    else if (e.key === 'l')
    //        keyboard.lKey = true;
    //    if (socket.readyState === WebSocket.OPEN) {
    //        socket.send(JSON.stringify(keyboard));
    //    } else {
    //        console.error('WebSocket is not open. Cannot send message.');
    //    }
    //});

    //document.addEventListener('keyup', (e) => {
    //    if (e.key === 's')
    //        keyboard.sKey = false;
    //    else if (e.key === 'w')
    //        keyboard.wKey = false;
    //    else if (e.key === 'o')
    //        keyboard.oKey = false;
    //    else if (e.key === 'l')
    //        keyboard.lKey = false;
    //    if (socket.readyState === WebSocket.OPEN) {
    //        socket.send(JSON.stringify(keyboard));
    //    } else {
    //        console.error('WebSocket is not open. Cannot send message.');
    //    }
    //});
}

export default displayGame;