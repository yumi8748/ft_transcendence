import Fastify from 'fastify'
const fastify = Fastify({logger: true})

import fastifyStatic from '@fastify/static'
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyWebsocket from '@fastify/websocket';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fastify.register(fastifyWebsocket)

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
});

fastify.listen({ port: 3000, host: '0.0.0.0' }, () => {
    console.log('API Gateway running on http://localhost:3000');
  });
