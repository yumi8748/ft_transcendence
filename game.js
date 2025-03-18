function updateGame(gameState, players)
{
    if (gameState.scores.left >= 5 || gameState.scores.right >= 5)
    {
        gameState.gameStart = false;
    }
    if (gameState.gameStart)
    {
        gameState.ball.x += gameState.ball.vx;
        gameState.ball.y += gameState.ball.vy;
        if (gameState.ball.y <= 10 || gameState.ball.y >= 390)
            gameState.ball.vy *= -1;
        if (gameState.ball.x <= 10) 
        {
            gameState.scores.right += 1;
            resetBall(gameState);
        } 
        else if (gameState.ball.x >= 590)
        {
            gameState.scores.left++;
            resetBall(gameState);
        }
        if (gameState.ball.x == 20 && gameState.ball.y >= gameState.paddles[0].y && gameState.ball.y <= gameState.paddles[0].y + 80)
            gameState.ball.vx *= -1;
        if (gameState.ball.x == 580 && gameState.ball.y >= gameState.paddles[1].y && gameState.ball.y <= gameState.paddles[1].y + 80)
            gameState.ball.vx *= -1;
        broadcastState(players, gameState);
    }
}

function resetBall(gameState) {
  // generate v of ball to a direction ++ +- -+ --
  // set vx randomly to 4 or -4
  gameState.ball.x = 300;
  gameState.ball.y = 200;
  gameState.ball.vx = Math.random() < 0.5 ? 4 : -4;
  gameState.ball.vy = Math.random() < 0.5 ? 4 : -4;
}

function broadcastState(players, gameState)
{
    players.forEach(player => player.send(JSON.stringify(gameState)));
}

export {updateGame, broadcastState};