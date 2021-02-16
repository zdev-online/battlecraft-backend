const { sequelize, DataTypes }  = require('../database');

const Temp2fa = sequelize.define('Temp2fa', {
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    tfaType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tfaCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expires: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
});

module.exports = Temp2fa;