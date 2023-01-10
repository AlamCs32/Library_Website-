const joi = require('joi')

class Joi_service {
    static Singup_joi(req) {
        let schema = joi.object({
            username: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string().required(),
            roll_No: joi.number().required(),
            stream: joi.string().required(),
            field: joi.string().required(),
            // year_stream: joi.date().required(),
            role: joi.string(),
            class: joi.string().required(),
            phone_no: joi.number().required()
        })
        let { error } = schema.validate(req, { abortEarly: false })
        if (error) {
            return error = error.details.map(i => { return i.message })
        }
        return false
    }

    static login_joi(req) {
        let schema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required(),
        })
        let { error } = schema.validate(req, { abortEarly: false })

        if (error) {
            return error = error.details.map(i => { return i.message })
        }
        return false
    }
    static changePwd_joi(req) {
        let schema = joi.object({
            old_password: joi.string().required(),
            new_password: joi.string().required(),
            confirm_password: joi.string().required(),
        })
        let { error } = schema.validate(req, { abortEarly: false })

        if (error) {
            return error = error.details.map(i => { return i.message })
        }
        return false
    }

    static forgetPasswdset_joi(req) {
        let Schema = joi.object({
            password: joi.string().required(),
            ConfirmPassword: joi.string().required(),
        })
        let { error } = Schema.validate(req.body, { abortEarly: false })
        if (error) {
            return error = error.details.map(i => { return i.message })
        }
        return false
    }

    static SendEmail_joi(req) {

        let Schema = joi.object({
            email: joi.string().email().required()
        })
        let { error } = Schema.validate(req.body, { abortEarly: false })
        if (error) {
            return error = error.details.map(i => { return i.message })
        }
    }
}

module.exports = Joi_service