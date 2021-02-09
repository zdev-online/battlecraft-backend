const { sequelize, DataTypes } = require('../database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { message: 'Username required', code: 400 }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { message: 'Password required', code: 400 }
        },
        set(value){
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(value, salt);
            this.setDataValue('password', hash);
        }
    },
    vip: {
        type: DataTypes.NUMBER,
        defaultValue: 0
    },
    donateMoney: {
        type: DataTypes.BIGINT(50),
        defaultValue: 0
    }
});

User.prototype.validatePassword = function(candidate){
    return bcrypt.compareSync(candidate, this.password);
}

module.exports = User;