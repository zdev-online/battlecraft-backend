const { sequelize, DataTypes:Types }  = require('../database');

const News = sequelize.define('News', {
    id: { type: Types.NUMBER, autoIncrement: true, primaryKey: true },
    title: { type: Types.STRING, allowNull: false },
    text: { type: Types.TEXT, allowNull: false },
    img_url: { type: Types.TEXT, allowNull: false },
}, { tableName: 'news' });

module.exports = News;