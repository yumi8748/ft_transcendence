import displayHome from "./displayHome.js";

var contentDiv = document.getElementById('content');
let ws;

class GameDisplay {
    constructor()
    {
        this.canvas = null;
        this.ctx = null;
        this.message = {
            type: "",
            wKey: false,
            sKey: false,
            oKey: false,
            lKey: false
        };
    }
  
    displayGame(socket)
    {
        contentDiv.innerHTML = `
            <canvas id="tutorial" class = "bg-black" width="600" height="400">salut</canvas>
            <button type="button" id="game-start" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">Start</button>
            <button type="button" id="game-home" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">Home</button>
            `;
        
        this.canvas = document.getElementById("tutorial");
        this.ctx = this.canvas.getContext("2d");
        this.sendPressHomeGame(socket);
        this.sendKeydownGame(socket);
        this.sendKeyupGame(socket);
        this.sendPressStartGame(socket)
    }

    sendDrawGame(socket)
    {
        this.message.type = "front_game_draw";
        socket.send(JSON.stringify(this.message));
    }

    sendPressStartGame(socket)
    {
        document.getElementById("game-start").addEventListener("click", (e)=>{

            this.message.type = "front_game_start";
            socket.send(JSON.stringify(this.message));
        })
    }

    sendPressHomeGame(socket)
    {
        document.getElementById("game-home").addEventListener("click", (e)=>{

            this.message.type = "front_game_home";
            socket.send(JSON.stringify(this.message));
        })
    }

    sendKeydownGame(socket)
    {
        document.addEventListener('keydown', (e) => 
        {
            this.message.type = "front_game_key";
            if (e.key === 's')
                this.message.sKey = true;
            else if (e.key === 'w')
                this.message.wKey = true;
            else if (e.key === 'o')
                this.message.oKey = true;
            else if (e.key === 'l')
                this.message.lKey = true;
            socket.send(JSON.stringify(this.message));
        });
    }

    sendKeyupGame(socket)
    {
        document.addEventListener('keyup', (e) => 
        {
            this.message.type = "front_game_key";
            if (e.key === 's')
                this.message.sKey = false;
            else if (e.key === 'w')
                this.message.wKey = false;
            else if (e.key === 'o')
                this.message.oKey = false;
            else if (e.key === 'l')
                this.message.lKey = false;
            socket.send(JSON.stringify(this.message));
        });
    }

    drawRect(ctx, x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }

    drawCircle(ctx, x, y, radius, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    drawText(ctx, text, x, y) {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(text, x, y);
    }

    draw (message)
    {
        this.ctx.clearRect(0,0,600,400)
        this.drawCircle(this.ctx, message.ball.x, message.ball.y, 10, "white")
        this.drawRect(this.ctx, 10, message.paddles[0].y, 10, 80, "white")
        this.drawRect(this.ctx, this.canvas.width - 20, message.paddles[1].y, 10, 80, "white")
        this.drawText(this.ctx, message.scores.left, 100, 50)
        this.drawText(this.ctx, message.scores.right, this.canvas.width - 100, 50)
    }

}


function displayGame()
{
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        console.log('WebSocket is already open or connecting');
        // return;
    }

    // if (ws) {
        // ws.onclose = null; // Remove the onclose handler to avoid triggering it during close
        // ws.close(); // Close the existing WebSocket connection if it exists
    // }

    ws = new WebSocket(`ws://${location.host}/ws`);
    
    const gameDisplay = new GameDisplay();

    ws.onopen = () => {
        console.log('Connected to server');
        gameDisplay.sendDrawGame(ws);
    };
 
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === "back_game_position")
        {
            gameDisplay.draw(data);
        }
        else if (data.type === "back_game_home")
        {
            displayHome(ws);
        }
        else if (data.type === "back_game_draw")
        {
            gameDisplay.displayGame(ws);
            gameDisplay.draw(data);
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