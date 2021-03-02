const { sequelize, DataTypes:Types }  = require('../database');;
const bcrypt                    = require('bcrypt');

const User = sequelize.define('User', {
    id: { type: Types.BIGINT, autoIncrement: true, primaryKey: true },
    email: { type: Types.STRING, allowNull: false },
    login: { type: Types.STRING, allowNull: false },
    password: { 
        type: Types.STRING,
        allowNull: false,
        set: function (value){
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(value, salt);
            this.setDataValue('password', hash);
        }
    },
    emailCode:  { type: Types.INTEGER, allowNull: true },
    tfaSecret:  { type: Types.STRING, allowNull: true },
    tfaType:    { type: Types.STRING, defaultValue: 'none' },
    skinPath:   { type: Types.STRING, allowNull: true, defaultValue: "/skins/steve.png" },
    role:       { type: Types.STRING, allowNull: false, defaultValue: 'user' }
});

User.prototype.isValidPassword = function(candidate){
    return bcrypt.compareSync(candidate, this.password);
}

module.exports = User;