const config    = require('../config.json');    
const { Sequelize, Model, DataTypes }   = require('sequelize');

const {
    host,
    port,
    username,
    password,
    database,
    dialect,
    logging,
    ...rest
} = config.database;

const sequelize = new Sequelize({
    host    : process.env.DB_HOST     || host,
    port    : process.env.DB_PORT     || port,
    database: process.env.DB_DATABASE || database,
    username: process.env.DB_USERNAME || username,
    password: process.env.DB_PASSWORD || password,
    dialect : process.env.DB_DIALECT  || dialect,
    logging : process.env.DB_LOGGING  || logging,
    ...rest,
});

sequelize.authenticate({ logging: false }).catch(error => {
    console.error(`Не удалось подлючиться к БД: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
}).then(() => {
    console.log(`Успешное подключение к базе данных!`);
});

module.exports = { Model, DataTypes, sequelize }
