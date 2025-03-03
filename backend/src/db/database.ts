import Database from 'better-sqlite3';
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// Database plugin for Fastify
export const dbPlugin: FastifyPluginAsync = fp(async (fastify) => {
  // instantiate a new database
  const db = new Database('tasks.db');

  // create a new table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0
    )
  `);

  // seed the database with some initial data
  const count = db.prepare('SELECT COUNT(*) as count FROM tasks').get() as { count: number };
  if (count.count === 0) {
    db.exec(`
      INSERT INTO tasks (title, completed) VALUES 
      ('Learn Fastify', 0),
      ('Learn TypeScript', 0),
      ('Learn Tailwind CSS', 0)
    `);
  }

  // add database methods to Fastify instance
  fastify.decorate('db', {
    getTasks: (): Task[] => {
      return db.prepare('SELECT id, title, completed FROM tasks').all() as Task[];
    },

    getTask: (id: number): Task => {
      const task = db
        .prepare('SELECT id, title, completed FROM tasks WHERE id = ?')
        .get(id);
      if (!task) {
        throw new Error('Task not found');
      }
      return task as Task;
    },

    createTask: (title: string): Task => {
      const result = db
        .prepare('INSERT INTO tasks (title, completed) VALUES (?, 0)')
        .run(title);
      const task = db
        .prepare('SELECT id, title, completed FROM tasks WHERE id = ?')
        .get(result.lastInsertRowid);
      if (!task) {
        throw new Error('Task not found');
      }
      return task as Task;
    },

    updateTask: (id: number, completed: boolean): Task => {
      db.prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(
        completed ? 1 : 0,
        id
      );
      const task = db
        .prepare('SELECT id, title, completed FROM tasks WHERE id = ?')
        .get(id);
      if (!task) {
        throw new Error('Task not found');
      }
      return task as Task;
    },

    deleteTask: (id: number): void => {
      db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    },
  });
});

// Extend Fastify instance with database methods
declare module 'fastify' {
  interface FastifyInstance {
    db: {
      getTasks(): Task[];
      getTask(id: number): Task;
      createTask(title: string): Task;
      updateTask(id: number, completed: boolean): Task;
      deleteTask(id: number): void;
    };
  }
}