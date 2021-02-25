const { sequelize, DataTypes } = require('../database');

const News = sequelize.define('News', {
    id: { type: DataTypes.NUMBER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    img_url: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'news' });

module.exports = News;