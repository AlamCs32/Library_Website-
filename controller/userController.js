const { User } = require('../model/user')
const { UserInfo } = require('../model')
const CustomError = require('../service/CustomError')
const { Singup_joi, login_joi, changePwd_joi, forgetPasswdset_joi, SendEmail_joi } = require('../service/user_joi_service')
const { verify, sing } = require('../service/token_service')
const { sequelize } = require('../config/dbConfig')
const { AllField, UserExist, PasswordIncorrect } = require('../service/CustomError')
const bcrypt = require('bcrypt')
require('dotenv').config()
const { secretKey } = process.env
const sendMail = require('../config/sendEmail')

class UserController {
    // @admin
    static async singup(req, res, next) {

        let valid = Singup_joi(req.body)
        if (valid) {
            return next(CustomError.AllField(valid.message))
        }
        let t = await sequelize.transaction()
        let user = await User.findOne({ where: { email: req.body.email } })

        if (user) {
            return next(CustomError.UserExist("User is Present pls login", 200))
        }
        user = await User.create(req.body, { transaction: t }).catch(async error => {
            await t.rollback()
            return next(error)
        })

        req.body.user_id = user.id
        req.body.year_stream = Date.now()

        let user_info = await UserInfo.create(req.body, { transaction: t }).catch(async error => {
            await t.rollback().then(() => {
                return next(error)
            })
        })
        await t.commit()
        let token = sing({ userId: user.id })
        return res.status(200).cookie('jwt', token).setHeader("authorization", `Bearer ${token}`).send({ status: "success", token })
    }

    static async login(req, res, next) {
        let valid = login_joi(req.body)
        if (valid) {
            return next(valid)
        }
        let user = await User.findOne({ where: { email: req.body.email } }).catch(error => {
            return next
        })
        if (!user) { return next(UserExist("user is not present pls singup")) }
        let matchPWD = await bcrypt.compare(req.body.password, user.password)

        if (!matchPWD) {
            return next(PasswordIncorrect())
        }
        let token = sing({ userId: user.id })
        return res.cookie('jwt', token).setHeader("authorization", `Bearer ${token}`).status(200).send({ status: "success", token })
    }

    static async ChangePwd(req, res, next) {
        let valid = changePwd_joi(req.body)
        if (valid) { return next(valid) }

        let user = await User.findOne({ where: { id: req.user.id }, raw: true })

        if (req.body.new_password !== req.body.confirm_password) {
            return next(PasswordIncorrect("Password not match"))
        }
        let matchPWD = await bcrypt.compare(req.body.old_password, user.password)
        if (!matchPWD) {
            return next(PasswordIncorrect("Invalid Password"))
        }

        let result = await User.update({ password: req.body.new_password }, { where: { id: user.id }, individualHooks: true }).catch(error => {
            return next(error)
        })
        return res.status(200).send({ status: "success", data: result })

    }

    static SendEmail = async (req, res, next) => {
        //  Joi Validation
        let valid = SendEmail_joi(req.body)
        if (valid) { return next(AllField(valid)) }

        let user = await User.findOne({ where: { email: req.body.email } }).catch(error => { return next(error) })

        if (!user) {
            return next(new Error("user not present!"))
        }

        let secret = user.id + secretKey
        let token = sing({ userId: user.id }, secret)

        const link = `http://127.0.0.1:3000/reset/${user.id}/${token}`

        //  sending Email Pending
        // sendMail(user.email, "Change Password", link)
        return res.status(200).send(link)
    }

    static forgetPasswdset = async (req, res, next) => {

        let valid = forgetPasswdset_joi(req.body)
        if (valid) { return next(AllField(valid, 400)) }

        let { id, token } = req.params

        //  Comparing Password 
        let { password, ConfirmPassword } = req.body
        if (password !== ConfirmPassword) { return next(PasswordIncorrect("Password not match")) }

        // User findind 
        let user = await User.findOne({ where: { id } }).catch(error => { return next(error) })
        if (!user) {
            return next(UserExist("user not present"))
        }
        try {
            //  Creating Secret key For token
            let secret = user.id + secretKey

            verify(token, secret)

            let passwdReset = await User.update({ password }, { where: { id: user.id }, individualHooks: true })
                .catch(error => { return next(error) })

            return res.status(200).json({ status: true, data: passwdReset })
        } catch (error) {
            return next(error)
        }
    }

    // User Profile 
    static async Profile(req, res, next) {
        try {
            let user = await User.findOne({ where: { id: req.user.id }, attributes: { exclude: ["password", 'createdAt', 'updatedAt'] }, raw: true })

            let userInfo = await UserInfo.findOne({ where: { user_id: user.id }, raw: true, attributes: { exclude: ["user_id", 'createdAt', 'updatedAt'] } })

            user = { ...user, userInfo }
            return res.status(200).send(user)

        } catch (error) {
            return next(error)
        }
    }
}
module.exports = UserController