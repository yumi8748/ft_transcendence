
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const fastify = Fastify({ logger: true });
import {getService, postService} from './plugins/serviceRequest.js';



//bcrypt for password hashing
//jwt to sign the tokens

//import the schemas
//import {
//  registerSchema,
//  tokenResponseSchema,
//  loginSchema,
//  loginResponseSchema
//} from './schemas.js';

fastify.register(fastifyCors, {
  origin: '*', // Allow all origins (or specify frontend URL)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

//// Explicitly handle OPTIONS requests
//fastify.options('*', async (req, reply) => {
//  reply
//    .header('Access-Control-Allow-Origin', '*')
//    .header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
//    .header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//    .code(204) // No content
//    .send();
//});


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
    const { username, password, avatar } = request.body;


    const userPromise = getService("http://data-service:3001/users/" + username)
    const passPromise = bcrypt.hash(password, salt);
    const userExist = await userPromise;
    if (userExist != 404) {
      return reply.status(400).send({ message: 'Invalid username !'});
    }
    
    const hashedPass = await passPromise;
    const result = await postService("http://data-service:3001/users", { username: username, password: hashedPass, avatar: avatar})
    //users.push({ username: username, password: hashedPass }); //add to the users

    //const token = fastify.jwt.sign({ username }, { expiresIn: '1h' });
    console.log(result);
    console.log("registered new user:", username);
    const token = jwt.sign({
      username: username
    }, secretkey, { expiresIn: '1h' });
    return reply.status(200).send({ message: token});
};


const registerSchema = {
  schema: {
    body: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        avatar: { type: 'string'}
      },
      required: ['username', 'password', 'avatar']
    },
  }
};


const tokenResponseSchema = {
  type: 'object',
  body: {
    type: 'object',
    properties: {
      token: { type: 'string' }
    }
  }
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
      //find user in db
  console.log (username, password);

  const user = await getService("http://data-service:3001/users/" + username)
  console.log("received user" + user);
  //const user = users.find(u => u.username === username);
  if (user == 404) {
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


const verifySchema = {
  schema: {
    headers: {
      type: 'object',
      properties: {
        authorization: { type: 'string' },
      },
      required: ['authorization']
    },
  }
};

fastify.get('/verify',{ verifySchema }, async (request, reply) => {
  console.log("verify route triggered");

  const authorization = request.headers['authorization'];
  
  if (!authorization) {
    return reply.status(401).send({ message: 'Authorization header missing' });
  }
  const parts = authorization.split(' ');

  if (parts.length == 2 && parts[0] == 'Bearer')
  {
    try {
      const result = await jwt.verify(parts[1], secretkey);
      return reply.status(200).send({ message: "authentification successfull" });
    } catch(err) {
      console.log(err);
      //return reply.status(401).send({ message: 'Invalid token' });
    }
  }
  return reply.status(401).send({ message: 'Invalid token' });
})

fastify.get('/healthcheck', async (request, reply) => {
    reply.status(200).send({ message: 'Good!'});
  });

//start the server
const start = async () => {
    try {
        await fastify.listen({
          host: '0.0.0.0',
          port: 3002
        });
        console.log('auth running and listening on port 3002');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

start();