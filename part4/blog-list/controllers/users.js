const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
  try {
    const { username, name, password } = req.body

    // Ensure both username and password are given
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    // Ensure both are at least 3 characters long
    if (username.length < 3 || password.length < 3) {
      return res.status(400).json({ error: 'Username and password must be at least 3 characters long' })
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: 'Username must be unique' })
    }

    // Hash password before saving
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({ username, name, passwordHash })
    const savedUser = await user.save()

    res.status(201).json(savedUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

module.exports = usersRouter
