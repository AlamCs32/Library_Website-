const { sequelize, Model, DataTypes } = require('../config/dbConfig')
const { User } = require('./user')
const { Book } = require('./book')
let moment = require('moment')

let apply_Date = moment().format('YYYY-MM-DD')

class User_Book extends Model { }

User_Book.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    book_id: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            isNumeric: true,
        }
    },
    apply_date: {
        type: DataTypes.STRING,
        defaultValue: apply_Date
    },
    return_date: {
        type: DataTypes.STRING,
    },
    actual_return_date: {
        type: DataTypes.STRING
    },
    fine: {
        type: DataTypes.NUMBER,
        defaultValue: 0
    },
    fine_pay: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    updatedBy: {
        type: DataTypes.INTEGER
    },
}, {
    sequelize,
    tableName: "User_Book",
    tableName: "User_Book"
})

User_Book.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "id"
})

User_Book.belongsTo(Book, {
    foreignKey: "book_id",
    targetKey: "id"
})

// User_Book.sync({ force: true }).then(() => console.log("User_Book is created")).catch(error => console.log(error))

module.exports = { User_Book }