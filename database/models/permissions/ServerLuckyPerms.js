const { sequelize, DataTypes }  = require('../../database');

const ServerLuckyPerms = sequelize.define(`ServerLuckyPerms`, {
        uuid: { type: DataTypes.NUMBER, allowNull: false },
        permission: { type: DataTypes.STRING, allowNull: false },
        value: { type: DataTypes.NUMBER, defaultValue: 1},
        server: { type: DataTypes.STRING, defaultValue: 'global' },
        world: { type: DataTypes.STRING, defaultValue: 'global' },
        expiry: { type: DataTypes.NUMBER, defaultValue: 0},
        contexts: { type: DataTypes.STRING, defaultValue: '{}' }
}, { tableName: `server_user_permissions` });

module.exports = ServerLuckyPerms;