const { sequelize, DataTypes:Types } = require('../database');

const Skins = sequelize.define("Skins", {
    Nick: { type: Types.STRING, allowNull: false, primaryKey: true },
    Value: { type: Types.TEXT },
    Signature: { type: Types.TEXT },
    timestamp: { type: Types.TEXT }
}, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    tableName: 'skins'
});

module.exports = Skins;