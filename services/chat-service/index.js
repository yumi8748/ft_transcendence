import Fastify from 'fastify'
const fastify = Fastify({logger: true})

import fastifyWebsocket from '@fastify/websocket';
fastify.register(fastifyWebsocket)

import { Game } from './manageGame.js';


fastify.register(async (fastify) => {
    fastify.get("/ws", { websocket: true }, (connection, req) => {
    
    const game = new Game();

    connection.on("message", (message) =>
    {
        const data = JSON.parse(message);
        if (data.type === "front_game_draw")
          game.sendDrawGame(connection);
        else if (data.type === "front_game_start")
            game.sendStartGame(connection);
        else if (data.type === "front_game_key")
            game.updatePaddlePosition(data);
        else if (data.type === "front_game_home")
            game.sendHomeGame(connection);
        
     });
        
    connection.on('close', () =>
    {
      // players.splice(playerIndex, 1);
    });
  })
})






fastify.listen({ port: 3005, host: '0.0.0.0'  }, () => {
  console.log('Chat service running on ws://localhost:3005/ws');
});