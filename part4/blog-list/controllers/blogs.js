const blogsRouter = require('express').Router()
const Blog = require('../models/blog');

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const { title, author, url, likes } = request.body

    if (!title || !url) {
      return response.status(400).json({ error: 'Title and URL are required' })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0 
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter;