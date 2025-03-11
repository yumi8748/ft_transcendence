//fastify server instance
const fastify = require('fastify')(
    {logger: true}
);
//bcrypt for password hashing
const bcrypt = require('bcrypt');
//jwt to sign the tokens
const jwt = require('jsonwebtoken');

//import the schemas
const {
  registerSchema,
  tokenResponseSchema,
  loginSchema,
  loginResponseSchema
} = require('./schemas');


//fake db to replace with real db
//access to the real db will be made through await to asynchronously fetch data from it
const users = [];
//salt for hashing
const salt = 10;

const secretkey = 'super-secret-key';

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
    users.push({ username: username, password: hashedPass }); //add to the users

    //const token = fastify.jwt.sign({ username }, { expiresIn: '1h' });
    console.log("registered new user:", username);
    const token = jwt.sign({
      username: username
    }, secretkey, { expiresIn: '1h' });
    return reply.status(200).send({ message: token});
};

fastify.post('/register',{ registerSchema, response: { 200: tokenResponseSchema } }, registerHandler);

//simple login route demo using arrow
/*
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
*/

//want to add back the schema
fastify.post('/login', async (request, reply) => {
  const {username, password, Authorization } = request.body;
    //find user in db
  if (Authorization)
  {
    //might want to use an arrow function for error handling ?
    try {
      const decoded = jwt.verify(Authorization, secretkey);
      const username = decoded.username;
      sendToken(username);
      return ;
    } catch (err){
      console.log(err);
      return ;
    }
  }

  const user = users.find(u => u.username === username);
  if (!user) {
     return reply.status(400).send({ message: 'Invalid username !' });
  }
  //match the password
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
      return reply.status(400).send({ message: 'Invalid password !' });
  }
  //logic goes here
  //TODO: replaced username by user id maybe ? dont know if needed
  console.log(username);
  sendToken(username);
  //return { newToken };
  //return reply.status(200).send({ message: 'Authentification successfull !'});

  function sendToken(user) {
    const newToken = jwt.sign({ username: user}, secretkey, {expiresIn: '1h'});
    reply.send({ token: newToken });
  }
});

fastify.get('/healthcheck', async (request, reply) => {
    reply.status(200).send({ message: 'Good!'});
  });

//start the server
const start = async () => {
    try {
        await fastify.listen({
          host: '0.0.0.0',
          port: 3000
        });
        console.log('auth running and listening on port 3000');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

start();