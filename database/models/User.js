const { sequelize, DataTypes }  = require('../database');
const bcrypt                    = require('bcrypt');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false },
    login: { type: DataTypes.STRING, allowNull: false },
    password: { 
        type: DataTypes.STRING,
        allowNull: false,
        set: function (value){
            let salt = bcrypt.genSaltSync(50);
            let hash = bcrypt.hashSync(value, salt);
            this.setDataValue('password', hash);
        }
    }
});

User.prototype.isValidPassword = function(candidate){
    return bcrypt.compareSync(candidate, this.password);
}

module.exports = User;