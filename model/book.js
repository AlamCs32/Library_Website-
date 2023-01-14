const { sequelize, Model, DataTypes } = require('../config/dbConfig')
const { User } = require('./user')

class Book extends Model { }

Book.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    addedBy: {
        type: DataTypes.INTEGER,
    },
    updatedBy: {
        type: DataTypes.INTEGER,
    },
    title: {
        type: DataTypes.STRING
    },
    author: {
        type: DataTypes.STRING
    },
    publish_date: {
        type: DataTypes.DATE
    },
    category: {
        type: DataTypes.JSON,
    },
    type: {
        type: DataTypes.STRING
    },
    total_page: {
        type: DataTypes.INTEGER,
    },
    volume: {
        type: DataTypes.STRING
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue:1
    },
    review: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    flag: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    tableName: "Book",
    modelName: "Book"
})

Book.belongsTo(User, {
    foreignKey: "addedBy",
    targetKey: "id"
})

// Book.sync({ force: true }).then(() => console.log("Book Table is Created")).catch(error => console.log(error))

module.exports = { Book }