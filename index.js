import Fastify from 'fastify'

const fastify = Fastify({logger: true})
import fastifyStatic from '@fastify/static'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyWebsocket from '@fastify/websocket';

import bcrypt from 'bcrypt'
import sqlite3 from "sqlite3";

import fastify_formbody from '@fastify/formbody'
import fastify_cookie from '@fastify/cookie'
import fastify_session from '@fastify/session'

import { Tournament } from './manageTournament.js';
import { Game } from './manageGame.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
})

// fastify.get('/', function (req, reply) {
  // reply.sendFile('index.html')
// })

fastify.setNotFoundHandler((req, reply) => {
  reply.sendFile('index.html');
});

const db = new sqlite3.Database('./mydb.sqlite', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('✅ Connected to SQLite database.');
  });
  
  const fetchFirst = async (db, sql, params) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  };

  const execute = async (db, sql, params = []) => {
    if (params && params.length > 0) {
      return new Promise((resolve, reject) => {
        db.run(sql, params, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    }
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  };
  
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

fastify.register(fastifyWebsocket)

fastify.register(fastify_formbody);
fastify.register(fastify_cookie);
fastify.register(fastify_session, {
  secret: 'a_super_secret_key_that_is_long_enough',
  cookie: { secure: false }, // Set true if using HTTPS
  saveUninitialized: false
});


let players = [];
let playerIndex = 0;
let contestants = ["Alice", "Bob", "Charlie", "Dave"];
const game = new Game();
const tournament = new Tournament();

fastify.register(async (fastify) => {
    fastify.get("/ws", { websocket: true }, (connection, req) => {
    
    connection.id = contestants[playerIndex];
    players.push(connection);
    playerIndex = players.length;
    connection.on("message", (message) =>
    {
        const data = JSON.parse(message);
        // Game part
        if (data.type === "front_game_draw")
            game.sendDrawGame(connection);
        else if (data.type === "front_game_start")
            game.sendStartGame(connection);
        else if (data.type === "front_game_key")
            game.updatePaddlePosition(data);
        else if (data.type === "front_game_home")
            game.sendHomeGame(connection);
        
        // Tournament part
        if (data.type === "front_tournamentTable_draw")
            tournament.sendDrawTournamentTable(players, connection);
        else if (data.type === "front_tournamentTable_next")
            tournament.sendNextTournamentTable(players);
        else if (data.type === "front_tournamentTable_home")
            tournament.sendHomeTournamentTable(players);
        else if (data.type === "front_tournamentGame_start")
            tournament.sendStartTournamentGame(players);
        else if (data.type === "front_tournamentGame_key")
            tournament.updatePaddlePosition(data, connection.id);
        else if (data.type === "front_tournamentGame_next")
            tournament.sendNextTournamentGame(players);
       
    });

    connection.on('close', () =>
    {
        players.splice(playerIndex, 1)
    });
  })
})

function broadcastState(players, message)
{
    players.forEach(player => player.send(JSON.stringify(message)));
}

fastify.post('/api/register', async (req,res) =>
{
    const { password, username} = req.body;
    let sql = `SELECT * FROM users WHERE username = ?`;
    try
    {
        const user = await fetchFirst(db, sql, [username]);
        if (user !== undefined)
        return { success: false, message: 'Email already exist' }
        else
        {
        const hash = await bcrypt.hash(password, 12);
        sql = `INSERT INTO users(username, password) VALUES(?, ?)`;
        await execute(db, sql, [username, hash]);
        req.session.user_id = username;
        return { success: true }

        }
    } catch (err) {
        console.log(err);
    } 
})

fastify.post('/api/login', async (req, reply) => {
    const { username, password } = req.body;
    let sql = `SELECT * FROM users WHERE username = ?`;
    const user = await fetchFirst(db, sql, [username]);
    const validPassword = await bcrypt.compare(password, user.password)

    if (validPassword)
    {
    req.session.user_id = username;
    return { success: true }
    }
    else
    {
    return { success: false, message: 'wrong username or password' }
    }
})

fastify.get('/api/session', (req, reply) => {
    if (req.session.user_id) {
    return { authenticated: true, user: req.session.user_id }
    }
    return { authenticated: false }
})

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0'})
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

export {broadcastState} ;