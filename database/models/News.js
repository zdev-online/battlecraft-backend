const { sequelize, DataTypes } = require('../database');

const News = sequelize.define('News', {
    id: {
        type: DataTypes.BIGINT(255),
        autoIncrement: true,
        primaryKey: true
    },
    category: {
        type: DataTypes.ENUM('main', 'develop'),
        defaultValue: 'main',
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: DataTypes.STRING,
    shortText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    seoTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    seoDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    seoKeywords: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'news'
});


module.exports = News;