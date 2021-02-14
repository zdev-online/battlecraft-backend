const config    = require('../config.json');    
const { Sequelize, Model, DataTypes }   = require('sequelize');

const sequelize = new Sequelize(config.database);

sequelize.authenticate().catch(error => {
    console.error(`Не удалось подлючиться к БД: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
}).then(() => {
    console.log(`Успешное подключение к базе данных!`);
});
// sequelize.sync().catch(error => {
//     console.error(`Не удалось синхронизироваться с БД: ${error.message}`);
//     console.error(`Stack: ${error.stack}`);
// }).then(() => {
//     console.log(`Успешная синхронизация с базой данных`);
// });

module.exports = { Model, DataTypes, sequelize }