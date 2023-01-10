const nodemailer = require('nodemailer')
require('dotenv').config()
let { nodemailerUser, nodemailerPass } = process.env


let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: nodemailerUser,
        pass: nodemailerPass
    }
})

let sendMail = (email, sub = 'Library web', message = '<h1>Welcome to Library</h1>') => {
    return new Promise((resolve, reject) => {
        transport.sendMail({
            from: nodemailerUser,
            to: email,
            subject: sub,
            html: message
        }, (error, res) => {
            if (error) {
                return reject(error)
            }
            return resolve(res)
        })
    })
}

module.exports = sendMail