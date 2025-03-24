async function matchesRoutes(fastify, options) {
    // Get all match records
    fastify.get('/matches', async (request, reply) => {
      const matches = fastify.sqlite.prepare(`
        SELECT 
          m.id, 
          u1.name AS player1, 
          u2.name AS player2, 
          m.player1_score, 
          m.player2_score, 
          m.game_start_time, 
          m.game_end_time 
        FROM matches m
        JOIN users u1 ON m.player1_id = u1.id
        JOIN users u2 ON m.player2_id = u2.id
      `).all();
      
      return matches;
    });
  
    //anothertruct
    // Record a new match
    fastify.post('/matches', async (request, reply) => {
      console.log(request.body);
      const { player1_id, player2_id, player1_score, player2_score, game_start_time, game_end_time } = request.body;
      const formattedGameStartTime = new Date(game_start_time).toISOString().replace("T", " ").replace("Z", "");
      const formattedGameEndTime = new Date(game_end_time).toISOString().replace("T", " ").replace("Z", "");
      // console.log(player1_id, typeof player1_id);
      // console.log(player2_id, typeof player2_id);
      // console.log(player1_score, typeof player1_score);
      // console.log(player2_score, typeof player2_score);
      // console.log(formattedGameStartTime, typeof formattedGameStartTime);
      // console.log(formattedGameEndTime, typeof formattedGameEndTime);
      try {
        // Insert new match into the database
        fastify.sqlite.prepare(`
          INSERT INTO matches (player1_id, player2_id, player1_score, player2_score, game_start_time, game_end_time) 
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(player1_id, player2_id, player1_score, player2_score, formattedGameStartTime, formattedGameEndTime);
  
        return { message: 'Match recorded!' };
      } catch (error) {
        console.error('Database Error:', error.message);
        return reply.status(400).send({ error: `Failed to record match, details: ${error.message}` });
      }
    });
  }
  
  export default matchesRoutes;
  