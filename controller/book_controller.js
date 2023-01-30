const Joi = require('joi')
const image_upload = require('../config/multer')
const { Book, User_Book, UserInfo } = require('../model')
const { book_add_joi, book_update_details, bookId_joi } = require('../service/book_joi_service')
const moment = require('moment')
require('dotenv').config()
const { No_Book } = require('../service/CustomError')
const { Op } = require('sequelize')

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
        return res.status(200).send({ data: book })
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
        return res.status(200).send({ data: book })

    }
    // @admin
    // update book image
    static async admin_update_book_image(req, res, next) {
        let file = await image_upload(req, res, "book").catch(error => {
            return next(error)
        })
        let valid = book_update_details(req.body) //Joi validation
        if (valid) {
            return next(valid)
        }
        let book = await Book.findOne({ where: { id: req.body.bookId } }).catch(error => {
            return next(error)
        })

        let image = "/upload/image/" + file.filename
        let result = await Book.update({ image }, { where: { id: book.id } }).catch(error => {
            return next(error)
        })
        return res.status(200).send({ data: result })
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
        return res.status(200).send({ data: book })
    }

    // @admin
    // Book delete
    static async admin_book_delete(req, res, next) {
        let valid = bookId_joi(req.body)
        if (valid) {
            return next(valid)
        }

        let book = await Book.destroy({ where: { id: req.body.bookId } }).catch(error => {
            return next(error)
        })

        return res.status(200).send({ data: book })
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
            i.image = `http://localhost:${process.env.PORT}${i.image}`
            return i
        })

        return res.status(200).send({ data: book })
    }

    // @user
    // User Book Request
    static async user_book_request(req, res, next) {
        let valid = bookId_joi(req.body)
        if (valid) {
            return next(valid)
        }
        let book = await Book.findOne({ where: { id: req.body.book_id } }).catch(error => {
            console.log({ error })
            return next(error)
        })

        if (!book) {
            return next(No_Book())
        }

        if (book.quantity === 0) {
            return res.status(200).send({ data: book, messages: "out of stock" })
        }

        let user_fine = await User_Book.findOne({ where: { user_id: req.user.id, fine: { [Op.gt]: 0 } } })
            .catch(error => { return next(error) })

        if (user_fine) {
            return res.status(200).send({ data: `Pay fine ${user_fine.fine}` })
        }

        let book_user = await User_Book.findOne({ where: { book_id: req.body.book_id, user_id: req.user.id, status: 0 } }).catch(error => {
            return next(error)
        })

        if (book_user) {
            return res.status(200).send({ data: book_user })
        }

        req.body.user_id = req.user.id

        book_user = await User_Book.create(req.body).catch(error => {
            return next(error)
        })

        return res.status(200).send({ data: book_user })
    }
    // @admin
    // Admin User Book Request Confirm / Reject
    static async admin_book_request(req, res, next) {
        let schema = Joi.object({
            id: Joi.number().required().messages({ 'any.required': 'id is required' }),
            status: Joi.number().required().messages({ 'any.required': 'status is required' }),
        })
        let { error } = schema.validate(req.body, { abortEarly: false })
        if (error) { return next(error) }

        let { id, status } = req.body

        let book_id = await User_Book.findOne({
            where: { id }, attributes: {
                exclude: ["createdAt", 'updatedAt', 'updatedBy']
            }
        }).catch(error => {
            return next(error)
        })

        let book = await Book.findOne({ where: { id: book_id.book_id } }).catch(error => {
            return next(error)
        })

        if (book_id.status == status) {
            return res.status(200).send({ data: book_id })
        }

        if (status == 1) {

            let today = moment()
            let return_date = moment(today).add(7, 'days').format('YYYY-MM-DD')
            book.quantity = book.quantity - 1
            await book.save()

            let result = await User_Book.update({ status, return_date }, { where: { id } }).catch(error => {
                return next(error)
            })
            return res.status(200).send({ data: result })
        }
        let result = await User_Book.update({ status }, { where: { id } }).catch(error => {
            return next(error)
        })
        return res.status(200).send({ data: result })
    }
    // @Admin
    // Admin Book New request 
    static async admin_book_new_request_view(req, res, next) {
        let offset = req.query.page ? (req.query.page - 1) * 10 : 0;
        let book = await User_Book.findAll({
            where: { status: 0 },
            limit: 10, offset,
            attributes: {
                exclude: ["createdAt", 'updatedAt', 'updatedBy']
            },
            include: [
                {
                    model: Book, attributes: { exclude: ['addedBy', 'updatedBy'] }
                }
            ],
            order: [['id', 'DESC']]
        }).catch(error => {
            return next(error)
        })
        return res.status(200).send({ data: book })
    }
    // @admin
    // Admin book All types of request
    static async admin_book_request_view(req, res, next) {
        let offset = req.query.page ? (req.query.page - 1) * 10 : 0;
        let book = await User_Book.findAll({
            limit: 10, offset,
            attributes: {
                exclude: ["createdAt", 'updatedAt', 'updatedBy']
            },
            include: [
                {
                    model: Book, attributes: { exclude: ['addedBy', 'updatedBy'] }
                }
            ],
            order: [['id', 'DESC']]
        }).catch(error => {
            return next(error)
        })
        return res.status(200).send({ data: book })
    }
    //@admin
    // Book return APi
    static async admin_user_book_return(req, res, next) {
        let schema = Joi.object({
            id: Joi.number().required().messages({ 'any.required': 'id is required' })
        })
        let { error } = schema.validate(req.body, { abortEarly: false })
        if (error) { return next(error) }

        let { id } = req.body
        let user_book = await User_Book.findOne({ where: { id }, include: [{ model: Book }] }).catch(error => {
            return next(error)
        })

        if (!user_book || user_book.status == 2 || user_book.status == 3) {
            return res.status(200).send({ data: user_book, message: "book is returned" })
        }

        let today = moment().format('YYYY-MM-DD')

        if (today > user_book.return_date) {
            let todayDate = moment(today)
            let returnDate = moment(user_book.return_date)
            let day = todayDate.diff(returnDate, 'days')

            let quantity = user_book.Book.quantity + 1
            let book = await Book.update({ quantity }, { where: { id: user_book.Book.id } }).catch(error => {
                return next(error)
            })

            let fine = day * 10

            let result = await User_Book.update({ fine, actual_return_date: today, status: 3 }, { where: { id: user_book.id } }).catch(error => {
                return next(error)
            })

            return res.status(200).send({ data: { book, result }, message: `user have a fine ${fine}` })
        }

        let quantity = user_book.Book.quantity + 1
        let book = await Book.update({ quantity }, { where: { id: user_book.Book.id } }).catch(error => {
            return next(error)
        })
        user_book = await User_Book.update({ status: 3 }, { where: { id: user_book.id } }).catch(error => {
            return next(error)
        })
        return res.status(200).send({ data: { book, result: user_book } })
    }
    // @admin
    // admin update fine payment / user pay the fine ammount this function will updated the user fine 
    static async admin_update_fine_payment(req, res, next) {
        let schema = Joi.object({
            user_id: Joi.number().required()
        })
        let { error } = schema.validate(req.params, { abortEarly: false })
        if (error) { return next(error) }

        let user = await User_Book.findOne({ where: { fine: { [Op.gt]: 0 }, user_id: req.params.user_id } }).catch(error => {
            return next(error)
        })

        if (!user) {
            return res.status(200).send("Fine is Paid No Fine")
        }
        let userFineUpdated = await User_Book.update({ fine_pay: true, fine: 0 }, { where: { id: user.id } }).catch(error => {
            return next(error)
        })

        return res.status(200).send(userFineUpdated)
    }
    // @admin
    // admin user fine list 
    static async admin_all_user_fine_list(req, res, next) {
        let offset = req.query.page ? (req.query.page - 1) * 10 : 0;

        let data = await User_Book.findAll({ where: { fine: { [Op.gt]: 0 } }, limit: 10, offset, order: [['id', 'DESC']] }).catch(error => {
            return next(error)
        })
        return res.status(200).send({ data })
    }
    // @admin
    // admin individual user fine  
    static async admin_user_fine(req, res, next) {
        let schema = Joi.object({
            user_id: Joi.number().required().messages({ 'any.required': 'user id is required' })
        })
        let { error } = schema.validate(req.params)
        if (error) { return next(error) }

        let user = await User_Book.findOne({ where: { fine: { [Op.gt]: 0 }, user_id: req.params.user_id } }).catch(error => {
            return next(error)
        })

        if (!user) {
            return res.status(200).send("user have no fine")
        }

        let user_info = await UserInfo.findOne({ where: { id: req.params.user_id }, attributes: { exclude: ["createdAt", "updatedAt"] } }).catch(error => {
            return next(error)
        })

        return res.status(200).send([user, user_info])
    }

    // @user
    // user all fine list and total fine ammount   
    static async user_fine(req, res, next) {
        let user = await User_Book.findOne({ where: { fine: { [Op.gt]: 0, user_id: req.user.id } } }).catch(error => {
            return next(error)
        })
        if (!user) {
            return res.status(200).send("No Fine")
        }
        return res.status(200).send(user)
    }
}

module.exports = Book_Control