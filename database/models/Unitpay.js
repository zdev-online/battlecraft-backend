const { sequelize, DataTypes:Types } = require('../database');

const Unitpay = sequelize.define('Unitpay', {
    id:     { type: Types.BIGINT, autoIncrement: true, primaryKey: true },
    sum:    { type: Types.BIGINT, allowNull: false },
    payId:  { type: Types.BIGINT, allowNull: false },
    email:  { type: Types.STRING, allowNull: false },
    sign:   { type: Types.STRING, allowNull: false }
}, { tableName: 'unitpay' });

module.exports = Unitpay;