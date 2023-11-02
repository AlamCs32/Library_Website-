const { verify } = require('../service/token_service')
const { User } = require('../model/user')

let auth = async (req, res, next) => {
    let token
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1]
            // verifying token
            let { userId } = verify(token)
            req.user = await User.findOne({
                where: { id: userId }, attributes: {
                    exclude: ["password"]
                }
            })
            next()
        } catch (error) {
            return next(error)
        }
    } else {
        return res.json({
            status: "fail",
            error: "token is invalid"
        })
    }
}

module.exports = auth