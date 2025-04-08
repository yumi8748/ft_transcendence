var contentDiv = document.getElementById('content');

class TournamentDisplay {
    constructor()
    {
        this.message = {
            type: "",
        };
    }
  
    displayTournamentTable(socket)
    {
        contentDiv.innerHTML = `
        <div class = "bracket flex flex-row  gap-10 bg-blue-500 p-2 ">
            <p class="header basis-32 text-white p-2">Semi final</p>
            <p class="header basis-32 text-white p-2">Final</p>
            <p class="header basis-32 text-white p-2">Winner</p>
        </div>

        <div class = "bracket flex flex-row  gap-10 bg-blue-500 p-2 ">

            <div id = "semifinal" class=" basis-32 round flex flex-col gap-4 justify-center">
                <div class="match bg-white  pt-2 pb-2 border-solid rounded-md border-2 border-neutral-200"> 
                    <div class="player pl-2"> - </div>
                    <div class="player pl-2"> - </div>
                </div>

                <div class="match  bg-white pt-2 pb-2 border-solid rounded-md border-2 border-neutral-200"> 
                    <div class="player pl-2"> - </div>
                    <div class="player pl-2"> - </div>
                </div>
            </div>

            <div id = "final" class="basis-32 round flex flex-col gap-4 justify-center">
                <div class="match bg-white  pt-2 pb-2 border-solid rounded-md border-2 border-neutral-200 "> 
                    <div class="player pl-2"> - </div>
                    <div class="player pl-2"> - </div>
                </div>
            </div>

            <div id = "winner" class="basis-32 round flex flex-col gap-4 justify-center">
                <div class="match bg-white  pt-2 pb-2 border-solid rounded-md border-2 border-neutral-200 "> 
                    <div class="player pl-2"> - </div>
                </div>
            </div>
            
        </div>
        <button type="button" id="tournament-next" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">Next</button>
        <button type="button" id="tournament-home" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">Home</button>
        `;

        this.sendPressNextTournamentTable(socket);
        this.sendPressHomeTournamentTable(socket);
    }

    displayTournamentGame(socket)
    {
        contentDiv.innerHTML = `
            <canvas id="tutorial" class = "bg-black" width="600" height="400">salut</canvas>
            <button type="button" id="game-start" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">Start</button>
            <button type="button" id="game-next" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">Next</button>
            `;
        
        this.canvas = document.getElementById("tutorial");
        this.ctx = this.canvas.getContext("2d");
        this.sendPressNextTournamentGame(socket)
        this.sendKeydownTournamentGame(socket);
        this.sendKeyupTournamentGame(socket);
        this.sendPressStartTournamentGame(socket)
    }

    sendDrawTournamentTable(socket)
    {
        this.message.type = "front_tournamentTable_draw";
        socket.send(JSON.stringify(this.message));
    }

    sendPressNextTournamentTable(socket)
    {
        document.getElementById("tournament-next").addEventListener("click", (e)=>{

            this.message.type = "front_tournamentTable_next";
            socket.send(JSON.stringify(this.message));
        })
    }

    sendPressHomeTournamentTable(socket)
    {
        document.getElementById("tournament-home").addEventListener("click", (e)=>{

            this.message.type = "front_tournamentTable_home";
            socket.send(JSON.stringify(this.message));
        })
    }

    displayPlayers(data)
    {
        const divs = document.querySelectorAll('.player');
        let i = 0;
        divs.forEach((div, index) =>
        {
            if (i < data.brackets.length)
                div.textContent = data.brackets[index]
            i++;
        })
    }



    sendPressStartTournamentGame(socket)
    {
        document.getElementById("game-start").addEventListener("click", (e)=>{

            this.message.type = "front_tournamentGame_start";
            socket.send(JSON.stringify(this.message));
        })
    }

    sendKeydownTournamentGame(socket)
    {
        document.addEventListener('keydown', (e) => 
        {
            this.message.type = "front_tournamentGame_key";
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

    sendKeyupTournamentGame(socket)
    {
        document.addEventListener('keyup', (e) => 
        {
            this.message.type = "front_tournamentGame_key";
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

    sendPressNextTournamentGame(socket)
    {
        document.getElementById("game-next").addEventListener("click", (e)=>{

            this.message.type = "front_tournamentGame_next";
            socket.send(JSON.stringify(this.message));
        })
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

export {TournamentDisplay};