const joi = require('joi')

class Book_Joi {

    static book_add_joi(req) {
        let schema = joi.object({
            title: joi.string().required().messages({ 'any.required': "title is required" }),
            author: joi.string().required().messages({ 'any.required': "author is required" }),
            publish_date: joi.date(),
            category: joi.array().required().messages({ 'any.required': "category is required" }),
            type: joi.string().required().messages({ 'any.required': "type is required" }),
            total_page: joi.number().required().messages({ 'any.required': "total page is required" }),
            volume: joi.string().required().messages({ 'any.required': "volume is required" }),
            quantity: joi.number().required().messages({ 'any.required': "quantity is required" }),
            review: joi.string().required().messages({ 'any.required': "review is required" }),
        })
        let { error } = schema.validate(req, { abortEarly: false })
        if (error) {
            return error
        }
        return false
    }

    static book_update_details(req) {
        let schema = joi.object({
            bookId: joi.number().required(),
            title: joi.string(),
            author: joi.string(),
            publish_date: joi.date(),
            category: joi.array(),
            type: joi.string(),
            total_page: joi.number(),
            volume: joi.string(),
            quantity: joi.number(),
            review: joi.string(),
        })
        let { error } = schema.validate(req, { abortEarly: false })
        if (error) {
            return error
        }
        return false
    }

}
module.exports = Book_Joi