import fp from 'fastify-plugin';
import Database from 'better-sqlite3';

async function dbConnector(fastify, options) {
  const db = new Database('./database/database.sqlite', { verbose: console.log });

  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      score INTEGER DEFAULT 0
    )
  `).run();

  fastify.decorate('sqlite', db);

  fastify.addHook('onClose', (instance, done) => {
    db.close();
    done();
  });
}

export default fp(dbConnector);
