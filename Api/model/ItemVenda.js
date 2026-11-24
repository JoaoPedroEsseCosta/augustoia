const { DataTypes } = require('sequelize');
const db = require('../db/conn.js');

const ItemVenda = db.define('ItemVenda', {
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precoUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    vendaId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    produtoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = ItemVenda;