const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') { // 5d: E2E testing. Add the testing.js ONLY if we're in testing mode - otherwise this resetting of databases (all users and all notes!) would be possible also in production builds. "After the changes, an HTTP POST request to the /api/testing/reset endpoint empties the database. Make sure your backend is running in test mode by starting it with this command (previously configured in the package.json file):" (? maybe? Don't take my word for it c:)
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter) // -> /api/testing/reset, since there's /reset there
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app