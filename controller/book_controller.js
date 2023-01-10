const Joi = require('joi')
const image_upload = require('../config/multer')
const { Book } = require('../model')
const { book_add_joi, book_update_details } = require('../service/book_joi_service')
class Book_Control {

    // @admin
    // Create book
    static async admin_add_book(req, res, next) {

        let file = await image_upload(req, res, "book").catch(error => {
            return next(error)
        })

        let valid = book_add_joi(req.body)
        if (valid) {
            return next(valid)
        }
        req.body.addedBy = req.user.id
        req.body.image = "/upload/image/" + file.filename

        let book = await Book.create(req.body).catch(error => {
            return next(error)
        })

        return res.status(200).send(book)
    }
    // @admin
    // update book info
    static async admin_update_book_details(req, res, next) {
        let valid = book_update_details(req.body)
        if (valid) {
            return next(valid)
        }
        req.body.updatedBy = req.user.id

        let book = await Book.update(req.body, { where: { id: req.body.bookId } }).catch(error => {
            return next(error)
        })
        return res.status(200).send(book)

    }
    // @admin
    // update book image
    static async admin_update_book_image(req, res, next) {
        let file = await image_upload(req, res, "book").catch(error => {
            return next(error)
        })
        let valid = book_update_details(req.body)
        if (valid) {
            return next(valid)
        }
        let book = await Book.findOne({ where: { id: req.body.bookId } }).catch(error => {
            return next(error)
        })

        let image = "/upload/image/" + file.filename
        let result = await Book.update({ image }, { where: { id: book.id } }).catch(error => {
            console.log({ error })
            return next(error)
        })
        return res.send(result)
    }

    // @admin
    // view and Counts book //Joi validation is pending
    static async admin_view_book(req, res, next) {
        let search = {}
        // Pagination
        search.limit = 10
        search.offset = req.query.page ? (req.query.page - 1) * 10 : 0;

        let book = await Book.findAndCountAll(search).catch(error => {
            return next(error)
        })
        book.rows = book.rows.map(i => {
            i.category = i.category.replace(/'/g, "")
            i.category = JSON.parse(i.category)
            return i
        })
        return res.status(200).send(book)
    }

    // @admin
    // Book delete
    static async admin_book_delete(req, res, next) {
        let schema = Joi.object({
            bookId: Joi.number().required()
        })
        let { error } = schema.validate(req.body)

        if (error) {
            return next(error)
        }

        let book = await Book.destroy({ where: { id: req.body.bookId } }).catch(error => {
            return next(error)
        })

        return res.status(200).send(book)
    }

    // @user
    // Home Page 
    static async home_page(req, res) {

        let offset = req.query.page ? (req.query.page - 1) * 10 : 0;
        let book = await Book.findAll({
            where: { flag: true }, limit: 10, offset, attributes: {
                exclude: [
                    "addedBy", "updatedBy", "flag", "createdAt", "updatedAt"
                ]
            }
        }).catch(error => {
            return next(error)
        })

        book = book.map(i => {
            i.category = i.category.replace(/'/g, "")
            i.category = JSON.parse(i.category)
            return i
        })

        return res.status(400).send(book)
    }

    // @user
    // User Book Request
    static async user_book_request(req, res) {
        return res.send("user_book_request")
    }
}
// console.log()
let moment = require('moment')
let a = moment((Date.now() + 7 * 24 * 60 * 60 + 1000)).format('DD/MM/YYYY')
console.log(a)
module.exports = Book_Control