import {broadcastState, stopSetInterval} from "./index.js";

class Tournament {
    constructor()
    {
        this.tournamentData = 
        {
            
            brackets: [],
            final: [],
            quarter: [],
            winner: [],
            semi: [],
            type : "",
            id : "back-tournament",
            round : 0,
        };
        this.contestants = ["Player 1", "Bob", "Charlie", "Dave", "Eve", "Frank", "Grace", "Hank"];
    }
  
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
  
    playMatch(player1, player2)
    {
        let winner = Math.random() > 0.5 ? player1 : player2;
        return winner;
    }

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
  }

export {Tournament};