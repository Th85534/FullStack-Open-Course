const blogsRouter = require('express').Router()
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user // Extracted from userExtractor middleware

  if (!request.token) {
    return response.status(401).json({ error: 'Token missing' })
  }

  if (!user) {
    return response.status(401).json({ error: 'User authentication failed' })
  }

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  // Add blog to the user's list
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// Delete a blog by ID
blogsRouter.delete('/:id', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'Token missing' })
  }

  const user = request.user // Extracted from userExtractor middleware
  if (!user) {
    return response.status(401).json({ error: 'User authentication failed' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  if (!blog.user) {
    return response.status(400).json({ error: 'Blog has no associated user' })
  }

  // Ensure only the creator can delete
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'Unauthorized: You can only delete your own blogs' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


// Update a blog by ID
blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true }
  )

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).json({ error: 'Blog not found' })
  }
})

module.exports = blogsRouter;