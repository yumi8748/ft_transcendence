import displayHome from "./displayHome.js";

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

    // if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    //     console.log('WebSocket is already open or connecting');
    //     return;
    // }

    // if (socket) {
    //     socket.onclose = null; // Remove the onclose handler to avoid triggering it during close
    //     socket.close(); // Close the existing WebSocket connection if it exists
    // }

    // socket = new WebSocket(`ws://${location.host}/ws`);

    // socket.onopen = function (event) {
    //     console.log('Connected to server yes', socket);
    // };
    
    // socket.onclose = function (event) {
    //     console.log('Disconnected from server');
    // };

    // if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    //     console.log('WebSocket is already open or connecting');
    //     return;
    // }

    // if (ws) {
    //     ws.onclose = null; // Remove the onclose handler to avoid triggering it during close
    //     ws.close(); // Close the existing WebSocket connection if it exists
    // }

    ws = new WebSocket(`ws://localhost:3005/ws`);

    ws.onopen = () => {
        console.log('Connected to server');
    };

    // socket.onmessage = function (event) {
    //     const message = JSON.parse(event.data);
        
    // };

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

    // let message = {
    //     type: "",
    //     wKey: false,
    //     sKey: false,
    //     oKey: false,
    //     lKey: false,
    // }

    // let canvas = null;
    // let ctx = null;

    
    
    // contentDiv.innerHTML = `
    //         <canvas id="tutorial" class = "bg-black" width="600" height="400">salut</canvas>
    //         <button type="button" id="game-start" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">Start</button>
    //         <button type="button" id="game-home" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">Home</button>
    //         `;
        
    // canvas = document.getElementById("tutorial");
    // ctx = canvas.getContext("2d");
    
   

    // const socket = new WebSocket(`ws://localhost:3005/ws`);

    

    // socket.onopen = function (event) {
    //     // socket.send("C: Client openend connection");
    //     message.type = "front_game_draw";
    //     socket.send(JSON.stringify(message));
    // };
    
    // socket.onclose = function (event) {
    //     // console.log('C: Client closed connection');
    // };

    // socket.onmessage = function (event) {
    //     const data = JSON.parse(event.data);

    //     if (data.type === "back_game_position")
    //     {
    //         draw(data)
    //     }
    //     else if (data.type === "back_game_home")
    //     {
    //         displayHome();
    //     }
    //     else if (data.type === "back_game_draw")
    //     {
    //         draw(data)
    //     }
    //     // const test = JSON.parse(event.data);
        
    // };

    // document.getElementById("game-start").addEventListener("click", (e)=>{

    //     message.type = "front_game_start";
    //     socket.send(JSON.stringify(message));
    // })

    // document.getElementById("game-home").addEventListener("click", (e)=>{

    //     message.type = "front_game_home";
    //     socket.send(JSON.stringify(message));
    // })



    









    // document.addEventListener('keydown', (e) => 
    // {
    //     message.type = "front_game_key";
    //     if (e.key === 's')
    //         message.sKey = true;
    //     else if (e.key === 'w')
    //         message.wKey = true;
    //     else if (e.key === 'o')
    //         message.oKey = true;
    //     else if (e.key === 'l')
    //         message.lKey = true;
    //     socket.send(JSON.stringify(message));
    // });

    // document.addEventListener('keyup', (e) => 
    // {
    //     message.type = "front_game_key";
    //     if (e.key === 's')
    //         message.sKey = false;
    //     else if (e.key === 'w')
    //         message.wKey = false;
    //     else if (e.key === 'o')
    //         message.oKey = false;
    //     else if (e.key === 'l')
    //         message.lKey = false;
    //     socket.send(JSON.stringify(message));
    // });






    // function drawRect(x, y, w, h, color) {
    //     ctx.fillStyle = color;
    //     ctx.fillRect(x, y, w, h);
    // }
    
    // function drawCircle(x, y, radius, color) {
    //     ctx.fillStyle = color;
    //     ctx.beginPath();
    //     ctx.arc(x, y, radius, 0, Math.PI * 2);
    //     ctx.fill();
    // }
    
    // function drawText(text, x, y) {
    //     ctx.fillStyle = "white";
    //     ctx.font = "20px Arial";
    //     ctx.fillText(text, x, y);
    // }
    
    // function draw (message)
    // {
    //     ctx.clearRect(0,0,600,400)
    //     drawCircle(message.ball.x, message.ball.y, 10, "white")
    //     drawRect(10, message.paddles[0].y, 10, 80, "white")
    //     drawRect(canvas.width - 20, message.paddles[1].y, 10, 80, "white")
    //     drawText(message.scores.left, 100, 50)
    //     drawText(message.scores.right, canvas.width - 100, 50)
    // }
}



export default displayGame;