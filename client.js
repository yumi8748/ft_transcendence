function changeContent(page) {
	var contentDiv = document.getElementById('content');
    if (page === 'home')
        contentDiv.innerHTML = `<h2>Welcome to the Home Page!</h2>`;
    else if (page === 'game')
    {
        const socket = new WebSocket('ws://localhost:8080');
        
        socket.onopen = function (event) {
            // socket.send("C: Client openend connection");
        };

        socket.onclose = function (event) {
            console.log('C: Client closed connection');
        };

        const message = {
            type: "",
        };
        contentDiv.innerHTML = `<h2>Game Page!</h2><canvas id="tutorial" width="1000" height="1000">salut</canvas>`;
        const canvas = document.getElementById("tutorial");
        const ctx = canvas.getContext("2d");

        socket.onmessage = function (event) {

            const test = JSON.parse(event.data);
            // drawPlayer(test.x, test.y)
            ctx.fillStyle = "rgb(200 0 0)";
            ctx.fillRect(test.x, test.y, 50, 50);
        
        };

        document.addEventListener('keydown', (e) => 
        {
            ctx.clearRect(0,0,1000,1000)
            if (e.key == 's')
                message.type = "s"
            else if (e.key == 'w')
                message.type = "w"
            else if (e.key == 'a')
                message.type = "a"
            else if (e.key == 'd')
                message.type = "d"
            socket.send(JSON.stringify(message));
        });
    }
    else if (page === 'tournament')
        contentDiv.innerHTML = `<h2>tournament page</h2>`;
    else if (page === 'authentification')
        contentDiv.innerHTML = `<h2>authentification page</h2>`;
	else
		contentDiv.innerHTML = '<h2>Page not found!</h2>';
}
