const { sequelize, DataTypes:Types }  = require('../database');
const config = require('./permissions.json');
const models = {};

for(let i in config){
    models[config[i].model_name] = {}
    models[config[i].model_name].type = config[i].type;
    if(config[i].type == 'pex'){
        models[config[i].model_name].db = sequelize.define(config[i].model_name, {
            id:     { type: Types.NUMBER, autoIncrement: true, primaryKey: true},
            child:  { type: Types.STRING, allowNull: false},
            parent: { type: Types.STRING, allowNull: false},
            type:   { type: Types.NUMBER, defaultValue: 1 },
            world:  { type: Types.STRING, allowNull: true }
        }, { tableName: config[i].table_name });
    } else if (config[i].type == 'luckyperms'){
        models[config[i].model_name].db = sequelize.define(config[i].model_name, {
            uuid:       { type: Types.NUMBER, primaryKey: true, allowNull: false},
            permission: { type: Types.STRING, allowNull: false},
            value:      { type: Types.NUMBER, defaultValue: 1},
            server:     { type: Types.STRING, defaultValue: "global"},
            world:      { type: Types.STRING, defaultValue: "global"},
            expiry:     { type: Types.NUMBER, defaultValue: 0},
            contexts:   { type: Types.STRING, defaultValue: "{}"}
        }, { tableName: config[i].table_name });
    } else {
        throw `Unknown type of model | Неизветный тип модели - (доступны pex, luckyperms)`;
    }
}


module.exports = models;