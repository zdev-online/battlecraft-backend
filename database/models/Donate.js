const { sequelize, DataTypes:Types }  = require('../database');

const Donate = sequelize.define('Donate', {
   id: {
       type: Types.BIGINT,
       primaryKey: true
   },
   expires: {
       type: Types.BIGINT,
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
