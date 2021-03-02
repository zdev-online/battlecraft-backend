const { sequelize, DataTypes:Types }  = require('../database');

const Donate = sequelize.define('Donate', {
   id: {
       type: Types.NUMBER,
       allowNull: false,
       primaryKey: true
   },
   expires: {
       type: Types.NUMBER,
       allowNull: false
   },
   server: {
       type: Types.STRING,
       allowNull: false
   }
}, {
    tableName: 'donate'
});

module.exports = Donate;
