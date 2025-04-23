class Game {
    constructor()
    {
        this.gameState = {
            paddles: [ { y: 10, playerID: 0, side: "left" }, { y: 10, playerID: 0, side: "right" } ],
            ball: { x: 300, y: 200, vx: 4, vy: 4 },
            scores: {left: 0, right: 0},
            gameStart : false,
            type: "",
            intervalId: ""
        };

        this.gameData = {
            player1_id: 1,
            player2_id: 2,
            player1_score: 0,
            player2_score: 0,
            game_start_time: null,
            game_end_time: null
          };
    }
  
    updateGame()
    {
        if (this.gameState.scores.left >= 5 || this.gameState.scores.right >= 5)
        {
            this.gameState.gameStart = false;
            this.stopSetInterval();
            this.saveGame();
        }
        if (this.gameState.gameStart)
        {
            this.gameState.ball.x += this.gameState.ball.vx;
            this.gameState.ball.y += this.gameState.ball.vy;
            if (this.gameState.ball.y <= 10 || this.gameState.ball.y >= 390)
                this.gameState.ball.vy *= -1;
            if (this.gameState.ball.x <= 11) 
            {
                this.gameState.scores.right += 1;
                this.resetBall();
            } 
            else if (this.gameState.ball.x >= 589)
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

    startSetInterval(connection)
    {
        this.intervalId = setInterval(() => 
        {
            this.updateGame();
            connection.send(JSON.stringify(this.gameState))
        }, 30);
    }

    stopSetInterval()
    {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    updatePaddlePosition(data)
    {
        if (data.sKey === true && this.gameState.paddles[0].y < 310)
            this.gameState.paddles[0].y += 10;
        if (data.wKey === true && this.gameState.paddles[0].y > 10)
            this.gameState.paddles[0].y -= 10;
        if (data.lKey === true && this.gameState.paddles[1].y < 310)
            this.gameState.paddles[1].y += 10;
        if (data.oKey === true && this.gameState.paddles[1].y > 10)
            this.gameState.paddles[1].y -= 10;
    }

    sendHomeGame(connection)
    {
        this.gameState.scores.left = 0;
        this.gameState.scores.right = 0;
        this.gameState.gameStart = false;
        this.gameState.type = "back_game_home";
        connection.send(JSON.stringify(this.gameState))
    }

    sendStartGame(connection)
    {
        this.gameState.type = "back_game_position";
        this.gameState.gameStart = true;
        this.gameData.game_start_time = new Date().toISOString();
        this.startSetInterval(connection); 
    }

    sendDrawGame(connection)
    {
        this.gameState.type = "back_game_draw";
        connection.send(JSON.stringify(this.gameState))
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
  }

export {Game};