import Fastify from 'fastify'
const fastify = Fastify({logger: true})

import fastifyWebsocket from '@fastify/websocket';
fastify.register(fastifyWebsocket)

let gameStart = false;
let players = [];
let playerCount = 0;
let gameState = {
  type: "update",
  paddles: [ { y: 10, playerID: 0, side: "left" }, { y: 10, playerID: 0, side: "right" } ],
  ball: { x: 300, y: 200, vx: 4, vy: 4 },
  scores: {left: 0, right: 0}
};


let refresh = setInterval(updateGame, 30);

fastify.register(async (fastify) => {
    fastify.get("/ws", { websocket: true }, (connection, req) => {
    
      if (playerCount > 3) {
      connection.close();
      return;
    }
    gameStart = true;

    // gameData.game_start_time = new Date().toISOString();

    const playerIndex = playerCount++;
    const paddleIndex = playerIndex % 2;

    players.push(connection);
    connection.send(JSON.stringify({ type: "playerID", playerID: playerIndex }));
    connection.send(JSON.stringify(gameState));

    connection.on("message", (message) =>
    {
        const data = JSON.parse(message);
        // if (playerIndex === 0) {
              if (data.sKey === true && gameState.paddles[0].y < 310)
              gameState.paddles[0].y += 10;
              if (data.wKey === true && gameState.paddles[0].y > 10)
              gameState.paddles[0].y -= 10;
            // } if (playerIndex == 1) {
          if (data.oKey === true && gameState.paddles[1].y > 10)
            gameState.paddles[1].y -= 10;
          if (data.lKey === true && gameState.paddles[1].y < 310)
            gameState.paddles[1].y += 10;
        // }
     });
        
    connection.on('close', () =>
    {
      playerCount--;
      players.splice(playerIndex, 1);
      if (playerCount < 3) {
        gameStart = false;
      }
    });
  })
})

function updateGame()
{
  if (gameState.scores.left === 12 || gameState.scores.right === 12)
    {
        gameStart = false;
        clearInterval(refresh);
        // saveGame();
    }  
  if (gameStart)
    {
        gameState.ball.x += gameState.ball.vx;
        gameState.ball.y += gameState.ball.vy;
        if (gameState.ball.y <= 10 || gameState.ball.y >= 390)
            gameState.ball.vy *= -1;
        if (gameState.ball.x <= 11) 
        {
            gameState.scores.right++;
            resetBall();
        } 
        else if (gameState.ball.x >= 589)
        {
            gameState.scores.left++;
            resetBall();
        }
        if (gameState.ball.x === 20 && gameState.ball.y >= gameState.paddles[0].y && gameState.ball.y <= gameState.paddles[0].y + 80)
            gameState.ball.vx *= -1;
        if (gameState.ball.x === 580 && gameState.ball.y >= gameState.paddles[1].y && gameState.ball.y <= gameState.paddles[1].y + 80)
            gameState.ball.vx *= -1;
        
        broadcastState();
    }
}

function resetBall() {
  gameState.ball.x = 300;
  gameState.ball.y = 200;
  gameState.ball.vx = Math.random() < 0.5 ? 4 : -4;
  gameState.ball.vy = Math.random() < 0.5 ? 4 : -4;
}

function broadcastState()
{
  players.forEach(player => player.send(JSON.stringify(gameState)));
}

fastify.listen({ port: 3005, host: '0.0.0.0'  }, () => {
  console.log('Chat service running on ws://localhost:3005/ws');
});