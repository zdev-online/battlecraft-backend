const config    = require('../config.json');    
const { Sequelize, Model, DataTypes }   = require('sequelize');

const sequelize = new Sequelize(config.database);

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (error) {
        throw new Error(`Не удалось подлючиться к БД: ${error}`);
    }
})();

module.exports = { Model, DataTypes, sequelize }