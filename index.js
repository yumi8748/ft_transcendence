import Fastify from 'fastify'

const fastify = Fastify({logger: true})
import fastifyStatic from '@fastify/static'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyWebsocket from '@fastify/websocket';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let players = {};
let ball = { x: 400, y: 250, vx: 3, vy: 3 };
let scores = { left: 0, right: 0 };

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  // prefix: '/public/',
})

// fastify.get('/', function (req, reply) {
  // reply.sendFile('index.html')
// })

// const player = {x:10, y:10};
fastify.register(fastifyWebsocket)
fastify.register(async function (fastify) {
    fastify.get('/ws', { websocket: true }, (socket, req) => {

      const playerId = Date.now();
      players[0] = { type: "move",  playerId:Date.now(), y: 10, side: Object.keys(players).length % 2 === 0 ? "left" : "right" };
      players[1] = { type: "move",playerId:Date.now(), y: 10, side: Object.keys(players).length % 2 === 0 ? "left" : "right" };
       
      socket.send(JSON.stringify(players));

      socket.on("message", (message) => {
        const data = JSON.parse(message);
        // console.log(data[0].y)

        if (data[0].type === "move") {
          players[0].y = data[0].y;
        }
        socket.send(JSON.stringify(players));
      });
        // socket.on('message', function incoming(data)
        // {
          // console.log("JELLO")
            // const message = JSON.parse(data);
            // if (message.type === 's')
            //     player.y += 2;
            // else if (message.type === 'w')
            //     player.y -= 2;
            // else if (message.type === 'a')
            //     player.x -= 2;
            // else if (message.type === 'd')
            //     player.x += 2;
            // socket.send(JSON.stringify(player));
        // });

        socket.on('close', function ()
        {
            console.log('S: Client closed connection');
        });
    })
})

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0'})
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}