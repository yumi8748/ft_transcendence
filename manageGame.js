import {startSetInterval, broadcastState, stopSetInterval} from "./index.js";
// leave 10 pixels of space between the paddle and the edge of the screen

class Game {
    constructor()
    {
        this.gameState = {
            id: "back-game",
            paddles: [ { y: 10, playerID: 0, side: "left" }, { y: 10, playerID: 0, side: "right" } ],
            ball: { x: 300, y: 200, vx: 4, vy: 4 },
            scores: {left: 0, right: 0},
            gameStart : false,
            // gameOver : false,
            home: false
        };
    }
  
    updateGame()
    {
        if (this.gameState.scores.left >= 2 || this.gameState.scores.right >= 2)
        {
            this.gameState.gameStart = false;
            stopSetInterval();
        }
        if (this.gameState.gameStart)
        {
            this.gameState.ball.x += this.gameState.ball.vx;
            this.gameState.ball.y += this.gameState.ball.vy;
            if (this.gameState.ball.y <= 10 || this.gameState.ball.y >= 390)
                this.gameState.ball.vy *= -1;
            if (this.gameState.ball.x <= 10) 
            {
                this.gameState.scores.right += 1;
                this.resetBall();
            } 
            else if (this.gameState.ball.x >= 590)
            {
                this.gameState.scores.left++;
                this.resetBall();
            }
            if (this.gameState.ball.x == 20 && this.gameState.ball.y >= this.gameState.paddles[0].y && this.gameState.ball.y <= this.gameState.paddles[0].y + 80)
                this.gameState.ball.vx *= -1;
            if (this.gameState.ball.x == 580 && this.gameState.ball.y >= this.gameState.paddles[1].y && this.gameState.ball.y <= this.gameState.paddles[1].y + 80)
                this.gameState.ball.vx *= -1;
        }
    }

    resetBall()
    {
        this.gameState.ball.x = 300;
        this.gameState.ball.y = 200;
        this.gameState.ball.vx = Math.random() < 0.5 ? 4 : -4;
        this.gameState.ball.vy = Math.random() < 0.5 ? 4 : -4;
    }
  }

export {Game};