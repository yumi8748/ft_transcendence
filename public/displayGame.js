var contentDiv = document.getElementById('content');

function displayGame(socket)
{
    let message = {
        route: "game",
        type: "",
        wKey: false,
        sKey: false,
        oKey: false,
        lKey: false
    }
 


    contentDiv.innerHTML = `
    <h2>Game Page!</h2>
    <canvas id="tutorial" class = "bg-black" width="600" height="400">salut</canvas>
     <button type="button" id="game-start" class="ml-2 rounded-md p-2 mt-6 text-white bg-blue-500">start</button>
    `;
    const canvas = document.getElementById("tutorial");
    const ctx = canvas.getContext("2d");

    socket.onopen = function (event) {
        // socket.send("C: Client openend connection");
    };
    
    socket.onclose = function (event) {
        // console.log('C: Client closed connection');
    };

    socket.onmessage = function (event) {
        const test = JSON.parse(event.data);
        // console.log(test);
        draw(test, ctx, canvas)
    };

    sendRoute(socket, message);
    sendKeydown(socket, message);
    sendKeyup(socket, message);
    sendPressStart(socket, message)
    
}

function sendRoute(socket, message)
{
    message.type = "route";
    socket.send(JSON.stringify(message));
}

function sendPressStart(socket, message)
{
    document.getElementById("game-start").addEventListener("click", (e)=>{

        message.type = "start";
        socket.send(JSON.stringify(message));
    })
}

function sendKeydown(socket, message)
{
    document.addEventListener('keydown', (e) => 
    {
        message.type = "key";
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
}

function sendKeyup(socket, message)
{
    document.addEventListener('keyup', (e) => 
    {
        message.type = "key";
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
}

function drawRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawText(ctx, text, x, y) {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(text, x, y);
}

function draw (message, ctx, canvas)
{
    ctx.clearRect(0,0,600,400)
    drawCircle(ctx, message.ball.x, message.ball.y, 10, "white")
    drawRect(ctx, 10, message.paddles[0].y, 10, 80, "white")
    drawRect(ctx, canvas.width - 20, message.paddles[1].y, 10, 80, "white")
    drawText(ctx, message.scores.left, 100, 50)
    drawText(ctx, message.scores.right, canvas.width - 100, 50)
}

export default displayGame;