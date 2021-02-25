const { sequelize, DataTypes }  = require('../../database');
const servers                   = require('../../../servers.json');

const ServerPex = sequelize.define(`${i.plugin}_${i.ip}`, {
        id: { type: DataTypes.NUMBER, autoIncrement: true, primaryKey: true },
        child: { type: DataTypes.STRING, allowNull: false },
        parent: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.NUMBER, defaultValue: 1 },
        world: { type: DataTypes.STRING, allowNull: true},
}, { tableName: `server_permissions_inheritance` });

module.exports = ServerPex;