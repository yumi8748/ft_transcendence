import fp from 'fastify-plugin';
import Database from 'better-sqlite3';

// Database connection plugin
async function dbConnector(fastify, options) {
  const db = new Database('./database/database.sqlite');
  fastify.decorate('sqlite', db); // Attach the db to Fastify instance
}

export default fp(dbConnector); // Register the plugin
