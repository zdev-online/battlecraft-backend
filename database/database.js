const config    = require('../config.json');    
const { Sequelize, Model, DataTypes }   = require('sequelize');

const sequelize = new Sequelize(config.database);

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (error) {
        console.error(`Не удалось подлючиться к БД: ${error.message}`);
        console.error(`Stack: ${error.stack}`);
        return process.exit(-1);
    }
})();

module.exports = { Model, DataTypes, sequelize }