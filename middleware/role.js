let isAuthorize = (...role) => {
    return (req, res, next) => {

        if (!role.includes(req.user.role)) {
            return next(new Error("You are not Allow to access this Service"))
        }
        next()
    }
}
module.exports = isAuthorize