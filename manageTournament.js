import broadcastState from "./index.js";

class Tournament {
    constructor()
    {
        this.tournamentData = 
        {
            tournament: ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank", "Grace", "Hank", "-","-","-", "-", "-", "-","-"],
        };
        this.contestants = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank", "Grace", "Hank"];
        this.round = 0;
    }
  
    generateMatches()
    {
        let contestants = this.contestants;
        if (contestants.length > 1)
        {
            let nextRound = [];
            for (let i = 0; i < contestants.length; i += 2)
            {
                if (i + 1 < contestants.length)
                {
                    let winner = this.playMatch(contestants[i], contestants[i + 1]);
                    nextRound.push(winner);
                } 
            }
            this.contestants = nextRound;
        }
    }
  
    playMatch(player1, player2)
    {
        let winner = Math.random() > 0.5 ? player1 : player2;
        // console.log(`${player1} vs ${player2} → Winner: ${winner}`);
        return winner;
    }

    updateTournament()
    {
        this.generateMatches();
        if (this.round === 0)
        {
            this.tournamentData.tournament[8] = this.contestants[0];
            this.tournamentData.tournament[9] = this.contestants[1];
            this.tournamentData.tournament[10] = this.contestants[2];
            this.tournamentData.tournament[11] = this.contestants[3];
        }
        else if (this.round === 1)
        {
            this.tournamentData.tournament[12] = this.contestants[0];
            this.tournamentData.tournament[13] = this.contestants[1];
        }
        else if (this.round === 2)
        {
            this.tournamentData.tournament[14] = this.contestants[0];
        }
        this.round++;
    }

    handleTournamentMessage(data, players)
    {
        if (data.type === "start")
            broadcastState(players, this.tournamentData);
        else if (data.type === "next round")
        {
            this.updateTournament();
            broadcastState(players, this.tournamentData);
        }
    }
  }

export {Tournament};