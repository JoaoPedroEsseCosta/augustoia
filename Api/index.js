const express = require('express');
const app = express();
const port = 5000;
const conn = require('./db/conn.js');
const cors = require('cors');

app.use(express.json());
app.use(cors({ credentials: true, origin: '*' }));

const Produto = require('./model/Produto');
const Venda = require('./model/Venda');
const ItemVenda = require('./model/ItemVenda');
const Carrinho = require('./model/Carrinho');
const ItemCarrinho = require('./model/ItemCarrinho');

Venda.hasMany(ItemVenda, {
    as: 'itens',
    foreignKey: 'vendaId'
});

ItemVenda.belongsTo(Venda, {
    foreignKey: 'vendaId'
});

ItemVenda.belongsTo(Produto, {
    as: 'produto',
    foreignKey: 'produtoId'
});

Produto.hasMany(ItemVenda, {
    foreignKey: 'produtoId'
});

Carrinho.hasMany(ItemCarrinho, {
    as: 'itens',
    foreignKey: 'carrinhoId'
});

ItemCarrinho.belongsTo(Carrinho, {
    foreignKey: 'carrinhoId'
});

ItemCarrinho.belongsTo(Produto, {
    as: 'produto',
    foreignKey: 'produtoId'
});

Produto.hasMany(ItemCarrinho, {
    foreignKey: 'produtoId'
});

const ProdutoRouter = require('./router/ProdutoRouter.js');
const VendaRouter = require('./router/VendaRouter.js');
const CarrinhoRouter = require('./router/CarrinhoRouter.js');

app.use('/Produto', ProdutoRouter);
app.use('/Venda', VendaRouter);
app.use('/Carrinho', CarrinhoRouter);

conn
    .sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    })
    .catch((err) => console.log(err));