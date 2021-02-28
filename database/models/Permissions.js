const { sequelize, DataTypes } = require('../database');
const config = require('./permissions.json');
const models = {};

for(let i in config){
    models[config[i].model_name] = {}
    models[config[i].model_name].type = config[i].type;
    if(config[i].type == 'pex'){
        models[config[i].model_name].db = sequelize.define(config[i].model_name, {
            id:     { type: DataTypes.NUMBER, autoIncrement: true, primaryKey: true},
            child:  { type: DataTypes.STRING, allowNull: false},
            parent: { type: DataTypes.STRING, allowNull: false},
            type:   { type: DataTypes.NUMBER, defaultValue: 1 },
            world:  { type: DataTypes.STRING, allowNull: true }
        }, { tableName: config[i].table_name });
    } else if (config[i].type == 'luckyperms'){
        models[config[i].model_name].db = sequelize.define(config[i].model_name, {
            uuid:       { type: DataTypes.NUMBER, primaryKey: true, allowNull: false},
            permission: { type: DataTypes.STRING, allowNull: false},
            value:      { type: DataTypes.NUMBER, defaultValue: 1},
            server:     { type: DataTypes.STRING, defaultValue: "global"},
            world:      { type: DataTypes.STRING, defaultValue: "global"},
            expiry:     { type: DataTypes.NUMBER, defaultValue: 0},
            contexts:   { type: DataTypes.STRING, defaultValue: "{}"}
        }, { tableName: config[i].table_name });
    } else {
        throw `Unknown type of model`;
    }
}


module.exports = models;