const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
const player = {x:10, y:10};

server.on('connection', function connection(client)
{
    client.send(JSON.stringify(player));
    client.on('message', function incoming(data)
    {
        const message = JSON.parse(data);
        if (message.type === 's')
            player.y += 2;
        else if (message.type === 'w')
            player.y -= 2;
        else if (message.type === 'a')
            player.x -= 2;
        else if (message.type === 'd')
            player.x += 2;
        client.send(JSON.stringify(player));
    });

    client.on('close', function ()
    {
        console.log('S: Client closed connection');
    });
});