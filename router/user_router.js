const express = require('express')
const { singup, login, ChangePwd, SendEmail, forgetPasswdset, Profile } = require('../controller/userController')
const auth = require('../middleware/auth')
const isAuthorize = require('../middleware/role')
const router = express.Router()
// @admin
router.post('/singup', auth, isAuthorize('admin'), singup)
// @user
router.post('/login', login)
// @both
router.post('/changepassword', auth, ChangePwd)
//@both
router.post('/resetpass', SendEmail)
//@both
router.post('/reset/:id/:token', forgetPasswdset)
// @both
router.get('/profile',auth,Profile)

module.exports = router