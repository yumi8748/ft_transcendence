async function usersRoutes(fastify, options) {
    // Get all users
    fastify.get('/users', async (request, reply) => {
      const users = fastify.sqlite.prepare(
        'SELECT id, name, avatar, register_time FROM users'
      ).all();
      return users;
    });
  
    // Create a new user
    fastify.post('/users', async (request, reply) => {
      const { name, password, avatar } = request.body;
  
      if (!name || !password) {
        return reply.status(400).send({ error: 'Username and password are required.' });
      }
  
      const validAvatars = [
        '/avatars/boy.png', 
        '/avatars/cat.png', 
        '/avatars/default.png', 
        '/avatars/dog.png', 
        '/avatars/girl.png'
      ];
      
      if (!validAvatars.includes(avatar)) {
        return reply.status(400).send({ error: 'Invalid avatar selected.' });
      }
  
      try {
        // Insert new user into the database
        fastify.sqlite.prepare(
          'INSERT INTO users (name, password, avatar) VALUES (?, ?, ?)'
        ).run(name, password, avatar);
  
        return { message: 'User registered!' };
      } catch (error) {
        return reply.status(400).send({ error: 'User already exists or invalid input.' });
      }
    });
  }
  
  export default usersRoutes;
  