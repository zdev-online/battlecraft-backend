const { sequelize, DataTypes } = require('../database');

const News = sequelize.define('News', {
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
    fullText: DataTypes.TEXT,
    seoTitle: DataTypes.STRING,
    seoDescription: DataTypes.TEXT,
    seoKeywords: DataTypes.TEXT,
    public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
});

module.exports = News;