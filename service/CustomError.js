class CustomError extends Error {

    constructor(message, status) {
        super()
        this.message = message
        this.status = status
    }

    static AllField(message = "All Fields are Required", status = 403) {
        return new CustomError(message, status)
    }
    static UserExist(message = "User is present", status = 200) {
        return new CustomError(message, status)
    }
    static PasswordIncorrect(message = "email or password is incorrect", status = 400) {
        return new CustomError(message, status)
    }

}
module.exports = CustomError