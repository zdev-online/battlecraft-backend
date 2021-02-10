const { sequelize, DataTypes } = require('../database');

const Temp2fa = sequelize.define('Temp2fa', {
    id: {
        type: DataTypes.BIGINT(255),
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.BIGINT(255),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    expires: {
        type: DataTypes.BIGINT(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
});



module.exports = Temp2fa;