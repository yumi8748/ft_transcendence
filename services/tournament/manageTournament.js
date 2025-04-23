import {broadcastState} from "./index.js";

class Tournament {
    constructor()
    {
        this.tournamentData = 
        {
            brackets: [],
            current_round: [],
            next_round: [],
            type : "",
            round : 0,
            current_games: 0,
            waiting: true,

        };
        this.gameState = {
            paddles: [ { y: 10, playerID: 0, side: "left" }, { y: 10, playerID: 0, side: "right" } ],
            ball: { x: 300, y: 200, vx: 4, vy: 4 },
            scores: {left: 0, right: 0},
            gameStart : false,
            type: "",
            intervalId: ""
        };
        this.contestants = ["Alice", "Bob", "Charlie", "Dave"];
    }
  
    // TOURNAMENT TABLE

    updateResults(score_left, score_right)
    {
        let index = (this.tournamentData.current_games) * 2;
        if (score_left === 2)
        {
            this.tournamentData.next_round.push(this.tournamentData.current_round[index]);
            this.tournamentData.brackets.push(this.tournamentData.next_round[this.tournamentData.current_games]);
        }
        else if (score_right === 2)
        {
            this.tournamentData.next_round.push(this.tournamentData.current_round[index + 1]);
            this.tournamentData.brackets.push(this.tournamentData.next_round[this.tournamentData.current_games]);
        }
        if (this.tournamentData.round === 0 && this.tournamentData.current_games === 1)
        {
            this.tournamentData.round = 1;
            this.tournamentData.current_games = 0;
            this.tournamentData.current_round = this.tournamentData.next_round;
            this.tournamentData.next_round = [];
        }
        else if (this.tournamentData.round === 1 && this.tournamentData.current_games === 0)
        {
            this.tournamentData.round = 2;
            this.tournamentData.current_round = this.tournamentData.next_round;
            this.tournamentData.next_round = [];
        }
        else
            this.tournamentData.current_games++;
    }

    getRandomUniqueElement(array)
    {
        const index = Math.floor(Math.random() * array.length);
        return array.splice(index, 1)[0];
    }

    addPlayer(playerid)
    {
        this.tournamentData.current_round.push(playerid);
        this.tournamentData.brackets.push(playerid);
        this.tournamentData.current_games = 0;
    }

    sendHomeTournamentTable(players)
    {
        this.tournamentData.type = "back-tournament-home";
        this.tournamentData.brackets = [];
        this.tournamentData.next_round = [];
        this.tournamentData.current_round = [];
        this.tournamentData.round = 0;
        this.tournamentData.current_games = 0;
        this.tournamentData.waiting === true;
        broadcastState(players, this.tournamentData);
        players = [];
    }

    sendDrawTournamentTable(players, connection)
    {
        if (this.tournamentData.waiting === true)
        {
            this.addPlayer(connection.id);
        }
        if (this.tournamentData.current_round.length === 4)
        {
            // console.log("C BON")
            this.tournamentData.waiting = false;
        }

        this.tournamentData.type = "back_tournamentTable_draw";
        // connection.send(JSON.stringify(this.tournamentData))
        broadcastState(players, this.tournamentData);
    }

    sendNextTournamentTable(players)
    {
        if (this.tournamentData.round <= 1)
        {
            
            this.gameState.type = "back_tournamentTable_next";
            let index = (this.tournamentData.current_games * 2);
            players.forEach(player => 
            {
                if (player.id === this.tournamentData.current_round[index] || player.id === this.tournamentData.current_round[index + 1])
                {
                    player.send(JSON.stringify(this.gameState))
                }
            }
            );
        }
    }

    // TOURNAMENT GAME

    sendStartTournamentGame(players)
    {
        this.gameState.type = "back_tournamentGame_position";
        this.gameState.gameStart = true;
        this.startSetInterval(players); 
    }

    sendNextTournamentGame(players)
    {
        if (this.tournamentData.round <= 1)
        {
            this.updateResults(this.gameState.scores.left, this.gameState.scores.right);
        }
        this.tournamentData.type = "back_tournamentTable_draw";
        this.gameState.scores.left = 0;
        this.gameState.scores.right = 0;
        this.gameState.gameStart = false;
        broadcastState(players, this.tournamentData);
    }

    updatePaddlePosition(data, playerId)
    {
        let index = (this.tournamentData.current_games * 2);
        if (playerId === this.tournamentData.current_round[index])
        {
            if (data.sKey === true && this.gameState.paddles[0].y < 310)
                this.gameState.paddles[0].y += 10;
            if (data.wKey === true && this.gameState.paddles[0].y > 10)
                this.gameState.paddles[0].y -= 10;
        }
        else
        {
            if (data.lKey === true && this.gameState.paddles[1].y < 310)
                this.gameState.paddles[1].y += 10;
            if (data.oKey === true && this.gameState.paddles[1].y > 10)
                this.gameState.paddles[1].y -= 10;
        }
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

    startSetInterval(players)
    {
        this.intervalId = setInterval(() => 
        {
            this.updateGame();
            let index = (this.tournamentData.current_games * 2);
            players.forEach(player => 
            {
                if (player.id === this.tournamentData.current_round[index] || player.id === this.tournamentData.current_round[index + 1])
                {
                    player.send(JSON.stringify(this.gameState))
                }
            })
        }, 30);
    }

    stopSetInterval()
    {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }
  }

export {Tournament};