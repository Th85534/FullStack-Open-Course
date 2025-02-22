const { test, describe, before, after } = require('node:test')
const assert = require('node:assert/strict')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

// Clear users before tests
before(async () => {
  await User.deleteMany({})
})

describe('User API Tests', () => {

  test('valid user is created successfully', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'testpass'
    }

    const postResponse = await api.post('/api/users').send(newUser)
    assert.equal(postResponse.status, 201)

    const usersAtEnd = await User.find({})
    assert.equal(usersAtEnd.length, 1)
  })

  test('user without a username is rejected', async () => {
    const newUser = {
      name: 'Missing Username',
      password: 'somepass'
    }

    const postResponse = await api.post('/api/users').send(newUser)
    assert.equal(postResponse.status, 400)
    assert.ok(postResponse.body.error.includes('Username and password are required'))
  })

  test('user with a short username is rejected', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'validpass'
    }

    const postResponse = await api.post('/api/users').send(newUser)
    assert.equal(postResponse.status, 400)
    assert.ok(postResponse.body.error.includes('Username and password must be at least 3 characters long'))
  })

  test('user with a short password is rejected', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Short Password',
      password: 'ab'
    }

    const postResponse = await api.post('/api/users').send(newUser)
    assert.equal(postResponse.status, 400)
    assert.ok(postResponse.body.error.includes('Username and password must be at least 3 characters long'))
  })

  test('user with a non-unique username is rejected', async () => {
    const newUser = {
      username: 'duplicate',
      name: 'First User',
      password: 'validpass'
    }
    await api.post('/api/users').send(newUser)

    const duplicateUser = {
      username: 'duplicate',
      name: 'Second User',
      password: 'validpass'
    }

    const postResponse = await api.post('/api/users').send(duplicateUser)
    assert.equal(postResponse.status, 400)
    assert.ok(postResponse.body.error.includes('Username must be unique'))
  })

})

// Close DB connection after tests
after(async () => {
  await mongoose.connection.close()
})
