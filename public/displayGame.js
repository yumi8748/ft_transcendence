var contentDiv = document.getElementById('content');

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

export {GameDisplay};

// displayGame(socket, message)
// {
//     contentDiv.innerHTML = `
//         <canvas id="tutorial" class = "bg-black" width="600" height="400">salut</canvas>
//         <button type="button" id="game-start" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">start</button>
//         `;
    
//     if (message === "back_game_drawGame")
//     {
//         contentDiv.innerHTML+= `<button type="button" id="game-home" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">home</button>`
//         this.sendPressHome(socket);
//     }
//     else if (location.pathname === "/tournament")
//     {
//         contentDiv.innerHTML+= `<button type="button" id="game-next" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">next</button>`
//         this.sendPressNext(socket)
//     }

//     this.canvas = document.getElementById("tutorial");
//     this.ctx = this.canvas.getContext("2d");
//     this.sendKeydown(socket);
//     this.sendKeyup(socket);
//     this.sendPressStart(socket)
// }

// sendPressNext(socket)
// {
//     document.getElementById("game-next").addEventListener("click", (e)=>{

//         this.message.type = "front-game-next-button";
//         socket.send(JSON.stringify(this.message));
//     })
// }