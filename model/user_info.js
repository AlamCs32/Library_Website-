const { sequelize, Model, DataTypes } = require("../config/dbConfig")
const { User } = require("./user")
const moment = require('moment')
class UserInfo extends Model { }

UserInfo.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    roll_No: {
        type: DataTypes.INTEGER,
        unique: true
    },
    stream: {
        type: DataTypes.STRING
    },
    field: {
        type: DataTypes.STRING
    },
    year_stream: {
        type: DataTypes.DATE,
        get: function () {
            return moment.utc(this.getDataValue('year_stream')).format('YYYY-MM-DD');
        },
        // set: function (value) {
        //     return this.setDataValue(value, moment().format("YYYY-MM-DD"))
        // }
    },
    class: {
        type: DataTypes.STRING
    },
    phone_no: {
        type: DataTypes.INTEGER,
        unique: true
    }
}, {
    sequelize,
    tableName: "UserInfo",
    modelName: "UserInfo"
})

UserInfo.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "id"
})

// UserInfo.findOne({raw:true}).then(res => console.log(res)).catch(error => console.log(error))

// UserInfo.sync({ force: true }).then(() => console.log("UserInfo Table is Created"))

module.exports = { UserInfo }