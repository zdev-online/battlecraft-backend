const { sequelize, DataTypes:Types } = require('../database');

const QiwiModel = sequelize.define('qiwi', {
    id: { type: Types.NUMBER, autoIncrement: true },
    billId: { type: Types.STRING, allowNull: false },
    email: { type: Types.STRING, allowNull: false },
    amount: { type: Types.NUMBER, allowNull: false }
}, { tableName: 'qiwi' });     

module.exports = QiwiModel;