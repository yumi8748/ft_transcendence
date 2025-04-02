

import Fastify from 'fastify'

const fastify = Fastify({logger: true})
import fastifyStatic from '@fastify/static'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyWebsocket from '@fastify/websocket';
import { clearInterval } from 'node:timers';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gameData = {
  player1_id: 1,
  player2_id: 2,
  player1_score: 0,
  player2_score: 0,
  game_start_time: null,
  game_end_time: null
};

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
})

fastify.setNotFoundHandler((req, reply) => {
  reply.sendFile('index.html');
});

fastify.register(fastifyWebsocket)


let game = {
  gameStart: false,
  players: [],
  playerCount: 0,
  gameState: {
    type: "update",
    paddles: [ { y: 10, playerID: 0, side: "left" }, { y: 10, playerID: 0, side: "right" } ],
    ball: { x: 300, y: 200, vx: 4, vy: 4 },
    scores: {left: 0, right: 0}
  }
};
let games = []

let newPlayer = {
    connection: null,
    newPlayerID: 0,
    connectionTime: null
};
let waitingList = []; 

let playerCounter = 0;


//! LOOPS
let refresh = setInterval(updateGames, 30); //?update game
setInterval(Matchmaking, 1000); //? matchmaking every second (no need to stop with clear interval)
setInterval(Routine, 1000);

fastify.register(async (fastify) => {
    fastify.get("/ws", { websocket: true }, (connection, req) => {
    
    console.log("✅ New client connected with playerID:", playerCounter);
    addToWaitingList(playerCounter++, connection)
    
  })
})

//! GAME FUNCTIONS

function handlePaddleMovement(connection, game, playerIndex) {
  connection.socket.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (playerIndex === 0) {
        if (data.sKey === true && game.gameState.paddles[0].y < 310)
          game.gameState.paddles[0].y += 10;
        if (data.wKey === true && game.gameState.paddles[0].y > 10)
          game.gameState.paddles[0].y -= 10;
      } else if (playerIndex === 1) {
        if (data.lKey === true && game.gameState.paddles[1].y < 310)
          game.gameState.paddles[1].y += 10;
        if (data.oKey === true && game.gameState.paddles[1].y > 10)
          game.gameState.paddles[1].y -= 10;
      }
    } catch (error) {
      console.error("Failed to parse message:", error);
    }
  });
  
  connection.socket.on('close', () => {
    console.log(`Player ${playerIndex} disconnected from game`);
    game.gameStart = false;
    
    // Handle player disconnection - could put players back in waiting list
    if (game.players.length > playerIndex) {
      const otherPlayerIndex = playerIndex === 0 ? 1 : 0;
      if (game.players.length > otherPlayerIndex && game.players[otherPlayerIndex].connection) {
        game.players[otherPlayerIndex].connection.send(JSON.stringify({ type: "playerDisconnected" }));
        waitingList.push(game.players[otherPlayerIndex]);
      }
      games = games.filter(g => g !== game);
    }
  });
}

function updateGames() {
  // if (games.length === 0)
  //     clearInterval(refresh);
  games.forEach(element => {
    
    updateGame(element);
  });
}

function updateGame(game)
{
  const { gameState, players, gameStart } = game;
  if (gameState.scores.left === 12 || gameState.scores.right === 12)
    {
        game.gameStart = false;
        saveGame(game);
        waitingList.push(players[0]);
        waitingList.push(players[1]);
        games = games.filter(g => g !== game);
    }  
  if (gameStart)
    {
        gameState.ball.x += gameState.ball.vx;
        gameState.ball.y += gameState.ball.vy;
        if (gameState.ball.y <= 10 || gameState.ball.y >= 390)
            gameState.ball.vy *= -1;
        if (gameState.ball.x <= 11) 
        {
            gameState.scores.right++;
            resetBall(game);
        } 
        else if (gameState.ball.x >= 589)
        {
            gameState.scores.left++;
            resetBall(game);
        }
        if (gameState.ball.x === 20 && gameState.ball.y >= gameState.paddles[0].y && gameState.ball.y <= gameState.paddles[0].y + 80)
            gameState.ball.vx *= -1;
        if (gameState.ball.x === 580 && gameState.ball.y >= gameState.paddles[1].y && gameState.ball.y <= gameState.paddles[1].y + 80)
            gameState.ball.vx *= -1;
        
        broadcastState(game);
    }
}

function resetBall(game) {
  game.gameState.ball.x = 300;
  game.gameState.ball.y = 200;
  game.gameState.ball.vx = Math.random() < 0.5 ? 4 : -4;
  game.gameState.ball.vy = Math.random() < 0.5 ? 4 : -4;
}

function broadcastState(game)
{
  game.players[0].connection.send(JSON.stringify(game.gameState));
  game.players[1].connection.send(JSON.stringify(game.gameState));
}

async function saveGame(game) {
  gameData.player1_score = game.gameState.scores.left;
  gameData.player2_score = game.gameState.scores.right;
  gameData.game_end_time = new Date().toISOString();

  try {
    const response = await fetch('http://data-service:3001/matches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });
    const data = await response.json();
    console.log("Game saved: ", data);
  } catch (error) {
    console.log("Failed to save game: ", error);
  }
}

//! MATCHMAKING FUNCTION

function Matchmaking() {
  if (waitingList.length >= 2) {
    const player1 = waitingList.shift();
    const player2 = waitingList.shift();

    const newGame = {
      gameStart: true,
      playerCount: 2,
      players: [player1, player2],
      gameState: {
        type: "update",
        paddles: [
          { y: 10, playerID: 0, side: "left" },
          { y: 10, playerID: 1, side: "right" }
        ],
        ball: { x: 300, y: 200, vx: 4, vy: 4 },
        scores: { left: 0, right: 0 }
      }
    };

    games.push(newGame);
    console.log('⭐\t\tNew game launched\t', player1.newPlayerID, player2.newPlayerID);

    player1.connection.send(JSON.stringify({ type: "matchFound", playerID: 0 }));
    player2.connection.send(JSON.stringify({ type: "matchFound", playerID: 1 }));
  }
}

function addToWaitingList(playerID, connection) {
  const player = {
    connection: connection,
    newPlayerID: playerID,
    connectionTime: new Date()
  };
  waitingList.push(player);
}

//! DEBUG

function  Routine() {
  // console.log('\x1b[1A\x1b[K\x1b[1A\x1b[K\x1b[1A\x1b[K\x1b[1A\x1b[K\x1b[1A\x1b[K');
  if (playerCounter > 0){
      console.log(new Date().toLocaleTimeString(),'\x1b[36m\tROUTINE\x1b[0m : ');
      console.log('\x1b[32m\t\t\tMATCHMAKING :\t', waitingList.length, ' users waiting for a game\x1b[0m');
      console.log('\x1b[35m\t\t\tUSERS       :\t', playerCounter, " id's given\x1b[0m");
      console.log('\x1b[33m\t\t\tMATCHES     :\t', games.length, '\x1b[0m');
      games.forEach(element => {
        console.log('\t\t[\x1b[36m', element.players[0].newPlayerID, '\x1b[0m:', element.gameState.scores.left, '] - [\x1b[36m', element.players[1].newPlayerID, '\x1b[0m:', element.gameState.scores.right, ']');  });
      console.log();
  }
}

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0'})
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
