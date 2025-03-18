var contentDiv = document.getElementById('content');

function displayTournament(socket)
{
    let keyboard = {
        route: "tournament",
        click: 0
    }
    
    contentDiv.innerHTML = `
    <div class = "bracket flex flex-row  gap-10 bg-blue-500 p-2 ">
        <p class="header basis-32 text-white p-2">Quarter final</p>
        <p class="header basis-32 text-white p-2">Semi final</p>
        <p class="header basis-32 text-white p-2">Final</p>
        <p class="header basis-32 text-white p-2">Winner</p>
    </div>

    <div class = "bracket flex flex-row  gap-10 bg-blue-500 p-2 ">

        <div id = "quarterfinal" class="round basis-32 flex flex-col gap-4 justify-center"> 
            <div class="match  bg-white pt-2 pb-2 border-solid rounded-md border-2 border-neutral-200"> 
                <div class="player pl-2"> Player 1</div>
                <div class="player pl-2"> Player 2</div>
            </div>

            <div class="match  bg-white pt-2 pb-2 border-solid rounded-md border-2 border-neutral-200"> 
                <div class="player pl-2"> Player 1</div>
                <div class="player pl-2"> Player 2</div>
            </div>

            <div class="match  bg-white pt-2 pb-2 border-solid rounded-md border-2 border-neutral-200"> 
                <div class="player pl-2"> Player 1</div>
                <div class="player pl-2"> Player 2</div>
            </div>

            <div class="match  bg-white pt-2 pb-2 border-solid rounded-md border-2 border-neutral-200"> 
                <div class="player pl-2"> Player 1</div>
                <div class="player pl-2"> Player 2</div>
            </div>
        </div>

        <div id = "semifinal" class=" basis-32 round flex flex-col gap-4 justify-center">
            <div class="match bg-white  pt-2 pb-2 border-solid rounded-md border-2 border-neutral-200"> 
                <div class="player pl-2"> Player 1</div>
                <div class="player pl-2"> Player 2</div>
            </div>

            <div class="match  bg-white pt-2 pb-2 border-solid rounded-md border-2 border-neutral-200"> 
                <div class="player pl-2"> Player 1</div>
                <div class="player pl-2"> Player 2</div>
            </div>
        </div>

        <div id = "final" class="basis-32 round flex flex-col gap-4 justify-center">
            <div class="match bg-white  pt-2 pb-2 border-solid rounded-md border-2 border-neutral-200 "> 
                <div class="player pl-2"> Player 1</div>
                <div class="player pl-2"> Player 2</div>
            </div>
        </div>

        <div id = "winner" class="basis-32 round flex flex-col gap-4 justify-center">
            <div class="match bg-white  pt-2 pb-2 border-solid rounded-md border-2 border-neutral-200 "> 
                <div class="player pl-2"> Player 1</div>
            </div>
        </div>
        
    </div>
    <button type="button" id="tournament-next" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">Next round</button>
    `;

    const divs = document.querySelectorAll('.player');

    sendRoute(socket, keyboard);
    sendNextRound(socket, keyboard);
    // const socket = new WebSocket(`ws://${location.host}/ws`);

    socket.onopen = function (event) {
        // socket.send("C: Client openend connection");
    };
    
    socket.onclose = function (event) {
        // console.log('C: Client closed connection');
    };

    socket.onmessage = function (event) {
        const test = JSON.parse(event.data);
        console.log(test)
        divs.forEach((div, index) =>
        {
            div.textContent = test.tournament[index]
        })
    };
}

function sendRoute(socket, keyboard)
{
    socket.send(JSON.stringify(keyboard));
}

function sendNextRound(socket, keyboard)
{
    document.getElementById("tournament-next").addEventListener("click", (e)=>{

        keyboard.click = 1;
        socket.send(JSON.stringify(keyboard));
    })
}

export default displayTournament;