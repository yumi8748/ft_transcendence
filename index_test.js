import Fastify from "fastify";
import path from 'node:path';
import fastifyWebsocket from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';
import { clearInterval } from 'node:timers';

class Game {
  constructor() {
    this.gameStatus = 'waiting';
    this.gameScoreLimit = 5; // Default value if localStorage not available on server
    this.gameSpeed = 4; // Default value
    this.gameState = {
      type: "update",
      paddles: [
        { y: 120, playerID: 0, side: "left" },
        { y: 120, playerID: 0, side: "right" }
      ],
      ball: { x: 300, y: 200, vx: this.gameSpeed, vy: this.gameSpeed },
      scores: { left: 0, right: 0 }
    };
    this.gameData = {
      player1_id: undefined,
      player2_id: undefined,
      player1_score: 0,
      player2_score: 0,
      game_start_time: null,
      game_end_time: null
    };
    this.players = [];
    this.refresh = null;
  }

  resetBall() {
    this.gameState.ball.x = 300;
    this.gameState.ball.y = 200;
    this.gameState.ball.vx = Math.random() < 0.5 ? this.gameSpeed : -this.gameSpeed;
    this.gameState.ball.vy = Math.random() < 0.5 ? this.gameSpeed : -this.gameSpeed;
  }
  
  broadcastState() {
    this.players.forEach(player => {
      if (player.socket.readyState === 1) { // Check if socket is open
        player.socket.send(JSON.stringify(this.gameState));
      }
    });
  }
  
  async saveGame() {
    this.gameData.player1_score = this.gameState.scores.left;
    this.gameData.player2_score = this.gameState.scores.right;
    this.gameData.game_end_time = new Date().toISOString();
    try {
      const response = await fetch('http://data-service:3001/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.gameData),
      });
      const data = await response.json();
      console.log("Game saved: ", data);
    } catch (error) {
      console.log("Failed to save game: ", error);
    }
  }
  
  updateGame() {
    if (this.gameState.scores.left >= this.gameScoreLimit ||
        this.gameState.scores.right >= this.gameScoreLimit) {
      this.gameStatus = 'ended';
      if (this.refresh) {
        clearInterval(this.refresh);
        this.refresh = null;
      }
      this.saveGame();
      
      // Notify players about game end
      const endMessage = {
        type: "gameEnd",
        winner: this.gameState.scores.left > this.gameState.scores.right ? "left" : "right",
        scores: this.gameState.scores
      };
      this.players.forEach(player => {
        if (player.socket.readyState === 1) {
          player.socket.send(JSON.stringify(endMessage));
        }
      });
      return;
    }
    
    if (this.gameStatus === 'playing') {
      // Update ball position
      this.gameState.ball.x += this.gameState.ball.vx;
      this.gameState.ball.y += this.gameState.ball.vy;
      
      // Check for wall collisions (top and bottom)
      if (this.gameState.ball.y <= 10 || this.gameState.ball.y >= 390) {
        this.gameState.ball.vy *= -1;
      }
      
      // Check if ball went past left paddle (right player scores)
      if (this.gameState.ball.x <= 10) {
        this.gameState.scores.right++;
        this.resetBall();
      } 
      // Check if ball went past right paddle (left player scores)
      else if (this.gameState.ball.x >= 590) {
        this.gameState.scores.left++;
        this.resetBall();
      }
      
      // Check for paddle collisions
      if (this.gameState.ball.x <= 20 && this.gameState.ball.x >= 15 && 
          this.gameState.ball.y >= this.gameState.paddles[0].y && 
          this.gameState.ball.y <= this.gameState.paddles[0].y + 80) {
        this.gameState.ball.vx *= -1;
      }
      
      if (this.gameState.ball.x >= 580 && this.gameState.ball.x <= 585 &&
          this.gameState.ball.y >= this.gameState.paddles[1].y && 
          this.gameState.ball.y <= this.gameState.paddles[1].y + 80) {
        this.gameState.ball.vx *= -1;
      }
      
      // Send updated state to all players
      this.broadcastState();
    }
  }

  start() {
    if (this.gameStatus === 'ready') {
      this.gameStatus = 'playing';
      this.gameData.game_start_time = new Date().toISOString();
      this.resetBall();
      
      // Start game loop
      this.refresh = setInterval(() => this.updateGame(), 30);
      
      // Notify players that game has started
      const startMessage = {
        type: "gameStart"
      };
      this.players.forEach(player => {
        if (player.socket.readyState === 1) {
          player.socket.send(JSON.stringify(startMessage));
        }
      });
    }
  }

  addPlayer(playerID, socket) {
    if (this.players.length < 2) {
      const playerSide = this.players.length === 0 ? "left" : "right";
      const playerIndex = this.players.length;
      
      this.players.push({
        id: playerID,
        socket: socket,
        side: playerSide
      });
      
      // Assign player ID to paddle
      this.gameState.paddles[playerIndex].playerID = playerID;
      
      // Update game data
      if (playerIndex === 0) {
        this.gameData.player1_id = playerID;
      } else {
        this.gameData.player2_id = playerID;
      }
      
      // If we have 2 players, game is ready to start
      if (this.players.length === 2) {
        this.gameStatus = 'ready';
        
        // Send ready message to all players
        const readyMessage = {
          type: "gameReady"
        };
        this.players.forEach(player => {
          player.socket.send(JSON.stringify(readyMessage));
        });
      }
      
      return true;
    }
    return false;
  }

  handlePlayerDisconnect(playerID) {
    const playerIndex = this.players.findIndex(player => player.id === playerID);
    if (playerIndex !== -1) {
      // Remove the player
      this.players.splice(playerIndex, 1);
      
      // If game was in progress, end it
      if (this.gameStatus === 'playing') {
        this.gameStatus = 'ended';
        if (this.refresh) {
          clearInterval(this.refresh);
          this.refresh = null;
        }
        this.saveGame();
      }
    }
  }

  updatePaddlePosition(playerID, y) {
    const player = this.players.find(p => p.id === playerID);
    if (player) {
      const paddleIndex = player.side === "left" ? 0 : 1;
      // Ensure paddle stays within boundaries
      this.gameState.paddles[paddleIndex].y = Math.max(0, Math.min(320, y));
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fastify = Fastify({logger: true});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
});

fastify.setNotFoundHandler((req, reply) => {
  console.log("Not found handler triggered");
  reply.sendFile('index.html');
});

fastify.register(fastifyWebsocket);

const gameManager = async (fastify) => {
  let games = [];
  let waitingGame = null;
  
  fastify.get('/game/ws', { websocket: true }, (connection, req) => {
    const { socket } = connection;
    if (!socket) {
      console.error("Socket not available");
      return;
    }
    const playerID = Math.random().toString(36).substring(2, 15);
    let currentGame = null;
    
    console.log(`New player connected: ${playerID}`);
    
    // Send initial connection confirmation
    socket.send(JSON.stringify({
      type: "connected",
      playerID: playerID
    }));
    
    // Find or create a game
    if (!waitingGame) {
      // Create a new game
      console.log("Creating a new waiting game...");
      waitingGame = new Game();
      games.push(waitingGame);
      waitingGame.addPlayer(playerID, socket);
      currentGame = waitingGame;
      
      socket.send(JSON.stringify({
        type: "waiting",
        message: "Waiting for another player..."
      }));
    } else {
      // Join the waiting game
      waitingGame.addPlayer(playerID, socket);
      currentGame = waitingGame;
      waitingGame = null; // No more waiting game
    }
    
    // Handle messages from the client
    socket.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case "paddleMove":
            if (currentGame) {
              currentGame.updatePaddlePosition(playerID, data.y);
            }
            break;
          
          case "startGame":
            if (currentGame && currentGame.gameStatus === 'ready') {
              currentGame.start();
            }
            break;
            
          case "setDifficulty":
            if (currentGame && currentGame.gameStatus === 'waiting') {
              currentGame.gameSpeed = data.speed || 4;
            }
            break;
            
          case "setScoreLimit":
            if (currentGame && currentGame.gameStatus === 'waiting') {
              currentGame.gameScoreLimit = data.limit || 5;
            }
            break;
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });
    
    // Handle client disconnection
    socket.on('close', () => {
      console.log(`Player disconnected: ${playerID}`);
      
      // if (currentGame) {
      //   currentGame.handlePlayerDisconnect(playerID);
        
      //   // If the game was a waiting game, clear it
      //   if (waitingGame === currentGame) {
      //     waitingGame = null;
      //   }
        
      //   // Remove ended games from the games array
      //   games = games.filter(game => game.gameStatus !== 'ended');
      // }
    });
  });
};

fastify.register(gameManager);

try {
  // Start the server
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
  console.log("Pong server is running on port 3000");
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}