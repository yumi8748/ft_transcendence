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

const player = {x:10, y:10};
fastify.register(fastifyWebsocket)
fastify.register(async function (fastify) {
    fastify.get('/ws', { websocket: true }, (socket, req) => {
        socket.send(JSON.stringify(player));
        socket.on('message', function incoming(data)
        {
            const message = JSON.parse(data);
            if (message.type === 's')
                player.y += 2;
            else if (message.type === 'w')
                player.y -= 2;
            else if (message.type === 'a')
                player.x -= 2;
            else if (message.type === 'd')
                player.x += 2;
            socket.send(JSON.stringify(player));
        });

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