const contentDiv = document.getElementById('content');
let socket;

function displayGame() {
    let keyboard = {
        wKey: false,
        sKey: false,
        oKey: false,
        lKey: false,
    }
    
    contentDiv.innerHTML = `
    <div class="flex justify-center items-center min-h-screen p-8">
    <canvas id="game-canvas" class="bg-black rounded-lg" width="600" height="400"></canvas>
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
        console.log('Connected to server');
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