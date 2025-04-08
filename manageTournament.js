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
  
    playMatch(player1, player2)
    {
        let winner = Math.random() > 0.5 ? player1 : player2;
        return winner;
    }

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

    initializeTournament(players)
    {
        let list = [];
        for (let i = 0; i < players.length; i++)
        {
            list.push(players[i].id);
        }
        while (list.length > 0)
        {
            let element = this.getRandomUniqueElement(list);
            this.tournamentData.current_round.push(element);
        }
        for (let i = 0; i < this.tournamentData.current_round.length; i++)
        {
            this.tournamentData.brackets.push(this.tournamentData.current_round[i]);
        }
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
        broadcastState(players, this.tournamentData);
    }

    sendDrawTournamentTable(players, connection)
    {
        if (this.tournamentData.round === 0 && this.tournamentData.current_round.length === 0)
        {
            this.initializeTournament(players);
        }
        this.tournamentData.type = "back_tournamentTable_draw";
        connection.send(JSON.stringify(this.tournamentData))
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

// generateMatches()
// {
//     let contestants = this.contestants;
//     if (contestants.length > 1)
//     {
//         let nextRound = [];
//         for (let i = 0; i < contestants.length; i += 2)
//         {
//             if (i + 1 < contestants.length)
//             {
//                 let winner = this.playMatch(contestants[i], contestants[i + 1]);
//                 nextRound.push(winner);
//             } 
//         }
//         this.contestants = nextRound;
//     }
// }

// updateTournament()
// {
//     this.generateMatches();
//     if (this.tournamentData.round === 0)
//     {
//         this.tournamentData.brackets[8] = this.contestants[0];
//         this.tournamentData.brackets[9] = this.contestants[1];
//         this.tournamentData.brackets[10] = this.contestants[2];
//         this.tournamentData.brackets[11] = this.contestants[3];
//     }
//     else if (this.tournamentData.round === 1)
//     {
//         this.tournamentData.brackets[12] = this.contestants[0];
//         this.tournamentData.brackets[13] = this.contestants[1];
//     }
//     else if (this.tournamentData.round === 2)
//     {
//         this.tournamentData.brackets[14] = this.contestants[0];
//     }
//     this.tournamentData.round++;
// }

// for (let i = 0; i < this.tournamentData.current_round.length; i += 2)
    // {
        // if (this.tournamentData.current_round[i] === "Player 1" || this.tournamentData.current_round[i + 1] === "Player 1")
        // {
        // if (winner === "left")
        // {
            // if (this.tournamentData.current_round[i] === "Player 1")
                // this.tournamentData.next_round.push(this.tournamentData.current_round[i]);
            // else
                // this.tournamentData.next_round.push(this.tournamentData.current_round[i+1]);
        // }
        // else if (winner === "right")
        // {
            // if (this.tournamentData.current_round[i] === "Player 1")
                // this.tournamentData.next_round.push(this.tournamentData.current_round[i + 1]);
            // else
                // this.tournamentData.next_round.push(this.tournamentData.current_round[i]);
        // }
        // }
        // else
        // {
        //     let winner = this.playMatch(this.tournamentData.current_round[i], this.tournamentData.current_round[i + 1]);
        //     this.tournamentData.next_round.push(winner);
        // }
    // }

    // for (let i = 0; i < this.tournamentData.next_round.length; i++)
    // {
        // this.tournamentData.brackets.push(this.tournamentData.next_round[i]);
    // }

    // this.tournamentData.current_round = this.tournamentData.next_round;
    // this.tournamentData.next_round = [];
    // this.tournamentData.round++;