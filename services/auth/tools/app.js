const fastify = require('fastify')(
    {logger: true}
);

//fake db to replace with real db
//access to the real db will be made through await to asynchronously fetch data from it
const users = [
    { username: 'test', password: 'testpass' },
    { username: 'admin', password: 'adminpass' }
];

//simple register handler demo function
async function registerHandler(request, reply)
{
    console.log('in register');
    const { username, password } = request.body;

    const userExist = users.find(u => u.username === username);
    if (userExist) {
        return reply.status(400).send({ message: 'Invalid username !'});
    }

    users.push({ username, password }); //add to the users
    reply.send({ message: 'User created successfully !'});
};

fastify.post('/register', registerHandler);

//simple login route demo using arrow
fastify.post('/login', async (request, reply) => {
        console.log('in login');
        const {username, password} = request.body;
        
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            reply.send({ message: 'Auth successfull !' });
        } else {
            reply.status(401).send({ message: 'Invalid !' });
        }
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