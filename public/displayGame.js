var contentDiv = document.getElementById('content');

class GameDisplay {
    constructor()
    {
        this.canvas = null;
        this.ctx = null;
        this.message = {
            id: "front-game",
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
        <button type="button" id="game-start" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">start</button>
        <button type="button" id="game-next" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">next</button>
        `;
        this.canvas = document.getElementById("tutorial");
        this.ctx = this.canvas.getContext("2d");
        this.sendGameDisplay(socket);
        this.sendKeydown(socket);
        this.sendKeyup(socket);
        this.sendPressStart(socket)
        this.sendPressNext(socket)
        
    }

    sendGameDisplay(socket)
    {
        this.message.type = "draw-game";
        console.log(this.message)
        socket.send(JSON.stringify(this.message));
    }

    
    
    sendPressStart(socket)
    {
        document.getElementById("game-start").addEventListener("click", (e)=>{

            this.message.type = "start-button";
            socket.send(JSON.stringify(this.message));
        })
    }

    sendPressNext(socket)
    {
        document.getElementById("game-next").addEventListener("click", (e)=>{

            this.message.type = "next-button";
            socket.send(JSON.stringify(this.message));
        })
    }

    sendKeydown(socket)
    {
        document.addEventListener('keydown', (e) => 
        {
            this.message.type = "key";
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

    sendKeyup(socket)
    {
        document.addEventListener('keyup', (e) => 
        {
            this.message.type = "key";
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

    handleGameMess(data)
    {
        this.draw(data, this.ctx, this.canvas);
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

    draw (message, ctx, canvas)
    {
        ctx.clearRect(0,0,600,400)
        this.drawCircle(ctx, message.ball.x, message.ball.y, 10, "white")
        this.drawRect(ctx, 10, message.paddles[0].y, 10, 80, "white")
        this.drawRect(ctx, canvas.width - 20, message.paddles[1].y, 10, 80, "white")
        this.drawText(ctx, message.scores.left, 100, 50)
        this.drawText(ctx, message.scores.right, canvas.width - 100, 50)
    }

  }

export {GameDisplay};
