import Fastify from 'fastify'; //fastify framework
import fastifyCors from '@fastify/cors'; //cors rules
import bcrypt from 'bcrypt'; //password hashing
import jwt from 'jsonwebtoken'; //jwt creation, verification and decoding
import fs from 'node:fs'
import pump from 'pump'
import path from 'node:path'
import { fileURLToPath } from 'node:url';
import multipart from '@fastify/multipart'; //multipart body from forms parsing
import nodemailer from 'nodemailer' //sending mails

//secret key for jwt need to come from a .env
const secretkey = process.env.AUTH_SECRET_KEY;
//salt for hashing could come from .env as well
const salt = 10;

const fastify = Fastify({ logger: true });

//used to parse form/multipart enc type
fastify.register(multipart);

function createSessionToken(user)
{
  return jwt.sign({ name: user.name, id: user.id }, secretkey, { expiresIn: '1h'});
}

/* ------------- Cookie utils ----------------- */

function setSessionCookie(reply, token)
{
  const cookie = `session=${token}; HttpOnly; Secure; SameSite=lax; Path=/; Max-Age=${60*60}`;// 1h max age currently
  reply.header('Set-Cookie', cookie);
}

function parseCookies(request)
{
  const cookieHeader = request.headers.cookie;
  const cookies = {};

  if (!cookieHeader) {
    return {};
  }

  const pairs = request.headers.cookie.split(';');
  for (const pair of pairs)
  {
    const trimmed = pair.trim();
    const sepIndex = trimmed.indexOf('=');
    if (sepIndex === -1) { //check if there is a = skip if not
      continue;
    }
    const name = trimmed.slice(0, sepIndex);
    const rawVal = trimmed.slice(sepIndex + 1);
    cookies[name] = decodeURIComponent(rawVal);
  }
  return cookies;
}

/* --------------- Cookie utils ends -----------------*/


/* ------------- setting up 2fa ----------------- */

//instantiate the transporter for nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_MAIL,
    pass: process.env.AUTH_PASS,
  },
});

function generateMagicToken(user) {
  console.log("generating jwt for ", user.name , " with id: ", user.id);
  return jwt.sign({ name: user.name, id: user.id }, secretkey, { expiresIn: '15m'})
}

function verifyMagicToken(token) {
  console.log('verifying token:', token);
  return jwt.verify(token, secretkey);
}

async function sendEmail(email, text) {
  console.log('sending email to: ', email, ' text is: ', text);
  await transporter.sendMail({
    from: 'Transcendance 2FA service" <transcendance.verif>',
    to: email,
    subject: 'Verify your email !',
    text
  });
}

//on request such as /magic-link?username=user's name, will send an email to the user containing a link to 2FA and a token
fastify.get('/magic-link', async (request, reply) => {
  const { username } = request.query;

  const user = await getService("http://data-service:3001/users/" + username);
  const umail = user.email;

  const token = generateMagicToken(user);
  const link = `http://127.0.0.1:1234/service1/2FA?token=${token}`;

  await sendEmail(umail, `Click to verify your email: ${link}`);

  reply.status(200).send({ ok: true});
});

//on request such as /2FA?token=dzadZDAZD45524d.dzqdzqd.... will return a session token
fastify.get('/2FA', async (request, reply) => {
  const { token } = request.query;

  try {
    const decoded = verifyMagicToken(token);
    console.log("email sucessfully verified, decoded:", decoded.username);
    const newtoken = jwt.sign({
      name: decoded.name,
      id: decoded.id
    }, secretkey, { expiresIn: '1h' });
    //reply.status(302).send({ token: newtoken })
    //set the secure session cookie and redirect to the home page
    setSessionCookie(reply, newtoken);
    reply.redirect('/');
  } catch (err) {
    console.log("error verifying email");
    reply.status(400).send({message: err.message})
  }
});
/* -------- 2FA END ------------- */


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {getService, postService} from './plugins/serviceRequest.js';
import { stringify } from 'node:querystring';


fastify.register(fastifyCors, {
  origin: '*', // Allow all origins (or specify frontend URL)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

//simple register handler demo function
async function registerHandler(request, reply)
{
    console.log('in register');
    const parts = request.parts()
        const fields = {}
        let avatarInfo = null
        try {
          for await (const part of parts) {
            if (part.file) {
              let uploadPath
              uploadPath = path.join(__dirname, '../volume/uploads', 'default_avatar.png')
              if (part.filename.length !== 0)
              {
                uploadPath = path.join(__dirname, '../volume/uploads', part.filename)
                pump(part.file, fs.createWriteStream(uploadPath))
              }
              avatarInfo = {
                filename: part.filename,
                mimetype: part.mimetype,
                path: uploadPath
              }
            }
            else {
              fields[part.fieldname] = part.value
            }
          }
        } catch (err) {
          console.error('Error processing multipart form:', err)
          return reply.status(400).send({ error: 'Error processing multipart form' })
        }
    const { username, password, email } = fields;
    //check if user already exist
    const userPromise = getService("http://data-service:3001/users/" + username)
    const passPromise = bcrypt.hash(password, salt);
    const userExist = await userPromise;
    if (userExist != 404) {
      return reply.status(400).send({ message: 'Invalid username !'});
    }
    const hashedPass = await passPromise;
    
    //post new user to db, we get the user's id in response
    const result = await postService("http://data-service:3001/users", { username: username, password: hashedPass, email: email, avatar: avatarInfo.path})

    console.log(result);
    console.log("registered new user:", username);
    const token = jwt.sign({
      name: username,
      id: result.userid
    }, secretkey, { expiresIn: '1h' });
    setSessionCookie(reply, token);
    return reply.status(200).send({ message: 'Session cookie set token sent too for testing purposes', token: token });
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

  const cookies = parseCookies(request);
  const sessionToken = cookies['session'];

  if (sessionToken)
  {
    //might want to use an arrow function for error handling ?
    try {
      const decoded = jwt.verify(sessionToken, secretkey);
      const token = createSessionToken(decoded);
      setSessionCookie(reply, token);
      sendToken(decoded); //will be removed once switch to cookie based jwt is complete
      return ;
    } catch (err){
      console.log(err);
      return ;
    }
  }
      //find user in db
  console.log (username, password);

  const user = await getService("http://data-service:3001/users/" + username)
  console.log("received user" + user.name + " with id: " + user.id);
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

  // set the user status to online
  fastify.sqlite.prepare(`UPDATE users SET status = 'online' WHERE name = ?`).run(username);
  const token = createSessionToken(user);
  setSessionCookie(reply, token);
  sendToken(username);
  //return { newToken };
  //return reply.status(200).send({ message: 'Authentification successfull !'});

  function sendToken(user) {
    const newToken = jwt.sign({ name: user.name, id: user.id}, secretkey, {expiresIn: '1h'});
    reply.send({ token: newToken, username: username });
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

fastify.get('/verify', async(request, reply) => {
  const cookies = parseCookies(request);
  const sessionToken = cookies['session'];
  try {
    const decoded = jwt.verify(sessionToken, secretkey);
    console.log("decoded token:", decoded);
    reply.header('auth_username', decoded.name);
    reply.header('auth_userid', decoded.id);
    console.log("headers sending out:\n\n", reply.getHeaders());
    return (reply.status(200).send({ message: `Successfully verified as ${decoded.name}`}));
  } catch (err) {
    return reply.status(401).send({ message: err.message});
  }
})

fastify.get('/auth/status', async function (request, reply) {
  try {
    // Check if there's a token in the cookies
    //const res = await fetch('http://auth-service:3002/verify', {
    //  method: 'GET',
    //  credentials: 'include' // to send cookies (like 'session')
    //});
    //if (!res.ok) {
    //  const errorData = await res.json();
    //  throw new Error(errorData.message || 'Verification failed');
    //}
    //const authUsername = request.headers.get('auth_username');
    const authUsername = request.headers['x_username'];
    return reply.status(200).send({ loggedIn: true, username: authUsername });
  } catch (error) {
    reply.send(error)
  }
})
//keeping this for archives
//fastify.get('/verify',{ verifySchema }, async (request, reply) => {
//  console.log("verify route triggered");
//
//  const authorization = request.headers['authorization'];
//  if (!authorization) {
//    return reply.status(401).send({ message: 'Authorization header missing' });
//  }
//  const parts = authorization.split(' ');
//
//  if (parts.length == 2 && parts[0] == 'Bearer')
//  {
//    try {
//      const result = jwt.verify(parts[1], secretkey);
//      reply.setHeader('X-username', result.username);
//      return reply.status(200).send({ message: "authentification successfull" });
//    } catch(err) {
//      console.log(err);
//      //return reply.status(401).send({ message: 'Invalid token' });
//    }
//  }
//  return reply.status(401).send({ message: 'Invalid token' });
//})



fastify.get('/healthcheck', async (request, reply) => {
    reply.status(200).send({ message: 'Good!'});
  });

//start the server
const start = async () => {
    try {
        await fastify.listen({
          host: process.env.AUTH_HOST,
          port: 3002
        });
        console.log('auth running and listening on port 3002');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

start();