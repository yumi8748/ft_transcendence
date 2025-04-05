import {broadcastState} from "./index.js";

class Tournament {
    constructor()
    {
        this.tournamentData = 
        {
            
            brackets: [],
            // final: [],
            // quarter: [],
            // winner: [],
            // semi: [],
            current_round: [],
            next_round: [],
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

    updateResults(winner)
    {
        for (let i = 0; i < this.tournamentData.current_round.length; i += 2)
        {
            if (this.tournamentData.current_round[i] === "Player 1" || this.tournamentData.current_round[i + 1] === "Player 1")
            {
                if (winner === "left")
                {
                    if (this.tournamentData.current_round[i] === "Player 1")
                        this.tournamentData.next_round.push(this.tournamentData.current_round[i]);
                    else
                        this.tournamentData.next_round.push(this.tournamentData.current_round[i+1]);
                }
                else if (winner === "right")
                {
                    if (this.tournamentData.current_round[i] === "Player 1")
                        this.tournamentData.next_round.push(this.tournamentData.current_round[i + 1]);
                    else
                        this.tournamentData.next_round.push(this.tournamentData.current_round[i]);
                }
            }
            else
            {
                let winner = this.playMatch(this.tournamentData.current_round[i], this.tournamentData.current_round[i + 1]);
                this.tournamentData.next_round.push(winner);
            }
        }

        for (let i = 0; i < this.tournamentData.next_round.length; i++)
        {
            this.tournamentData.brackets.push(this.tournamentData.next_round[i]);
        }

        if (this.tournamentData.round === 2)
            this.tournamentData.current_round = [];
        else
            this.tournamentData.current_round = this.tournamentData.next_round;
        this.tournamentData.next_round = [];
        this.tournamentData.round++;
    }

    getRandomUniqueElement(array)
    {
        const index = Math.floor(Math.random() * array.length);
        return array.splice(index, 1)[0];
    }

    initializeTournament()
    {
        let list = [...this.contestants];
        while (list.length > 0)
        {
            let element = this.getRandomUniqueElement(list);
            this.tournamentData.current_round.push(element);
        }
        for (let i = 0; i < this.tournamentData.current_round.length; i++)
        {
            this.tournamentData.brackets.push(this.tournamentData.current_round[i]);
        }
    }
  }

export {Tournament};