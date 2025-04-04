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

function getRandomUniqueElement(array) {
  const index = Math.floor(Math.random() * array.length);
  return array.splice(index, 1)[0]; // remove and return the element
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
        else if (data.id === "front-game" && data.type === "home-button")
        {
          game.gameState.scores.left = 0;
          game.gameState.scores.right = 0;
          game.gameState.gameStart = false;
          game.gameState.home = true;
          broadcastState(players, game.gameState);
          game.gameState.home = false;
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
                  for (let i = 0; i < tournament.tournamentData.quarter.length; i += 2)
                  {
                      if (i + 1 < tournament.tournamentData.quarter.length)
                      {
                          if (tournament.tournamentData.quarter[i] === "Player 1" || tournament.tournamentData.quarter[i + 1] === "Player 1")
                          {
                                  if (tournament.tournamentData.quarter[i] === "Player 1")
                                      tournament.tournamentData.semi.push(tournament.tournamentData.quarter[i + 1]);
                                  else
                                      tournament.tournamentData.semi.push(tournament.tournamentData.quarter[i]);
                          }
                          else
                          {
                              let winner = tournament.playMatch(tournament.tournamentData.quarter[i], tournament.tournamentData.quarter[i + 1]);
                              tournament.tournamentData.semi.push(winner);
                          }
                      } 
                  }
    
                  for (let i = 0; i < tournament.tournamentData.semi.length; i++)
                  {
                    tournament.tournamentData.brackets.push(tournament.tournamentData.semi[i]);
                  }
                  


                  for (let i = 0; i < tournament.tournamentData.semi.length; i += 2)
                  {
                      if (i + 1 < tournament.tournamentData.semi.length)
                      {
                          let winner = tournament.playMatch(tournament.tournamentData.semi[i], tournament.tournamentData.semi[i + 1]);
                          tournament.tournamentData.final.push(winner);
                      } 
                  }
      
                  for (let i = 0; i < tournament.tournamentData.final.length; i++)
                  {
                    tournament.tournamentData.brackets.push(tournament.tournamentData.final[i]);
                  }

                  let winner = tournament.playMatch(tournament.tournamentData.final[0], tournament.tournamentData.final[1]);
                  tournament.tournamentData.winner.push(winner);

                  tournament.tournamentData.brackets.push(tournament.tournamentData.winner[0]);


              }
              else if (tournament.tournamentData.round === 1)
              {
                for (let i = 0; i < tournament.tournamentData.semi.length; i += 2)
                {
                    if (i + 1 < tournament.tournamentData.semi.length)
                    {
                        if (tournament.tournamentData.semi[i] === "Player 1" || tournament.tournamentData.semi[i + 1] === "Player 1")
                        {
                                if (tournament.tournamentData.semi[i] === "Player 1")
                                    tournament.tournamentData.final.push(tournament.tournamentData.semi[i + 1]);
                                else
                                    tournament.tournamentData.final.push(tournament.tournamentData.semi[i]);
                        }
                        else
                        {
                            let winner = tournament.playMatch(tournament.tournamentData.semi[i], tournament.tournamentData.semi[i + 1]);
                            tournament.tournamentData.final.push(winner);
                        }
                    } 
                }
  
                for (let i = 0; i < tournament.tournamentData.final.length; i++)
                {
                  tournament.tournamentData.brackets.push(tournament.tournamentData.final[i]);
                }

                  let winner = tournament.playMatch(tournament.tournamentData.final[0], tournament.tournamentData.final[1]);
                  tournament.tournamentData.winner.push(winner);

                  tournament.tournamentData.brackets.push(tournament.tournamentData.winner[0]);
              }
              else if (tournament.tournamentData.round === 2)
              {
                  if (tournament.tournamentData.final[0] === "Player 1")
                      tournament.tournamentData.winner.push(tournament.tournamentData.final[1]);
                  else
                      tournament.tournamentData.winner.push(tournament.tournamentData.final[0]);
                  tournament.tournamentData.brackets.push(tournament.tournamentData.winner[0]);
              }

              tournament.tournamentData.round = 3;
          }
          else if (game.gameState.scores.left === 2)
          {
            if (tournament.tournamentData.round === 0)
              {
                for (let i = 0; i < tournament.tournamentData.quarter.length; i += 2)
                {
                    if (i + 1 < tournament.tournamentData.quarter.length)
                    {
                        if (tournament.tournamentData.quarter[i] === "Player 1" || tournament.tournamentData.quarter[i + 1] === "Player 1")
                        {
                                if (tournament.tournamentData.quarter[i] === "Player 1")
                                    tournament.tournamentData.semi.push(tournament.tournamentData.quarter[i]);
                                else
                                    tournament.tournamentData.semi.push(tournament.tournamentData.quarter[i+1]);
                        }
                        else
                        {
                            let winner = tournament.playMatch(tournament.tournamentData.quarter[i], tournament.tournamentData.quarter[i + 1]);
                            tournament.tournamentData.semi.push(winner);
                        }
                    } 
                }
  
                for (let i = 0; i < tournament.tournamentData.semi.length; i++)
                {
                  tournament.tournamentData.brackets.push(tournament.tournamentData.semi[i]);
                }
              }
              else if (tournament.tournamentData.round === 1)
              {
                for (let i = 0; i < tournament.tournamentData.semi.length; i += 2)
                {
                    if (i + 1 < tournament.tournamentData.semi.length)
                    {
                        if (tournament.tournamentData.semi[i] === "Player 1" || tournament.tournamentData.semi[i + 1] === "Player 1")
                        {
                                if (tournament.tournamentData.semi[i] === "Player 1")
                                    tournament.tournamentData.final.push(tournament.tournamentData.semi[i]);
                                else
                                    tournament.tournamentData.final.push(tournament.tournamentData.semi[i+1]);
                        }
                        else
                        {
                            let winner = tournament.playMatch(tournament.tournamentData.semi[i], tournament.tournamentData.semi[i + 1]);
                            tournament.tournamentData.final.push(winner);
                        }
                    } 
                }
  
                for (let i = 0; i < tournament.tournamentData.final.length; i++)
                {
                  tournament.tournamentData.brackets.push(tournament.tournamentData.final[i]);
                }

              }
              else if (tournament.tournamentData.round === 2)
              {
                  if (tournament.tournamentData.final[0] === "Player 1")
                      tournament.tournamentData.winner.push(tournament.tournamentData.final[0]);
                  else
                      tournament.tournamentData.winner.push(tournament.tournamentData.final[1]);
                  tournament.tournamentData.brackets.push(tournament.tournamentData.winner[0]);
              }
  
              tournament.tournamentData.round++;
  
             
          }  
          
          tournament.tournamentData.type = "display-tournament";
          game.gameState.scores.left = 0;
          game.gameState.scores.right = 0;
          game.gameState.gameStart = false;
          broadcastState(players, tournament.tournamentData);
          
        }  
        
        if (data.id === "front-tournament" && data.type === "draw-tournament")
        {
          
          if (tournament.tournamentData.round === 0)
            {
              
              let list = ["Player 1", "Bob", "Charlie", "Dave", "Eve", "Frank", "Grace", "Hank"];
              while (list.length > 0) {
                let element = getRandomUniqueElement(list);
                tournament.tournamentData.quarter.push(element);
              }
              for (let i = 0; i < tournament.tournamentData.quarter.length; i++)
              {
                tournament.tournamentData.brackets.push(tournament.tournamentData.quarter[i]);
              }
            }
            tournament.tournamentData.type = "fill-players";
            broadcastState(players, tournament.tournamentData);
            
        }
        else if (data.id === "front-tournament" && data.type === "next-button")
        {
          if (tournament.tournamentData.round <= 2)
          {

          // if (tournament.tournamentData.round === 0 )
          // {
            tournament.tournamentData.type = "display-game";  
            // tournament.updateTournament();
            broadcastState(players, tournament.tournamentData);
          // }
          // else if (tournament.tournamentData.round === 1 )
          // {

          // }
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

export {broadcastState, startSetInterval, stopSetInterval} ;