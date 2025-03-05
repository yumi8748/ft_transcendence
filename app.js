import Fastify from 'fastify';
import dbConnector from './plugins/database.js';
import usersRoutes from './routes/users.js';
import matchesRoutes from './routes/matches.js';

const fastify = Fastify({ logger: true });

// Register database plugin
fastify.register(dbConnector);

// Register routes
fastify.register(usersRoutes);
fastify.register(matchesRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Server running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
