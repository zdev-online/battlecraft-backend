const { sequelize, DataTypes:Types }  = require('../database');

const Streams = sequelize.define('Streams', {
    id: { type: Types.NUMBER, autoIncrement: true, primaryKey: true },
    channel: { type: Types.STRING, allowNull: false }
}, { tableName: 'streams' });

module.exports = Streams;