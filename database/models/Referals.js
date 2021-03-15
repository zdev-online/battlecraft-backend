const { sequelize, DataTypes:Types } = require('../database');

const Referals = sequelize.define('Referals', {
    id: { type: Types.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: Types.BIGINT, allowNull: false },
    owner_id: { type: Types.BIGINT, allowNull: true }
}, { tableName: 'referals' });

module.exports = Referals;