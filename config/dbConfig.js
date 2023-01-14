const { Sequelize, Model, QueryTypes, DataTypes, Op } = require('sequelize')

// const sequelize = new Sequelize("mysql://root@localhost/library")
const sequelize = new Sequelize("mysql://root@localhost/library", { logging: false })

sequelize.authenticate().then(() => console.log("Database is Connected")).catch(error => console.log(error))

module.exports = { sequelize, Model, QueryTypes, DataTypes, Op }