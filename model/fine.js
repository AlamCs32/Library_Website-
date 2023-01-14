const { sequelize, Model, DataTypes } = require('../config/dbConfig')
const { User } = require('./user')
const { User_Book } = require('./user_book')

class Fine extends Model { }

Fine.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fine_ammount: {
        type: DataTypes.INTEGER
    },
    paid_ammount: {
        type: DataTypes.INTEGER
    },
    user_book_id: {
        type: DataTypes.INTEGER
    },
    addedBy: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: "Fine",
    tableName: "fine"
})
// Fine.sync({force:true}).then(_=> console.log("fine tables is crtated")).catch(error => console.log(error))

Fine.belongsTo(User_Book, {
    foreignKey: "user_book_id",
    targetKey: 'id'
})
Fine.belongsTo(User, {
    foreignKey: "addedBy",
    targetKey: 'id'
})

module.exports = { Fine }