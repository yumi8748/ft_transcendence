import fp from 'fastify-plugin';
import Database from 'better-sqlite3';

// Database connection plugin
async function dbConnector(fastify, options) {
  const db = new Database('./database/database.sqlite');
  
  // Create the 'users' table if it doesn't exist
  db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT NOT NULL
  )`).run();

  fastify.decorate('sqlite', db); // Attach the db to Fastify instance
  
}

export default fp(dbConnector); // Register the plugin
