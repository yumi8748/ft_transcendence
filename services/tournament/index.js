import Fastify from 'fastify'
const fastify = Fastify({logger: true})

import fastifyWebsocket from '@fastify/websocket';
fastify.register(fastifyWebsocket)

import { Tournament } from './manageTournament.js';

let players = [];
let playerIndex = 0;
let contestants = ["Alice", "Bob", "Charlie", "Dave"];
const tournament = new Tournament();

fastify.register(async (fastify) => {
    fastify.get("/wstournament", { websocket: true }, (connection, req) => {

    connection.id = contestants[playerIndex];
    players.push(connection);
    playerIndex = players.length;
    let i = 0;
    connection.on("message", (message) =>
    {
      const data = JSON.parse(message);
      if (data.type === "front_tournamentTable_draw")
        tournament.sendDrawTournamentTable(players, connection);
      else if (data.type === "front_tournamentTable_next")
          tournament.sendNextTournamentTable(players);
      else if (data.type === "front_tournamentTable_home")
          tournament.sendHomeTournamentTable(players);
      else if (data.type === "front_tournamentGame_start")
          tournament.sendStartTournamentGame(players);
      else if (data.type === "front_tournamentGame_key")
          tournament.updatePaddlePosition(data, connection.id);
      else if (data.type === "front_tournamentGame_next")
          tournament.sendNextTournamentGame(players);
    });
        
    connection.on('close', () =>
    {
      players.splice(playerIndex, 1);
    });
  })
})



function broadcastState(players, message)
{
    players.forEach(player => player.send(JSON.stringify(message)));
}


fastify.listen({ port: 3007, host: '0.0.0.0'  }, () => {
  console.log('Chat service running on ws://localhost:3007/ws');
});

export {broadcastState} ;