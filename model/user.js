const { sequelize, Model, DataTypes } = require("../config/dbConfig")
const bcrypt = require('bcrypt')
class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "user"
    }
}, {
    sequelize,
    tableName: "User",
    modelName: "User"
})


User.beforeCreate(async (user, options) => {
    let salt = await bcrypt.genSalt(11)
    user.password = await bcrypt.hash(user.password, salt)
})

User.beforeUpdate(async function (user, options) {
    let salt = await bcrypt.genSalt(11)
    user.password = await bcrypt.hash(user.password, salt)
})

// User.sync({ force: true }).then(() => console.log("User Table is Created"))

module.exports = { User }