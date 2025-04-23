import fs from 'node:fs'
import pump from 'pump'
import path from 'node:path'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import { fileURLToPath } from 'node:url'
import { ACTIVE_USERS } from '../server.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'realyifandiao@gmail.com',
		pass: 'tzxk wktx sirz xiil'
	}
})
const TWO_FA_CODES = new Map()

async function authRoutes(fastify) {
	fastify.post('/auth/register', async (req, res) => {
		const parts = req.parts()
		const fields = {}
		let avatarInfo = null
		try {
			for await (const part of parts) {
				if (part.file) {
					let uploadPath
					if (part.filename.length === 0)
						part.filename = 'default_avatar.png'
					uploadPath = path.join(__dirname, '../volume/uploads', part.filename)
					if (part.filename !== 'default_avatar.png')
						pump(part.file, fs.createWriteStream(uploadPath))
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
			return res.status(400).send({ error: 'Error processing multipart form' })
		}
		const { username, email, password, confirmPassword } = fields
		// validate the input
		if (!username || !password) {
			return res.status(400).send({ error: 'Username and password are required' })
		}
		if (!email || !email.includes('@')) {
			return res.status(400).send({ error: 'Valid email is required' })
		}
		if (password !== confirmPassword) {
			return res.status(400).send({ error: 'Passwords do not match' })
		}
		// if username already exists, return error
		const existingUser = fastify.sqlite.prepare(
			'SELECT * FROM users WHERE name = ?'
		).get(username)
		if (existingUser) {
			return res.status(400).send({ error: 'User already exists' })
		}
		// if email already exists, return error
		const existingEmail = fastify.sqlite.prepare(
			'SELECT * FROM users WHERE email = ?'
		).get(email)
		if (existingEmail) {
			return res.status(400).send({ error: 'Email already exists' })
		}
		// insert the user into the database
		const hashedPassword = await bcrypt.hash(password, 10)
		fastify.sqlite.prepare(
			'INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)'
		).run(username, email, hashedPassword, avatarInfo.filename)
		return res.send({ message: 'User registered successfully!' })
	})

	fastify.post('/auth/2fa/send-code', async (req, res) => {
		const { username } = req.body
		const user = fastify.sqlite.prepare('SELECT * FROM users WHERE name = ?').get(username)
		const code = Math.floor(100000 + Math.random() * 900000).toString()
		const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes
		TWO_FA_CODES.set(username, { code, expiresAt })
		await transporter.sendMail({
			from: 'realyifandiao@gmail.com',
			to: user.email,
			subject: 'Your 2FA Code - Pong Game',
			text: `Your 2FA code is ${code}. It will expire in 5 minutes.`
		})
		return res.send({ message: '2FA code sent to your email!' })
	})

	fastify.post('/auth/2fa/enable', async (req, res) => {
		const { username } = req.body
		fastify.sqlite.prepare(
			'UPDATE users SET two_fa_enabled = 1 WHERE name = ?'
		).run(username)
		return res.send({ message: '2FA enabled successfully!' })
	})

	fastify.post('/auth/2fa/disable', async (req, res) => {
		const { username } = req.body
		fastify.sqlite.prepare(
			'UPDATE users SET two_fa_enabled = 0 WHERE name = ?'
		).run(username)
		return res.send({ message: '2FA disabled successfully!' })
	})

	fastify.post('/auth/2fa/verify', async (req, res) => {
		const { username, code } = req.body
		const entry = TWO_FA_CODES.get(username)
		if (!entry || Date.now() > entry.expiresAt) {
			return res.status(400).send({ error: 'Expired 2FA code' })
		}
		if (entry.code !== code) {
			return res.status(400).send({ error: 'Invalid 2FA code' })
		}
		TWO_FA_CODES.delete(username)
		console.log('User logged in successfully: ', username)
		const token = fastify.jwt.sign({ username })
		console.log('Token generated: ', token)
		// save active user in map
		ACTIVE_USERS.set(username, { loggedInAt: Date.now() })
		res.setCookie('token', token, {
			httpOnly: true,
			Secure: true,
			path: '/',
			maxAge: 60 * 60, // 1 hour
		})
		// print all active users
		console.log('Active users: ')
		ACTIVE_USERS.forEach((value, key) => {
			console.log(key, value)
		})
		return res.status(200).send({ message: 'User logged in successfully!' })
	})

	fastify.post('/auth/login', async (req, res) => {
		console.log('Login request received:', req.body)
		const { username, password } = req.body
		// validate the input
		if (!username || !password) {
			return res.status(400).send({ error: 'Username and password are required' })
		}
		// check user exists and password is correct
		const user = fastify.sqlite.prepare(
			'SELECT * FROM users WHERE name = ?'
		).get(username)
		if (!user) {
			return res.status(400).send({ error: 'User does not exist' })
		}
		const passwordMatch = await bcrypt.compare(password, user.password)
		if (!passwordMatch) {
			return res.status(400).send({ error: 'Invalid password' })
		}
		if (ACTIVE_USERS.has(username)) {
			return res.status(400).send({ error: 'User is already logged in somewhere else' })
		}
		// check if 2FA is enabled
		if (user.two_fa_enabled) {
			return res.status(206).send({ step: '2FA required' })
		}
		console.log('User logged in successfully: ', username)
		const token = fastify.jwt.sign({ username })
		console.log('Token generated: ', token)
		// save active user in map
		ACTIVE_USERS.set(username, { loggedInAt: Date.now() })
		res.setCookie('token', token, {
			httpOnly: true,
			Secure: true,
			path: '/',
			maxAge: 60 * 60, // 1 hour
		})
		// print all active users
		console.log('Active users: ')
		ACTIVE_USERS.forEach((value, key) => {
			console.log(key, value)
		})
		return res.status(200).send({ message: 'User logged in successfully!' })
	})

	fastify.get('/auth/logout', async function (request, reply) {
		const user = await request.jwtVerify()
		ACTIVE_USERS.delete(user.username)
		console.log('Logging out user: ', user.username)
		reply.clearCookie('token', { path: '/' })
		return reply.redirect('/home')
	})
	
	fastify.get('/auth/status', async function (request, reply) {
		try {
			// Check if there's a token in the cookies
			const token = request.cookies.token
			if (!token) {
				return reply.status(400).send({ loggedIn: false })
			}
			const user = await request.jwtVerify()
			if (ACTIVE_USERS.has(user.username))
				reply.status(200).send({ loggedIn: true, username: user.username })
			else
				reply.status(401).send({ loggedIn: false })
		} catch (error) {
			reply.send(error)
		}
	})
}

export default authRoutes