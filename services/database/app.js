import Fastify from 'fastify';
import formbody from '@fastify/formbody'
import dbConnector from './plugins/database.js';
import usersRoutes from './routes/users.js';
import matchesRoutes from './routes/matches.js';
import tournamentsRoutes from './routes/tournaments.js';
import friendsRoutes from './routes/friends.js';

const fastify = Fastify({ logger: true });

// Register database plugin
fastify.register(dbConnector);

// Register routes

//truc
await fastify.register(formbody);
fastify.register(usersRoutes);
fastify.register(matchesRoutes);
fastify.register(tournamentsRoutes);
fastify.register(friendsRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 Server running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
