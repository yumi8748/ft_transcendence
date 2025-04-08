import {broadcastState} from "./index.js";
// leave 10 pixels of space between the paddle and the edge of the screen

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
    }
  
    updateGame()
    {
        if (this.gameState.scores.left >= 2 || this.gameState.scores.right >= 2)
        {
            this.gameState.gameStart = false;
            this.stopSetInterval();
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
        this.startSetInterval(connection); 
    }

    sendDrawGame(connection)
    {
        this.gameState.type = "back_game_draw";
        connection.send(JSON.stringify(this.gameState))
    }
  }

export {Game};

  // sendDrawMessage(players, tournament)
    // {
    //     // this.gameState.type = "back-game-draw-game";
    //     let index = (tournament.tournamentData.current_games * 2);
    //     players.forEach(player => 
    //     {
    //         if (player.id === tournament.tournamentData.current_round[index] || player.id === tournament.tournamentData.current_round[index + 1])
    //         {
    //             player.send(JSON.stringify(this.gameState))
    //         }
    //     }
    //     );
    // }


        // sendNextMessage(players, tournament)
    // {
    //     if (tournament.tournamentData.round <= 1)
    //     {
    //         tournament.updateResults(this.gameState.scores.left, this.gameState.scores.right);
    //     }
    //     tournament.tournamentData.type = "back-game-draw-tournament";
    //     this.gameState.scores.left = 0;
    //     this.gameState.scores.right = 0;
    //     this.gameState.gameStart = false;
    //     broadcastState(players, tournament.tournamentData);
    // }