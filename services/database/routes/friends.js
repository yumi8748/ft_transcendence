async function friendsRoutes(fastify, options) {
  const db = fastify.sqlite;

  // get friend's info
  fastify.get('/friends', async (request, reply) => {
  try {
    //const token = request.headers.authorization?.split(' ')[1];
    //console.log('Received token:', token);
//
    //const decoded = fastify.jwt.verify(token);
    //console.log('Decoded token:', decoded);
    // once the verify route is called, it sends back a header containing the username extracted from the token, this header is forwarded by nginx to protected routes, and can be retrieved as such:
    const username = request.headers['x-username'];
    console.log('Username from headers:', username);

    //const currentUser = fastify.sqlite.prepare(`SELECT id FROM users WHERE name = ?`).get(decoded.name);
    const currentUser = fastify.sqlite.prepare(`SELECT id FROM users WHERE name = ?`).get(username);
    
    console.log('Current user:', currentUser);
    if (!currentUser) {
      return reply.status(404).send({ error: 'Current user not found' });
    }

    const query = `
      SELECT 
        u.name AS username,
        u.avatar AS avatar_url,
        u.status
      FROM friends f
      JOIN users u ON u.id = f.friend_id
      WHERE f.user_id = ? AND f.status = 'accepted'
    `;
    const friends = fastify.sqlite.prepare(query).all(currentUser.id);
    console.log('Friends found:', friends);

    reply.send(friends);
  } catch (error) {
    console.error('Error in /friends route:', error);
    reply.status(500).send({ error: 'Failed to fetch friends' });
  }
});


  // Add a friend
  fastify.post('/friends', async (request, reply) => {
    const { username } = request.body;
  
    if (!username) {
      return reply.status(400).send({ message: 'Username is required' });
    }
  
    try {
      const friend = db.prepare('SELECT id FROM users WHERE name = ?').get(username);
      if (!friend) {
        return reply.status(404).send({ message: 'User not found' });
      }
  
      // avoid repetition
      const existing = db.prepare('SELECT * FROM friends WHERE user_id = ? AND friend_id = ?')
        .get(request.user.id, friend.id);
      if (existing) {
        return reply.status(400).send({ message: 'Already added as friend' });
      }
  
      db.prepare('INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)')
        .run(request.user.id, friend.id, 'offline');
  
      reply.send({ message: 'Friend added' });
    } catch (error) {
      console.error('Error adding friend:', error);
      reply.status(500).send({ message: 'Error adding friend' });
    }
  });
}
export default friendsRoutes;
