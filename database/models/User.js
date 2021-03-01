const { sequelize, DataTypes }  = require('../database');
const bcrypt                    = require('bcrypt');

const User = sequelize.define('User', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false },
    login: { type: DataTypes.STRING, allowNull: false },
    password: { 
        type: DataTypes.STRING,
        allowNull: false,
        set: function (value){
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(value, salt);
            this.setDataValue('password', hash);
        }
    },
    emailCode:  { type: DataTypes.INTEGER, allowNull: true },
    tfaSecret:  { type: DataTypes.STRING, allowNull: true },
    tfaType:    { type: DataTypes.STRING, defaultValue: 'none' },
    skinPath:   { type: DataTypes.STRING, allowNull: true, defaultValue: "/skins/steve.png" },
    role:       { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' }
});

User.prototype.isValidPassword = function(candidate){
    return bcrypt.compareSync(candidate, this.password);
}

module.exports = User;