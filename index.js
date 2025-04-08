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
let playerIndex = 0;
let contestants = ["Alice", "Bob", "Charlie", "Dave"];
const game = new Game();
const tournament = new Tournament();

fastify.register(async (fastify) => {
    fastify.get("/ws", { websocket: true }, (connection, req) => {
    
    connection.id = contestants[playerIndex];
    players.push(connection);
    playerIndex = players.length;
    connection.on("message", (message) =>
    {
        const data = JSON.parse(message);
        // Game part
        if (data.type === "front_game_draw")
            game.sendDrawGame(connection);
        else if (data.type === "front_game_start")
            game.sendStartGame(connection);
        else if (data.type === "front_game_key")
            game.updatePaddlePosition(data);
        else if (data.type === "front_game_home")
            game.sendHomeGame(connection);
        
        // Tournament part
        if (data.type === "front_tournamentTable_draw")
            tournament.sendDrawTournamentTable(players, connection);
        else if (data.type === "front_tournamentTable_next")
            tournament.sendNextTournamentTable(players);
        else if (data.type === "front_tournamentTable_home")
            tournament.sendHomeTournamentTable(players);
        else if (data.type === "front_tournamentGame_start")
            tournament.sendStartTournamentGame(players);
        else if (data.type === "front_tournamentGame_key")
            tournament.updatePaddlePosition(data);
        else if (data.type === "front_tournamentGame_next")
            tournament.sendNextTournamentGame(players);
       
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