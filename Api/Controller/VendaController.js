const Venda = require('../model/Venda');
const ItemVenda = require('../model/ItemVenda');
const Carrinho = require('../model/Carrinho');
const ItemCarrinho = require('../model/ItemCarrinho');
const Produto = require('../model/Produto');
const db = require('../db/conn.js');

module.exports = class VendaController {

    static async finalizar(req, res) {
        const { sessaoId } = req.params;

        try {
            const carrinho = await Carrinho.findOne({
                where: { sessaoId },
                include: [{
                    model: ItemCarrinho,
                    as: 'itens',
                    include: [{
                        model: Produto,
                        as: 'produto'
                    }]
                }]
            });

            if (!carrinho || carrinho.itens.length === 0) {
                return res.status(422).json({
                    message: 'O carrinho está vazio!'
                });
            }

            for (const item of carrinho.itens) {
                if (!item.produto) {
                    return res.status(422).json({
                        message: 'Um produto do carrinho não foi encontrado!'
                    });
                }

                if (
                    !Number.isInteger(Number(item.quantidade)) ||
                    Number(item.quantidade) <= 0
                ) {
                    return res.status(422).json({
                        message: 'Quantidade inválida!'
                    });
                }
            }

            let totalCentavos = 0;

            const itensVenda = carrinho.itens.map(item => {
                const precoCentavos = Math.round(
                    Number(item.produto.preco) * 100
                );

                totalCentavos += precoCentavos * item.quantidade;

                return {
                    produtoId: item.produtoId,
                    quantidade: item.quantidade,
                    precoUnitario: (precoCentavos / 100).toFixed(2)
                };
            });

            const total = (totalCentavos / 100).toFixed(2);

            const venda = await db.transaction(async (transaction) => {

                const novaVenda = await Venda.create({
                    total,
                    status: 'concluida'
                }, { transaction });

                const itensParaSalvar = itensVenda.map(item => ({
                    ...item,
                    vendaId: novaVenda.id
                }));

                await ItemVenda.bulkCreate(itensParaSalvar, {
                    transaction
                });

                await ItemCarrinho.destroy({
                    where: {
                        carrinhoId: carrinho.id
                    },
                    transaction
                });

                return novaVenda;
            });

            return res.status(201).json({
                message: 'Venda finalizada com sucesso!',
                venda
            });

        } catch (err) {
            return res.status(500).json({
                message: 'Erro ao finalizar venda: ' + err.message
            });
        }
    }

    static async getAll(req, res) {
        try {
            const vendas = await Venda.findAll({
                include: [{
                    model: ItemVenda,
                    as: 'itens',
                    include: [{
                        model: Produto,
                        as: 'produto'
                    }]
                }],
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json(vendas);

        } catch (err) {
            return res.status(500).json({
                message: 'Erro ao buscar vendas: ' + err.message
            });
        }
    }
};