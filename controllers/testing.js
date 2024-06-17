// this file had been accidentally deleted/not copy-pasted from the right place (?) when I copy-pasted shit by accident from phonebook app at one point... yeah.

const router = require('express').Router() // 5d; for E2E testing
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (request, response) => { // all in all: /api/testing/reset, since: look at "app.js" file!
  await Blog.deleteMany({}) // deletes all blogs
  await User.deleteMany({}) // deletes all users. Damn... see app.js to see how this is restricted to only test mode! c:

  response.status(204).end() // 204 = no content
})

module.exports = router