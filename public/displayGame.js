var contentDiv = document.getElementById('content');

function displayGame()
{
    let message = {
        wKey: false,
        sKey: false,
        oKey: false,
        lKey: false,
    }


    
    contentDiv.innerHTML = `<h2>Game Page!</h2><canvas id="tutorial" class = "bg-black" width="600" height="400">salut</canvas>`;
    const canvas = document.getElementById("tutorial");
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

    function draw (message)
    {
        ctx.clearRect(0,0,600,400)
        drawCircle(message.ball.x, message.ball.y, 10, "white")
        drawRect(10, message.paddles[0].y, 10, 80, "white")
        drawRect(canvas.width - 20, message.paddles[1].y, 10, 80, "white")
        drawText(message.scores.left, 100, 50)
        drawText(message.scores.right, canvas.width - 100, 50)
    }

    const socket = new WebSocket(`ws://localhost:3005/ws`);

    socket.onopen = function (event) {
        // socket.send("C: Client openend connection");
    };
    
    socket.onclose = function (event) {
        // console.log('C: Client closed connection');
    };

    socket.onmessage = function (event) {
        const test = JSON.parse(event.data);
        draw(test)
    };

    document.addEventListener('keydown', (e) => 
    {
        if (e.key === 's')
            keyboard.sKey = true;
        else if (e.key === 'w')
            keyboard.wKey = true;
        else if (e.key === 'o')
            keyboard.oKey = true;
        else if (e.key === 'l')
            keyboard.lKey = true;
        socket.send(JSON.stringify(keyboard));
    });

    document.addEventListener('keyup', (e) => 
    {
        if (e.key === 's')
            keyboard.sKey = false;
        else if (e.key === 'w')
            keyboard.wKey = false;
        else if (e.key === 'o')
            keyboard.oKey = false;
        else if (e.key === 'l')
            keyboard.lKey = false;
        socket.send(JSON.stringify(keyboard));
    });
}

export default displayGame;