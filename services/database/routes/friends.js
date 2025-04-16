async function friendsRoutes(fastify, options) {
  const db = fastify.sqlite;

  // get friend's info
  fastify.get('/friends', async (request, reply) => {
    try {
      const friends = db.prepare(`
        SELECT f.friend_id, u.name AS friend_name, u.avatar AS friend_avatar, f.status AS friend_status
        FROM friends f
        JOIN users u ON u.id = f.friend_id
        WHERE f.user_id = ?`)
        .all(request.user.id);
      reply.send(friends);
    } catch (error) {
      console.error('Error loading friends:', error);
      reply.status(500).send({ message: 'Error loading friends' });
    }
  });

  // Add a friend
  fastify.post('/friends', async (request, reply) => {
    const { user_id, friend_id, status } = request.body;
    try {
      db.prepare('INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)').run(request.user.id, friend_id, status);
      reply.send({ message: 'Friend added' });
    } catch (error) {
      console.error('Error adding friend:', error);
      reply.status(500).send({ message: 'Error adding friend' });
    }
  });
}

export default friendsRoutes;
