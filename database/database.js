const config    = require('../config.json');    
const { Sequelize, Model, DataTypes }   = require('sequelize');

const sequelize = new Sequelize(config.database);

sequelize.authenticate({ logging: false }).catch(error => {
    console.error(`Не удалось подлючиться к БД: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
}).then(() => {
    console.log(`Успешное подключение к базе данных!`);
});

module.exports = { Model, DataTypes, sequelize }
