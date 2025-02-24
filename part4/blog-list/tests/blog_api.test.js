const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert/strict')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'John Doe',
    url: 'https://example.com/first',
    likes: 5,
  },
  {
    title: 'Second Blog',
    author: 'Jane Doe',
    url: 'https://example.com/second',
    likes: 10,
  }
]

let blogIdToDelete

// Setup Before Each Test
beforeEach(async () => {
  await Blog.deleteMany({})
  const createdBlogs = await Blog.insertMany(initialBlogs)
  blogIdToDelete = createdBlogs[0]._id.toString()
})

describe('Blog API Tests', () => {

  test('returns blogs as JSON', async () => {
    const response = await api.get('/api/blogs')
    assert.equal(response.status, 200)
    assert.equal(response.headers['content-type'].includes('application/json'), true)
  })

  test('returns all blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.equal(response.body.length, initialBlogs.length)
  })

  test('returns a specific blog title', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    assert.ok(titles.includes('First Blog'))
  })

  test('successfully adds a new blog', async () => {
    // Fetch a valid token by logging in a test user
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpass' }) 
  
    const token = loginResponse.body.token
    assert.ok(token, 'Token should be provided')
  
    const newBlog = {
      title: 'New Blog',
      author: 'Alice Doe',
      url: 'https://example.com/new',
      likes: 7
    }
  
    // Make request with Authorization header
    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // ✅ Include the token
      .send(newBlog)
  
    assert.equal(postResponse.status, 201)
  
    // Fetch all blogs and check if the new blog was added
    const getResponse = await api.get('/api/blogs')
  
    assert.equal(getResponse.body.length, initialBlogs.length + 1)
  
    const savedTitles = getResponse.body.map(blog => blog.title)
    assert.ok(savedTitles.includes('New Blog'))
  })
  

  test('defaults likes to 0 if missing', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpass' })
    const token = loginResponse.body.token
    assert.ok(token, 'Token should be provided')
    const newBlog = {
      title: 'No Likes Blog',
      author: 'Bob Doe',
      url: 'https://example.com/nolikes'
    }

    const postResponse = await api.post('/api/blogs')
                                  .set('Authorization', `Bearer ${token}`)
                                  .send(newBlog)
    assert.equal(postResponse.status, 201)
    assert.equal(postResponse.body.likes, 0)
  })

  test('rejects blog without title or URL', async () => {
    // Fetch a valid token by logging in a test user
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpass' })
    const token = loginResponse.body.token
    assert.ok(token, 'Token should be provided')
  
    const invalidBlog = { author: 'Anonymous' }
  
    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // ✅ Include token
      .send(invalidBlog)
  
    assert.equal(postResponse.status, 400) // Expecting 400 for invalid data
  })
  

  test('deletes a blog successfully', async () => {
    const deleteResponse = await api.delete(`/api/blogs/${blogIdToDelete}`)
    assert.equal(deleteResponse.status, 204)

    const afterDeleteResponse = await api.get('/api/blogs')
    assert.equal(afterDeleteResponse.body.length, initialBlogs.length - 1)
  })

  test('returns 404 when deleting a non-existent blog', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString()
    const deleteResponse = await api.delete(`/api/blogs/${nonExistentId}`)
    assert.equal(deleteResponse.status, 404)
  })

  test('updates a blog\'s likes successfully', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedBlog = { likes: blogToUpdate.likes + 1 }
    const updateResponse = await api.put(`/api/blogs/${blogToUpdate._id}`).send(updatedBlog)

    assert.equal(updateResponse.status, 200)
    assert.equal(updateResponse.body.likes, blogToUpdate.likes + 1)
  })

})

// Closing Database Connection After Tests
after(async () => {
  await mongoose.connection.close()
})
