const { sequelize, DataTypes: Types } = require('../database');

const EnotIO = sequelize.define('EnotIO', {
    id:     { type: Types.BIGINT, autoIncrement: true, primaryKey: true },
    sum:    { type: Types.BIGINT, allowNull: false },
    email:  { type: Types.STRING, allowNull: false, unique: true }
}, { tableName: "enotio" });

module.exports = EnotIO;