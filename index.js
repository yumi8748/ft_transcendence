import Fastify from 'fastify'

const fastify = Fastify({logger: true})
import fastifyStatic from '@fastify/static'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyWebsocket from '@fastify/websocket';

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

let gameStart = false;
let players = [];
let gameState = {
  type: "update",
  paddles: [ { y: 10, playerID: 0, side: "left" }, { y: 10, playerID: 0, side: "right" } ],
  ball: { x: 300, y: 200, vx: 4, vy: 4 },
  scores: {left: 0, right: 0}
};

setInterval(updateGame, 30);

fastify.register(async (fastify) => {
    fastify.get("/ws", { websocket: true }, (connection, req) => {
    
    gameStart = true;
    const playerIndex = players.length;
    players.push(connection);
    
    connection.on("message", (message) =>
    {
        const data = JSON.parse(message);
        if (data.sKey === true)
          gameState.paddles[0].y += 5;
        if (data.wKey === true)
          gameState.paddles[0].y -= 5;
        if (data.oKey === true)
          gameState.paddles[1].y -= 5;
        if (data.lKey === true)
          gameState.paddles[1].y += 5;
    });
    connection.on('close', () =>
    {
      players.splice(playerIndex, 1)
    });
  })
})

function updateGame()
{
    if (gameStart)
    {
        gameState.ball.x += gameState.ball.vx;
        gameState.ball.y += gameState.ball.vy;
        if (gameState.ball.y <= 0 || gameState.ball.y >= 400)
            gameState.ball.vy *= -1;
        if (gameState.ball.x <= 0) 
        {
            gameState.scores.right += 1;
            resetBall();
        } 
        else if (gameState.ball.x >= 600)
        {
            gameState.scores.left++;
            resetBall();
        }
        if (gameState.ball.x <= 20 && gameState.ball.y >= gameState.paddles[0].y && gameState.ball.y <= gameState.paddles[0].y + 80)
            gameState.ball.vx *= -1;
        if (gameState.ball.x >= 580 && gameState.ball.y >= gameState.paddles[1].y && gameState.ball.y <= gameState.paddles[1].y + 80)
            gameState.ball.vx *= -1;
        broadcastState();
    }
}

function resetBall() {
  gameState.ball = { x: 300, y: 200, vx: 4, vy: 4 };
}

function broadcastState()
{
  players.forEach(player => player.send(JSON.stringify(gameState)));
}

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0'})
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}