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

News.sync().catch((error) => {
    console.error(`Не удалось синхронизировать модель и таблицу 'News'\n${error}`);
})

module.exports = News;