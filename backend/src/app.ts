import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { dbPlugin } from './db/database';
import routes from './routes';

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: true
  });

  // Register CORS plugin
  app.register(cors, {
    origin: '*', // In production, specify your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  });

  // Register database plugin
  app.register(dbPlugin);

  // Register routes
  app.register(routes);

  // Root route
  app.get('/', async () => {
    return { message: 'Welcome to the Task API' };
  });

  return app;
}