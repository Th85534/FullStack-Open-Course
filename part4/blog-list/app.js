const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const middleware = require('./utils/middleware');
const config = require('./utils/config');
const logger = require('./utils/logger');
const usersRouter = require('./controllers/users');
const blogsRouter = require('./controllers/blogs');

mongoose.set('strictQuery', false)
logger.info('connecting to MongoDB')
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app;