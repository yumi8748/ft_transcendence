async function tournamentsRoutes(fastify, options) {
    // Get all tournaments
    fastify.get('/tournaments', async (request, reply) => {
        const tournaments = fastify.sqlite.prepare(
            'SELECT id, name, status, created_at FROM tournaments'
        ).all();
        return tournaments;
    });

    // Get all matches for a specific tournament
    fastify.get('/tournaments/:id', async (request, reply) => {
        const { id } = request.params;
        const tournament = fastify.sqlite.prepare(
            'SELECT * FROM tournaments WHERE id = ?'
        ).get(id);

        if (!tournament) {
            return reply.status(404).send({ error: 'Tournament not found' });
        }

        const matches = fastify.sqlite.prepare(`
            SELECT tm.round, m.id, u1.name AS player1, u2.name AS player2, 
                   m.player1_score, m.player2_score
            FROM tournament_matches tm
            JOIN matches m ON tm.match_id = m.id
            JOIN users u1 ON m.player1_id = u1.id
            JOIN users u2 ON m.player2_id = u2.id
            WHERE tm.tournament_id = ?
            ORDER BY tm.round
        `).all(id);

        return { tournament, matches };
    });

    // Create a new tournament
    fastify.post('/tournaments', async (request, reply) => {
        const { name } = request.body;

        if (!name) {
            return reply.status(400).send({ error: 'Tournament name is required.' });
        }

        try {
            const stmt = fastify.sqlite.prepare(
                'INSERT INTO tournaments (name) VALUES (?)'
            );
            const result = stmt.run(name);
            return { id: result.lastInsertRowid, name, status: 'pending' };
        } catch (error) {
            return reply.status(500).send({ error: 'Failed to create tournament.' });
        }
    });

    // Add a match to a tournament
    fastify.post('/tournaments/:id/matches', async (request, reply) => {
        const { id } = request.params;
        const { match_id, round } = request.body;

        if (!match_id || !round) {
            return reply.status(400).send({ error: 'Match ID and round are required.' });
        }

        try {
            fastify.sqlite.prepare(`
                INSERT INTO tournament_matches (tournament_id, match_id, round) 
                VALUES (?, ?, ?)
            `).run(id, match_id, round);

            return { message: 'Match added to tournament!' };
        } catch (error) {
            return reply.status(500).send({ error: 'Failed to add match to tournament.' });
        }
    });
}



export default tournamentsRoutes;