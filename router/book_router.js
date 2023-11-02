const express = require('express')
const { admin_add_book, admin_view_book, admin_update_book_details, admin_update_book_image, admin_book_delete, home_page, user_book_request, admin_book_request_view, admin_book_request, admin_book_new_request_view, admin_user_book_return, admin_all_user_fine_list, admin_user_fine, admin_update_fine_payment, user_fine, search_book, search_Category } = require('../controller/book_controller')
const auth = require('../middleware/auth')
const isAuthorize = require('../middleware/role')
require('dotenv').config()
let { permission } = process.env

const router = express.Router()
//                      Admin Book
// @admin
router.post('/book/add', auth, isAuthorize(permission), admin_add_book)
// @admin
router.get('/book/view', auth, isAuthorize(permission), admin_view_book)
// @admin 
router.put('/book/update/details', auth, isAuthorize(permission), admin_update_book_details)
// admin
router.put('/book/update/image', auth, isAuthorize(permission), admin_update_book_image)
// @admin
router.delete('/book/delete', auth, isAuthorize(permission), admin_book_delete)

// @user
router.get('/', home_page) //search feature is pending 
// @user @Public
router.get('/search', search_book)
//                      Admin/User Book Request
// @user
router.post('/book/request', auth, user_book_request)
// @admin  //new type of book request only
router.get('/admin/book/request', auth, isAuthorize("admin"), admin_book_new_request_view)
// @admin //All type of book request
router.get('/admin/book/all/request', auth, isAuthorize("admin"), admin_book_request_view)
// @admin // request accept or cancle 
router.post('/admin/book/request', auth, isAuthorize("admin"), admin_book_request)

// @admin user book return
router.post('/admin/book/return', auth, isAuthorize(permission), admin_user_book_return)
//                      Admin/User Book Fine Payment 
// @admin 
router.get('/admin/fine', auth, isAuthorize(permission), admin_all_user_fine_list)
// @admin
router.get('/admin/fine/:user_id', auth, isAuthorize(permission), admin_user_fine)
// @admin 
// Fine paid Api 
router.post('/admin/fine/paid/:user_id', auth, isAuthorize(permission), admin_update_fine_payment)
// @user
router.get('/user/fine', auth, user_fine)


module.exports = router