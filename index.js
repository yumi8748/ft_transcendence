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
    
    const playerIndex = players.length;
    players.push(connection);
    
    connection.on("message", (message) =>
    {
        const data = JSON.parse(message);
        if (data.id === "front-game" && data.type === "draw-game")
        {
          game.gameState.type = "draw-game";
          broadcastState(players, game.gameState);
        }
        else if (data.id === "front-game" && data.type === "start-button")
        {
          game.gameState.type = "game-update";
          game.gameState.gameStart = true;
          game.startSetInterval(players); 
        }
        else if (data.id === "front-game" && data.type === "home-button")
        {
          game.gameState.scores.left = 0;
          game.gameState.scores.right = 0;
          game.gameState.gameStart = false;
          game.gameState.type = "home";
          broadcastState(players, game.gameState);
        }
        else if (data.id === "front-game" && data.type === "key")
        {
            if (data.sKey === true && game.gameState.paddles[0].y < 310)
                game.gameState.paddles[0].y += 10;
            if (data.wKey === true && game.gameState.paddles[0].y > 10)
                game.gameState.paddles[0].y -= 10;
            if (data.lKey === true && game.gameState.paddles[1].y < 310)
                game.gameState.paddles[1].y += 10;
            if (data.oKey === true && game.gameState.paddles[1].y > 10)
                game.gameState.paddles[1].y -= 10;
        }
        else if (data.id === "front-game" && data.type === "next-button")
        {
          if (game.gameState.scores.right === 2)
          {
              if (tournament.tournamentData.round === 0)
              {
                  tournament.updateResults("right");
                  tournament.updateResults("right");
                  tournament.updateResults("right");
              }
              else if (tournament.tournamentData.round === 1)
              {
                  tournament.updateResults("right");
                  tournament.updateResults("right");
              }
              else if (tournament.tournamentData.round === 2)
              {
                  tournament.updateResults("right");
              }
              tournament.tournamentData.round = 3;
          }
          else if (game.gameState.scores.left === 2)
          {
              if (tournament.tournamentData.round <= 2)
              {
                  tournament.updateResults("left");
              }
          }  
          tournament.tournamentData.type = "draw-tournament";
          game.gameState.scores.left = 0;
          game.gameState.scores.right = 0;
          game.gameState.gameStart = false;
          broadcastState(players, tournament.tournamentData);
        }  
        
        if (data.id === "front-tournament" && data.type === "draw-tournament")
        {
            if (tournament.tournamentData.round === 0)
            {
                tournament.initializeTournament();
            }
            tournament.tournamentData.type = "draw-tournament";
            broadcastState(players, tournament.tournamentData);
        }
        else if (data.id === "front-tournament" && data.type === "next-button")
        {
            if (tournament.tournamentData.round <= 2)
            {
                tournament.tournamentData.type = "draw-game";  
                broadcastState(players, tournament.tournamentData);
            }
        }
        else if (data.id === "front-tournament" && data.type === "home-button")
        {
            // tournament.tournamentData.type = "display-game";  
            // tournament.updateTournament();
            tournament.tournamentData.type = "home";
            tournament.tournamentData.brackets = []
            tournament.tournamentData.quarter = []
            tournament.tournamentData.semi = []
            tournament.tournamentData.final = []
            tournament.tournamentData.winner = [];
            tournament.tournamentData.round = 0;
          broadcastState(players, tournament.tournamentData);

          tournament.tournamentData.type = "";
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

export {broadcastState} ;