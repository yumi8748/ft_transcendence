//fastify server instance
const fastify = require('fastify')(
    {logger: true}
);
//bcrypt for password hashing
const bcrypt = require('bcrypt');

//fake db to replace with real db
//access to the real db will be made through await to asynchronously fetch data from it
const users = [
    { username: 'test', password: 'testpass' },
    { username: 'admin', password: 'adminpass' }
];
//salt for hashing
const salt = 10;

//simple register handler demo function
async function registerHandler(request, reply)
{
    console.log('in register');
    const { username, password } = request.body;

    const userExist = users.find(u => u.username === username);
    if (userExist) {
        return reply.status(400).send({ message: 'Invalid username !'});
    }

    const hashedPass = await bcrypt.hash(password, salt);
    console.log(hashedPass);
    users.push({ username: username, password: hashedPass }); //add to the users
    reply.send({ message: 'User created successfully !'});
};

fastify.post('/register',{
    schema: {
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' }
        }
      }
    }
    }, registerHandler);

//simple login route demo using arrow
fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' }
        }
      }
    }
    }, async (request, reply) => {
        const {username, password} = request.body;
        
        //find user in db
        const user = users.find(u => u.username === username);
        if (!user) {
           return reply.status(400).send({ message: 'Invalid username or password !' });
        }
        //match the password
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return reply.status(400).send({ message: 'Invalid username or password !' });
        }
        //logic goes here
        return reply.status(200).send({ message: 'Authentification successfull !'});
    }
);

fastify.get('/test', async (request, reply) => {
    console.log('Test route triggered');
    return { hello: 'world' };
  });

//start the server
const start = async () => {
    try {
        await fastify.listen({host: '0.0.0.0',  port: 3000});
        console.log('auth running and listening on port 3000');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

start();