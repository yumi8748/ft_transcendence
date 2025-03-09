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
  // prefix: '/public/',
})

// fastify.get('/', function (req, reply) {
  // reply.sendFile('index.html')
// })

fastify.register(fastifyWebsocket)

let players = [];

let gameState = {
  type: "update",
  paddles: [ { y: 10, playerID: 0, side: "left" }, { y: 10, playerID: 0, side: "right" } ],
  ball: { x: 400, y: 200, vx: 4, vy: 4 },
  scores: {left: 1, right: 0}
};

fastify.register(async (fastify) => {
    fastify.get("/ws", { websocket: true }, (connection, req) => {
        setInterval(() => {
            gameState.ball.x += gameState.ball.vx;
            gameState.ball.y += gameState.ball.vy;
            if (gameState.ball.y <= 0 || gameState.ball.y >= 400)
                gameState.ball.vy *= -1;
            if (gameState.ball.x <= 0) 
            {
                gameState.scores.right += 1;
                resetBall();
            } 
            else if (gameState.ball.x >= 800)
            {
                gameState.scores.left++;
                resetBall();
            }
            if (gameState.ball.x <= 20 && gameState.ball.y >= gameState.paddles[0].y && gameState.ball.y <= gameState.paddles[0].y + 80)
                gameState.ball.vx *= -1;
            if (gameState.ball.x >= 780 && gameState.ball.y >= gameState.paddles[1].y && gameState.ball.y <= gameState.paddles[1].y + 80)
                gameState.ball.vx *= -1;
            connection.send(JSON.stringify(gameState));
        }, 30);

    connection.on("message", (message) =>
    {
        const data = JSON.parse(message);
        if (data === "s")
          gameState.paddles[0].y += 5;
        else if (data === "w")
          gameState.paddles[0].y -= 5;
        else if (data === "o")
          gameState.paddles[1].y -= 5;
        else if (data === "l")
          gameState.paddles[1].y += 5;
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