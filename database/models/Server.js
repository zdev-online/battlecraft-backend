const { sequelize, DataTypes } = require('../database');

const Server = sequelize.define('Server', {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    seoTitle: DataTypes.STRING,
    seoDescription: DataTypes.TEXT,
    seoKeywords: DataTypes.TEXT,
    public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    tableName: 'servers'
});

module.exports = Server;