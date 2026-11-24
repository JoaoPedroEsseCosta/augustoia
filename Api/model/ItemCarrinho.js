const { DataTypes } = require('sequelize');
const db = require('../db/conn.js');

const ItemCarrinho = db.define('ItemCarrinho', {
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    carrinhoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    produtoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = ItemCarrinho;