import Fastify from 'fastify'

const fastify = Fastify({logger: true})
import fastifyStatic from '@fastify/static'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyWebsocket from '@fastify/websocket';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let players = [];

let gameState = {
  type: "update",
  paddles: [ { y: 10, playerID: 0, side: "left" }, { y: 10, playerID: 0, side: "right" } ],
  ball: { x: 400, y: 200, vx: 4, vy: 4 },
  scores: {left: 1, right: 0}
};

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  // prefix: '/public/',
})

// fastify.get('/', function (req, reply) {
  // reply.sendFile('index.html')
// })

fastify.register(fastifyWebsocket)
fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (socket, req) => {
    setInterval(() => {
      gameState.ball.x += gameState.ball.vx;
      gameState.ball.y += gameState.ball.vy;
      socket.send(JSON.stringify(gameState));

      if (gameState.ball.y <= 0 || gameState.ball.y >= 400) gameState.ball.vy *= -1; // Rebond en haut/bas

      if (gameState.ball.x <= 20 && gameState.ball.y >= gameState.paddles[0].y && gameState.ball.y <= gameState.paddles[0].y + 80) gameState.ball.vx *= -1;
      if (gameState.ball.x >= 780 && gameState.ball.y >= gameState.paddles[1].y && gameState.ball.y <= gameState.paddles[1].y + 80) gameState.ball.vx *= -1;

      if (gameState.ball.x <= 0) {
        gameState.scores.right += 1;
        resetBall();
        console.log(gameState)
      } else if (gameState.ball.x >= 800) {
        gameState.scores.left++;
        resetBall();
        console.log("ICI ", gameState)
      }

    }, 30);

    socket.on('message', function incoming(data)
    {
        const message = JSON.parse(data);
        // console.log(message)
        if (message === "s")
          gameState.paddles[0].y += 5;
        else if (message === "w")
          gameState.paddles[0].y -= 5;
        else if (message === "o")
          gameState.paddles[1].y -= 5;
        else if (message === "l")
          gameState.paddles[1].y += 5;
        socket.send(JSON.stringify(gameState));
    });

      // socket.on('close', function ()
      // {
      //     console.log('S: Client closed connection');
      // });
  })
})

function resetBall() {
  gameState.ball = { x: 400, y: 200, vx: 4, vy: 4 };
}


try {
  await fastify.listen({ port: 3000, host: '0.0.0.0'})
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}