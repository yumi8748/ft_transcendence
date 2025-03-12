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
  
  // Create the 'matches' table if it doesn't exist
  db.prepare(`
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player1_id INTEGER NOT NULL,
      player2_id INTEGER NOT NULL,
      player1_score INTEGER DEFAULT 0,
      player2_score INTEGER DEFAULT 0,
      game_start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      game_end_time TIMESTAMP,
      FOREIGN KEY (player1_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (player2_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `).run();

  fastify.decorate('sqlite', db); // Attach the db to Fastify instance
  
}

export default fp(dbConnector); // Register the plugin
