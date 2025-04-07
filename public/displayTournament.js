var contentDiv = document.getElementById('content');

class TournamentDisplay {
    constructor()
    {
        this.message = {
            id: "front-tournament",
            type: "",
        };
    }
  
    displayTournament(socket)
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
        <button type="button" id="tournament-next" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">Next round</button>
        <button type="button" id="tournament-home" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">home</button>
        `;

        this.sendNextRound(socket);
        this.sendPressHome(socket);
    }

    sendDrawTournament(socket)
    {
        this.message.type = "draw-tournament";
        socket.send(JSON.stringify(this.message));
    }

    sendNextRound(socket)
    {
        document.getElementById("tournament-next").addEventListener("click", (e)=>{

            this.message.type = "next-button";
            socket.send(JSON.stringify(this.message));
        })
    }

    sendPressHome(socket)
    {
        document.getElementById("tournament-home").addEventListener("click", (e)=>{

            this.message.type = "home-button";
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
  }

export {TournamentDisplay};