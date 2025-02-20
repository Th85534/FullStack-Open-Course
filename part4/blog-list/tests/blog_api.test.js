const { test, describe, before, after } = require('node:test')
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

// **Setup Database Before Tests Run**
before(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('Blog API Tests', () => {

  test('blogs are returned as JSON', async () => {
    const response = await api.get('/api/blogs')
    assert.equal(response.status, 200)
    assert.equal(response.headers['content-type'].includes('application/json'), true)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.equal(response.body.length, initialBlogs.length)
  })

  test('a specific blog title is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    assert.ok(titles.includes('First Blog'))
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Alice Doe',
      url: 'https://example.com/new',
      likes: 7
    }

    const postResponse = await api.post('/api/blogs').send(newBlog)
    assert.equal(postResponse.status, 201)

    const getResponse = await api.get('/api/blogs')
    assert.equal(getResponse.body.length, initialBlogs.length + 1)

    const titles = getResponse.body.map(blog => blog.title)
    assert.ok(titles.includes('New Blog'))
  })

  test('blog without likes defaults to 0', async () => {
    const newBlog = {
      title: 'No Likes Blog',
      author: 'Bob Doe',
      url: 'https://example.com/nolikes'
    }

    const postResponse = await api.post('/api/blogs').send(newBlog)
    assert.equal(postResponse.status, 201)

    const savedBlog = postResponse.body
    assert.equal(savedBlog.likes, 0)
  })

  test('blog without title or url is rejected', async () => {
    const newBlog = {
      author: 'Missing Data'
    }

    const postResponse = await api.post('/api/blogs').send(newBlog)
    assert.equal(postResponse.status, 400)
  })

})

// **Close Database Connection After Tests**
after(async () => {
  await mongoose.connection.close()
})
