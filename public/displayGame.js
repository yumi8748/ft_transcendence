import displayHome from "./displayHome.js";

var contentDiv = document.getElementById('content');

function displayGame()
{
    let message = {
        type: "",
        wKey: false,
        sKey: false,
        oKey: false,
        lKey: false,
    }

    let canvas = null;
    let ctx = null;

    
    
    contentDiv.innerHTML = `
            <canvas id="tutorial" class = "bg-black" width="600" height="400">salut</canvas>
            <button type="button" id="game-start" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">Start</button>
            <button type="button" id="game-home" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">Home</button>
            `;
        
    canvas = document.getElementById("tutorial");
    ctx = canvas.getContext("2d");
    
   

    const socket = new WebSocket(`ws://localhost:3005/ws`);

    

    socket.onopen = function (event) {
        // socket.send("C: Client openend connection");
        message.type = "front_game_draw";
        socket.send(JSON.stringify(message));
    };
    
    socket.onclose = function (event) {
        // console.log('C: Client closed connection');
    };

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);

        if (data.type === "back_game_position")
        {
            draw(data)
        }
        else if (data.type === "back_game_home")
        {
            displayHome();
        }
        else if (data.type === "back_game_draw")
        {
            draw(data)
        }
        // const test = JSON.parse(event.data);
        
    };

    document.getElementById("game-start").addEventListener("click", (e)=>{

        message.type = "front_game_start";
        socket.send(JSON.stringify(message));
    })

    document.getElementById("game-home").addEventListener("click", (e)=>{

        message.type = "front_game_home";
        socket.send(JSON.stringify(message));
    })



    









    document.addEventListener('keydown', (e) => 
    {
        message.type = "front_game_key";
        if (e.key === 's')
            message.sKey = true;
        else if (e.key === 'w')
            message.wKey = true;
        else if (e.key === 'o')
            message.oKey = true;
        else if (e.key === 'l')
            message.lKey = true;
        socket.send(JSON.stringify(message));
    });

    document.addEventListener('keyup', (e) => 
    {
        message.type = "front_game_key";
        if (e.key === 's')
            message.sKey = false;
        else if (e.key === 'w')
            message.wKey = false;
        else if (e.key === 'o')
            message.oKey = false;
        else if (e.key === 'l')
            message.lKey = false;
        socket.send(JSON.stringify(message));
    });






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
    
    function draw (message)
    {
        ctx.clearRect(0,0,600,400)
        drawCircle(message.ball.x, message.ball.y, 10, "white")
        drawRect(10, message.paddles[0].y, 10, 80, "white")
        drawRect(canvas.width - 20, message.paddles[1].y, 10, 80, "white")
        drawText(message.scores.left, 100, 50)
        drawText(message.scores.right, canvas.width - 100, 50)
    }
}



export default displayGame;