import Fastify from 'fastify';
import dbConnector from './plugins/database.js';

const fastify = Fastify({ logger: true });

fastify.register(dbConnector);

fastify.get('/users', async (request, reply) => {
  const users = fastify.sqlite.prepare('SELECT * FROM users').all();
  return users;
});

fastify.post('/users', async (request, reply) => {
  const { name } = request.body;
  fastify.sqlite.prepare('INSERT INTO users (name) VALUES (?)').run(name);
  return { message: 'User added!' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
