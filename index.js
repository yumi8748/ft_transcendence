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
const gameData = {
  player1_id: 1,
  player2_id: 2,
  player1_score: 0,
  player2_score: 0,
  game_start_time: null,
  game_end_time: null
};

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
})

fastify.setNotFoundHandler((req, reply) => {
  reply.sendFile('index.html');
});

fastify.register(fastifyWebsocket)

let players = [];
const game = new Game();

let intervalId;

function startSetInterval()
{
  intervalId = setInterval(() => 
  {
    game.updateGame();
    broadcastState(players, game.gameState);
  }, 30);
}

function stopSetInterval()
{
  clearInterval(intervalId);
  intervalId = null;
}

const tournament = new Tournament();

fastify.register(async (fastify) => {
    fastify.get("/ws", { websocket: true }, (connection, req) => {
    
    const playerIndex = players.length;
    players.push(connection);

    connection.send(JSON.stringify({ type: "playerID", playerID: playerIndex }));
    connection.send(JSON.stringify(gameState));
    
    connection.on("message", (message) =>
    {
        const data = JSON.parse(message);
        console.log(data)
        if (data.route === "game")
        {
          game.handleGameMessage(data, players);
        }
        if (data.route === "tournament")
        {
            tournament.handleTournamentMessage(data,players);
        }
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

export {broadcastState, startSetInterval, stopSetInterval} ;