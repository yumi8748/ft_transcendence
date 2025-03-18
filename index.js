import Fastify from 'fastify'

const fastify = Fastify({logger: true})
import fastifyStatic from '@fastify/static'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyWebsocket from '@fastify/websocket';

import {updateGame, broadcastState}   from './game.js';
import { Tournament } from './tournament.js';

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
// leave 10 pixels of space between the paddle and the edge of the screen
let gameState = {
  type: "update",
  paddles: [ { y: 10, playerID: 0, side: "left" }, { y: 10, playerID: 0, side: "right" } ],
  ball: { x: 300, y: 200, vx: 4, vy: 4 },
  scores: {left: 0, right: 0},
  gameStart : false
};

let round = 0;
const contestants = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank", "Grace", "Hank"];
let tournamentData = {
  tournament: ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank", "Grace", "Hank", "-","-","-", "-", "-", "-","-"],
};

setInterval(() => updateGame(gameState, players), 30);

fastify.register(async (fastify) => {
    fastify.get("/ws", { websocket: true }, (connection, req) => {
    
    const playerIndex = players.length;
    players.push(connection);
    
    connection.on("message", (message) =>
    {
        const data = JSON.parse(message);
        const tournament = new Tournament(contestants);
        console.log(data)
        if (data.route === "game")
          broadcastState(players, gameState);
        if (data.route === "tournament" && data.click === 0)
        {
          broadcastState(players, tournamentData);
        }
        if (data.route === "tournament" && data.click === 1)
        {
          tournament.generateMatches();
          if (round === 0)
          {
            tournamentData.tournament[8] = contestants[0];
            tournamentData.tournament[9] = contestants[1];
            tournamentData.tournament[10] = contestants[2];
            tournamentData.tournament[11] = contestants[3];
          }
          else if (round === 1)
          {
            tournamentData.tournament[12] = contestants[0];
            tournamentData.tournament[13] = contestants[1];
          }
          else if (round === 2)
          {
            tournamentData.tournament[14] = contestants[0];
          }
          round++;
          console.log(tournamentData)
          connection.send(JSON.stringify(tournamentData));
        }
        if (data.start === true)
          gameState.gameStart = true;
        if (data.sKey === true && gameState.paddles[0].y < 310)
          gameState.paddles[0].y += 10;
        if (data.wKey === true && gameState.paddles[0].y > 10)
          gameState.paddles[0].y -= 10;
        if (data.lKey === true && gameState.paddles[1].y < 310)
          gameState.paddles[1].y += 10;
        if (data.oKey === true && gameState.paddles[1].y > 10)
          gameState.paddles[1].y -= 10;
    });

    connection.on('close', () =>
    {
      players.splice(playerIndex, 1)
    });
  })
})



try {
  await fastify.listen({ port: 3000, host: '0.0.0.0'})
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}