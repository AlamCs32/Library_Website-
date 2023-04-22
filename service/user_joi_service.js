const joi = require('joi')

class Joi_service {
    static Singup_joi(req) {
        let schema = joi.object({
            username: joi.string().min(1).required(),
            email: joi.string().min(1).email().required(),
            password: joi.string().min(1).required(),
            roll_No: joi.number().min(1).required(),
            stream: joi.string().min(1).required(),
            field: joi.string().min(1).required(),
            // year_stream: joi.date().required(),
            role: joi.string(),
            class: joi.string().min(1).required(),
            phone_no: joi.number().min(1).required()
        })
        let { error } = schema.validate(req, { abortEarly: false })
        if (error) {
            return error = error.details.map(i => { return i.message })
        }
        return false
    }

    static login_joi(req) {
        let schema = joi.object({
            email: joi.string().email().min(1).required(),
            password: joi.string().empty().min(1).required(),
        })
        let { error } = schema.validate(req, { abortEarly: false })

        if (error) {
            return error = error.details.map(i => { return i.message })
        }
        return false
    }
    static changePwd_joi(req) {
        let schema = joi.object({
            old_password: joi.string().min(1).required(),
            new_password: joi.string().min(1).required(),
            confirm_password: joi.string().min(1).required(),
        })
        let { error } = schema.validate(req, { abortEarly: false })

        if (error) {
            return error = error.details.map(i => { return i.message })
        }
        return false
    }

    static forgetPasswdset_joi(req) {
        let Schema = joi.object({
            password: joi.string().min(1).required(),
            ConfirmPassword: joi.string().min(1).required(),
        })
        let { error } = Schema.validate(req.body, { abortEarly: false })
        if (error) {
            return error = error.details.map(i => { return i.message })
        }
        return false
    }

    static SendEmail_joi(req) {

        let Schema = joi.object({
            email: joi.string().email().min(1).required()
        })
        let { error } = Schema.validate(req.body, { abortEarly: false })

        return error ? error : false;
    }
}

module.exports = Joi_service