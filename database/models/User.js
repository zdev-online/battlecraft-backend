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
    ref_code:   { type: Types.STRING, allowNull: false },
    emailCode:  { type: Types.INTEGER, allowNull: true },
    tfaSecret:  { type: Types.STRING, allowNull: true },
    tfaType:    { type: Types.STRING, defaultValue: 'none' },
    skin:       { type: Types.STRING, allowNull: true, defaultValue: "steve.png" },
    role:       { type: Types.STRING, allowNull: false, defaultValue: 'user' },
    crystals:   { type: Types.BIGINT, allowNull: false, defaultValue: 0 }
}, {
    tableName: "users"
});

User.prototype.isValidPassword = function(candidate){
    return bcrypt.compareSync(candidate, this.password);
}

module.exports = User;