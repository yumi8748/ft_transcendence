class Tournament {
    constructor(contestants) {
        this.contestants = contestants;
    }
  
    generateMatches() {
        let contestants = this.contestants;
  
        if (contestants.length > 1) {
            let nextRound = [];
  
            for (let i = 0; i < contestants.length; i += 2) {
                if (i + 1 < contestants.length) {
                    let winner = this.playMatch(contestants[i], contestants[i + 1]);
                    nextRound.push(winner);
                } 
            }
            this.contestants = nextRound;
        }
    }
  
    playMatch(player1, player2) {
        let winner = Math.random() > 0.5 ? player1 : player2;
        // console.log(`${player1} vs ${player2} → Winner: ${winner}`);
        return winner;
    }
  }

export {Tournament};