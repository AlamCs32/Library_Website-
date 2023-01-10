const router = require('express').Router()
const user = require('./user_router')
const book = require('./book_router')

router.use('/', user)
router.use('/', book)

module.exports = router