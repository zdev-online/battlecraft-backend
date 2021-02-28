const { sequelize, DataTypes } = require('../database');

const Streams = sequelize.define('Streams', {
    id: { type: DataTypes.NUMBER, autoIncrement: true, primaryKey: true },
    channel: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'streams' });

module.exports = Streams;