const CustomError = require("../service/CustomError")
require('dotenv').config()
const { DebugMod } = process.env
const { ValidationError } = require('joi')
let errorHandler = async (error, req, res, next) => {

    let error_message = {
        status: "fail",
        code: 500,
        message: "internal server error",
        ...(DebugMod === "true" && { originalError: error.message })

    }
    if (error instanceof ValidationError) {
        console.log({ step: 2, error })
        error_message.code = 400
        error_message.message = error.details.map(i => { return i.message })
    }

    if (error instanceof CustomError) {
        error_message.code = error.status
        error_message.message = error.message
    }

    return res.status(error_message.code).json({ status: "fail", error: error_message })
}
module.exports = errorHandler