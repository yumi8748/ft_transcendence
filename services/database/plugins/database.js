import fp from 'fastify-plugin';
import Database from 'better-sqlite3';

// Database connection plugin
async function dbConnector(fastify, options) {
  const db = new Database('../../app/database/database.sqlite');
  console.log('Database connected');

  // Create the 'users' table if it doesn't exist
  try {
    db.prepare(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT NOT NULL,
      register_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'offline'
    )`).run();
    console.log('Users table created successfully');
  } catch (error) {
    console.error('Error creating users table:', error);
  }

  
  // Create the 'matches' table if it doesn't exist
  try {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player1_id INTEGER NOT NULL,
        player2_id INTEGER NOT NULL,
        player1_score INTEGER NOT NULL DEFAULT 0,
        player2_score INTEGER NOT NULL DEFAULT 0,
        game_start_time TEXT,
        game_end_time TEXT,
        FOREIGN KEY (player1_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (player2_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `).run();
    console.log('Matches table created successfully');
  } catch (error) {
    console.error('Error creating matches table:', error);
  }

  // Create the 'tournaments' table if it doesn't exist
  try {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS tournaments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        status TEXT CHECK(status IN ('upcoming', 'ongoing', 'finished')) DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    console.log('Tournaments table created successfully');
  } catch (error) {
    console.log('Error creating tournaments table:', error);
  }

   // Create the 'friends' table if it doesn't exist
  try {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS friends (
        user_id INTEGER,
        friend_id INTEGER,
        status TEXT,
        PRIMARY KEY (user_id, friend_id)
      )
    `).run();
    console.log('Friends table created successfully');
  } catch (error) {
    console.log('Error creating friends table:', error);
  }

  fastify.decorate('sqlite', db); // Attach the db to Fastify instance
  
}

export default fp(dbConnector); // Register the plugin
