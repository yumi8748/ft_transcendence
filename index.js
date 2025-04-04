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
    
    connection.on("message", (message) =>
    {
        const data = JSON.parse(message);
        if (data.id === "front-game" && data.type === "draw-game")
        {
            broadcastState(players, game.gameState);
        }
        else if (data.id === "front-game" && data.type === "start-button")
        {
            game.gameState.gameStart = true;
            startSetInterval(); 
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
            

            if (tournament.tournamentData.round === 0)
            {
              if (game.gameState.scores.left === 2)
                tournament.tournamentData.results.push(tournament.tournamentData.brackets[0]);
              else
                tournament.tournamentData.results.push(tournament.tournamentData.brackets[1]);  
              
                tournament.tournamentData.results.push(tournament.playMatch(tournament.contestants[2], tournament.contestants[3]));
                tournament.tournamentData.results.push(tournament.playMatch(tournament.contestants[4], tournament.contestants[5]));
                tournament.tournamentData.results.push(tournament.playMatch(tournament.contestants[6], tournament.contestants[7]));
    
                tournament.tournamentData.brackets[8] = tournament.tournamentData.results[0];
                tournament.tournamentData.brackets[9] = tournament.tournamentData.results[1];
                tournament.tournamentData.brackets[10] = tournament.tournamentData.results[2];
                tournament.tournamentData.brackets[11] = tournament.tournamentData.results[3];
            }
            else if (tournament.tournamentData.round === 1)
            {
              if (game.gameState.scores.left === 2)
                tournament.tournamentData.results.push(tournament.tournamentData.brackets[8]);
              else
                tournament.tournamentData.results.push(tournament.tournamentData.brackets[9]);  
              
                tournament.tournamentData.results.push(tournament.playMatch(tournament.tournamentData.results[2], tournament.tournamentData.results[3]));
    
                tournament.tournamentData.brackets[12] = tournament.tournamentData.results[4];
                tournament.tournamentData.brackets[13] = tournament.tournamentData.results[5];
            }
            else if (tournament.tournamentData.round === 2)
            {
              if (game.gameState.scores.left === 2)
                tournament.tournamentData.results.push(tournament.tournamentData.brackets[12]);
              else
                tournament.tournamentData.results.push(tournament.tournamentData.brackets[13]);  

              tournament.tournamentData.brackets[14] = tournament.tournamentData.results[6];
              
            }

            tournament.tournamentData.round++;

            tournament.tournamentData.type = "display-tournament";
            game.gameState.scores.left = 0;
            game.gameState.scores.right = 0;
            game.gameState.gameOver = false;
            broadcastState(players, tournament.tournamentData);
        }  
        
        if (data.id === "front-tournament" && data.type === "draw-tournament")
        {
            tournament.tournamentData.type = "fill-players";
            broadcastState(players, tournament.tournamentData);
        }
        else if (data.id === "front-tournament" && data.type === "next-button")
        {
            tournament.tournamentData.type = "display-game";  
            // tournament.updateTournament();
            broadcastState(players, tournament.tournamentData);
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