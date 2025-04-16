// services/auth/plugins/friendsRoutes.js
export async function friendsRoutes(fastify, options) {
    fastify.get('/friends', async (request, reply) => {
      try {
        const res = await fastify.http.get('http://database:3001/friends');
        return res.data;
      } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: 'Failed to load friends' });
      }
    });
  
    fastify.post('/friends', async (request, reply) => {
      try {
        const res = await fastify.http.post('http://database:3001/friends', request.body);
        return res.data;
      } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: 'Failed to add friend' });
      }
    });
  }
  