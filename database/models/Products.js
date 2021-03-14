const { sequelize, DataTypes:Types } = require('../database');

const Products = sequelize.define('Products', {
    id:     { type: Types.BIGINT, autoIncrement: true, primaryKey: true },
    title:  { type: Types.STRING, allowNull: false },
    type:   { type: Types.STRING, allowNull: false },
    server: { type: Types.STRING, allowNull: false },
    price:  { type: Types.BIGINT, allowNull: false },
    command:{ type: Types.STRING, allowNull: true  },
    image:  { type: Types.STRING, allowNull: true  }
}, { tableName: "products" });

module.exports = Products;
