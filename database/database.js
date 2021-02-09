const config    = require('../config.json');    
const { Sequelize, Model, DataTypes }   = require('sequelize');

const sequelize = new Sequelize(config.database);

module.exports = { Model, DataTypes, sequelize }