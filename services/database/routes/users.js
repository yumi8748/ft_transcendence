async function usersRoutes(fastify, options) {
    // Get all users
    fastify.get('/users', async (request, reply) => {
      const users = fastify.sqlite.prepare(
        'SELECT id, name, avatar, register_time, status FROM users'
      ).all();
      return users;
    });
    
    fastify.get('/users/all', async (request, reply) => {
      const users = fastify.sqlite.prepare(
        'SELECT * from users'
      ).all();
      return users;
    });
  
    // Create a new user
    fastify.post('/users', async (request, reply) => {
      const { username, password, avatar } = request.body;
  
      if (!username || !password || !avatar) {
        return reply.status(400).send({ message: "All fields are required" });
      }
  
      const validAvatars = [
        'boy.png', 
        'cat.png', 
        'default.png', 
        'dog.png', 
        'girl.png'
      ];
      
      //if (!validAvatars.includes(avatar)) {
      //  return reply.status(400).send({ error: 'Invalid avatar selected.' });
      //}
  
      try {
        // check if user already exists
        const existingUser = fastify.sqlite.prepare(
            'SELECT * FROM users WHERE name = ?'
        ).get(username);
        if (existingUser) {
            return reply.status(400).send({ error: "User already exists." });
        }


        // insert the user into the database
        fastify.sqlite.prepare(
            'INSERT INTO users (name, password, avatar) VALUES (?, ?, ?)'
        ).run(username, password, avatar);

        return reply.send({ message: 'User registered successfully!' });

    } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
});

    // fetch a specific user

    fastify.get('/users/:name', async (request, reply) => {
      try {
          const { name } = request.params;
          const user = fastify.sqlite.prepare(
              'SELECT * FROM users WHERE name = ?'
          ).get(name);

          if (!user) {
              return reply.status(404).send({ error: "User not found" });
          }

          return reply.send(user);
      } catch (error) {
          console.error(error);
          return reply.status(500).send({ error: "Internal Server Error" });
      }
  });
}
  export default usersRoutes;
  