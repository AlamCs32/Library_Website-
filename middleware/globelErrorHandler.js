const CustomError = require("../service/CustomError")
require('dotenv').config()
const { DebugMod } = process.env
const { ValidationError } = require('joi')
let errorHandler = async (error, req, res, next) => {

    let status = 500
    let error_message = {
        message: "internal server error",
        ...(DebugMod === "true" && { originalError: error.message })
    }

    if (error instanceof ValidationError) {
        status = 400
        error_message.message = error.details.map(i => { return i.message })
    }

    if (error instanceof CustomError) {
        status = error.status
        error_message.message = error.message
    }

    return res.status(status).send(error_message)
}
module.exports = errorHandler