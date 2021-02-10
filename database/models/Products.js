const { sequelize, DataTypes } = require('../database');

const Products = sequelize.define('Products', {
    id: {
        type: DataTypes.BIGINT(255),
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.TEXT(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT(255),
        allowNull: true
    },
    image : {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    price: {
        type: DataTypes.BIGINT(255),
        allowNull: false
    }
}, { 
    tableName: 'products' 
});

Products.sync({ force: true }).catch((error) => {
    console.error(`Не удалось синхронизировать модель и таблицу 'Server'\n${error}`);
});

module.exports = Products;
