const express = require('express')
const { admin_add_book, admin_view_book, admin_update_book_details, admin_update_book_image, admin_book_delete, home_page, user_book_request } = require('../controller/book_controller')
const auth = require('../middleware/auth')
const isAuthorize = require('../middleware/role')
const router = express.Router()
// @admin
router.post('/book/add', auth, isAuthorize('admin'), admin_add_book)
// @admin
router.get('/book/view', auth, isAuthorize('admin'), admin_view_book)
// @admin 
router.put('/book/update/details', auth, isAuthorize('admin'), admin_update_book_details)
// admin
router.put('/book/update/image', auth, isAuthorize('admin'), admin_update_book_image)
// @admin
router.delete('/book/delete', auth, isAuthorize('admin'), admin_book_delete)

// @user
router.get('/', home_page)
// @user
router.post('/book/request', auth, user_book_request)

module.exports = router