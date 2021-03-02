const { sequelize, DataTypes:Types }  = require('../database');

const Temp2fa = sequelize.define('Temp2fa', {
    userId: {
        type: Types.BIGINT,
        allowNull: false
    },
    tfaType: {
        type: Types.STRING,
        allowNull: false
    },
    tfaCode: {
        type: Types.STRING,
        allowNull: false
    },
    expires: {
        type: Types.BIGINT,
        allowNull: false
    }
});

module.exports = Temp2fa;