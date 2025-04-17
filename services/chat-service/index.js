import Fastify from 'fastify'
const fastify = Fastify({logger: true})

import fastifyWebsocket from '@fastify/websocket';
fastify.register(fastifyWebsocket)

// let gameStart = false;
let players = [];
// let gameState = {
//   type: "update",
//   paddles: [ { y: 10, playerID: 0, side: "left" }, { y: 10, playerID: 0, side: "right" } ],
//   ball: { x: 300, y: 200, vx: 4, vy: 4 },
//   scores: {left: 0, right: 0}
// };

let gameState = {
  paddles: [ { y: 10, playerID: 0, side: "left" }, { y: 10, playerID: 0, side: "right" } ],
  ball: { x: 300, y: 200, vx: 4, vy: 4 },
  scores: {left: 0, right: 0},
  gameStart : false,
  type: "",
  intervalId: ""
};


fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (socket, req) => {
      gameState.gameStart = true;
      players.push(socket);
      const playerIndex = players.length;
      // startSetInterval(socket);
      socket.on('message', function incoming(message)
      {
        console.log("OK")
        
        const data = JSON.parse(message);
        console.log(data)
        if (data.type === "front_game_draw")
        {
          gameState.type = "back_game_draw";  
          socket.send(JSON.stringify(gameState))
        }
        else if (data.type === "front_game_start")
        {
           gameState.type = "back_game_position";  
            gameState.gameStart = true;
            startSetInterval(socket); 
        }
        else if (data.type === "front_game_home")
        {
          gameState.scores.left = 0;
          gameState.scores.right = 0;
          gameState.gameStart = false;
          gameState.type = "back_game_home";
          socket.send(JSON.stringify(gameState))
        }
        else if (data.type === "front_game_key")
        {
          if (data.sKey === true)
            gameState.paddles[0].y += 5;
          if (data.wKey === true)
            gameState.paddles[0].y -= 5;
          if (data.oKey === true)
            gameState.paddles[1].y -= 5;
          if (data.lKey === true)
            gameState.paddles[1].y += 5;
        }
     
      });
      socket.on('close', function ()
      {
        players.splice(playerIndex, 1)
      });
  })
})

function  updateGame()
{
    if (gameState.scores.left >= 2 || gameState.scores.right >= 2)
    {
        gameState.gameStart = false;
        stopSetInterval();
    }
    if (gameState.gameStart)
    {
        gameState.ball.x += gameState.ball.vx;
        gameState.ball.y += gameState.ball.vy;
        if (gameState.ball.y <= 10 || gameState.ball.y >= 390)
            gameState.ball.vy *= -1;
        if (gameState.ball.x <= 10) 
        {
            gameState.scores.right += 1;
            resetBall();
        } 
        else if (gameState.ball.x >= 590)
        {
            gameState.scores.left++;
            resetBall();
        }
        if (gameState.ball.x == 20 && gameState.ball.y >= gameState.paddles[0].y && gameState.ball.y <= gameState.paddles[0].y + 80)
            gameState.ball.vx *= -1;
        if (gameState.ball.x == 580 && gameState.ball.y >= gameState.paddles[1].y && gameState.ball.y <= gameState.paddles[1].y + 80)
            gameState.ball.vx *= -1;
    }
}

function resetBall() {
  gameState.ball = { x: 300, y: 200, vx: 4, vy: 4 };
}

function startSetInterval(connection)
{
    gameState.intervalId = setInterval(() => 
    {
        updateGame();
        connection.send(JSON.stringify(gameState))
    }, 30);
}

function stopSetInterval()
    {
        clearInterval(gameState.intervalId);
        gameState.intervalId = null;
    }

function broadcastState()
{
  console.log("OK")
  players.forEach(player => player.send(JSON.stringify(gameState)));
}

fastify.listen({ port: 3005, host: '0.0.0.0'  }, () => {
  console.log('Chat service running on ws://localhost:3005/ws');
});