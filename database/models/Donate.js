const { sequelize, DataTypes }  = require('../database');

const Donate = sequelize.define('Donate', {
   id: {
       type: DataTypes.NUMBER,
       allowNull: false,
       primaryKey: true
   },
   expires: {
       type: DataTypes.NUMBER,
       allowNull: false
   },
   server: {
       type: DataTypes.STRING,
       allowNull: false
   }
}, {
    tableName: 'donate'
});

module.exports = Donate;
