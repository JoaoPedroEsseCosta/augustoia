const { DataTypes } = require('sequelize');
const db = require('../db/conn.js');

const Carrinho = db.define('Carrinho', {
    sessaoId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = Carrinho;