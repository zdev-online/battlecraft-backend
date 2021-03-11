const { sequelize, DataTypes:Types } = require('../database');

const Players = sequelize.define("Players", {
    Nick: { type: Types.STRING, allowNull: false, primaryKey: true },
    Skin: { type: Types.STRING, allowNull: false }
}, {
    tableName: 'players'
});

module.exports = Players;