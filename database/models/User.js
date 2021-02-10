const { sequelize, DataTypes } = require('../database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT(255),
        autoIncrement: true,
        primaryKey: true
    },
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
    email: {
        type: DataTypes.STRING(255),
        defaultValue: ''
    },
    emailCode: {
        type: DataTypes.STRING(255),
        defaultValue: ''
    },
    tfaSecret: {
        type: DataTypes.STRING(255),
        defaultValue: ''
    },
    tfaType: {
        type: DataTypes.STRING,
        defaultValue: 'none'
    },
    vipLevel: {
        type: DataTypes.NUMBER,
        defaultValue: 0
    },
    donateMoney: {
        type: DataTypes.BIGINT(50),
        defaultValue: 0
    }
}, {
    tableName: 'users'
});

User.prototype.validatePassword = function(candidate){
    return bcrypt.compareSync(candidate, this.password);
}

User.sync({ force: true }).catch((error) => {
    console.error(`Не удалось синхронизировать модель и таблицу 'Users'\n${error}`);
})

module.exports = User;