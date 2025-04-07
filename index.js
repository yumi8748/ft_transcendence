import Fastify from 'fastify'

const fastify = Fastify({logger: true})
import fastifyStatic from '@fastify/static'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyWebsocket from '@fastify/websocket';

import { Tournament } from './manageTournament.js';
import { Game } from './manageGame.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
})

// fastify.get('/', function (req, reply) {
  // reply.sendFile('index.html')
// })

fastify.setNotFoundHandler((req, reply) => {
  reply.sendFile('index.html');
});

fastify.register(fastifyWebsocket)

let players = [];
const game = new Game();
const tournament = new Tournament();

fastify.register(async (fastify) => {
    fastify.get("/ws", { websocket: true }, (connection, req) => {
    
    players.push(connection);
    const playerIndex = players.length;
    
    connection.on("message", (message) =>
    {
        const data = JSON.parse(message);
        if (data.id === "front-game" && data.type === "draw-game")
           game.sendDrawMessage(players);
        else if (data.id === "front-game" && data.type === "start-button")
            game.sendStartMessage(players);
        else if (data.id === "front-game" && data.type === "key")
            game.updatePaddlePosition(data);
        else if (data.id === "front-game" && data.type === "home-button")
            game.sendHomeMessage(players);
        else if (data.id === "front-game" && data.type === "next-button")
            game.sendNextMessage(players, tournament);
        else if (data.id === "front-tournament" && data.type === "draw-tournament")
            tournament.sendDrawMessage(players);
        else if (data.id === "front-tournament" && data.type === "next-button")
            tournament.sendNextMessage(players);
        else if (data.id === "front-tournament" && data.type === "home-button")
            tournament.sendHomeMessage(players);
    });

    connection.on('close', () =>
    {
        players.splice(playerIndex, 1)
    });
  })
})

function broadcastState(players, message)
{
    players.forEach(player => player.send(JSON.stringify(message)));
}

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0'})
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

export {broadcastState} ;