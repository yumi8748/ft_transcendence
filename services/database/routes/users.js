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
      const { username, password, email, avatar } = request.body;
  
      if (!username || !password || !avatar || !email) {
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
            'INSERT INTO users (name, password, email, avatar) VALUES (?, ?, ?, ?)'
        ).run(username, password, email, avatar);

        const userid = fastify.sqlite.prepare('SELECT id FROM users WHERE name = ?').get(username);
        return reply.send({ message: 'User registered successfully!', userid: userid.id });

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

  // update a specific user
  fastify.post('/users/:name', async (request, reply) => {
		try {
			const { name } = request.params;
			console.log(name, 'is trying to update info');
			const parts = request.parts();
			for await (const part of parts) {
				console.log(part.fieldname, part.value);
				if (part.fieldname === 'password') {
					const hashedPassword = await bcrypt.hash(part.value, 10);
					fastify.sqlite.prepare(
						`UPDATE users SET password = ? WHERE name = ?`
					).run(hashedPassword, name);
				}
				else if (part.fieldname === 'email') {
					fastify.sqlite.prepare(
						`UPDATE users SET email = ? WHERE name = ?`
					).run(part.value, name);
				}
			}
			return reply.status(200).send({ message: `Updated info for ${name}` });
		} catch (error) {
			console.error(error);
			return reply.status(500).send({ error: "Internal Server Error" });
		}
	})
}
  export default usersRoutes;
  