const Carrinho = require('../model/Carrinho');
const ItemCarrinho = require('../model/ItemCarrinho');
const Produto = require('../model/Produto');

module.exports = class CarrinhoController {

    static async getCarrinho(req, res) {
        try {
            const { sessaoId } = req.params;

            const [carrinho] = await Carrinho.findOrCreate({
                where: { sessaoId }
            });

            const carrinhoCompleto = await Carrinho.findByPk(
                carrinho.id,
                {
                    include: [{
                        model: ItemCarrinho,
                        as: 'itens',
                        include: [{
                            model: Produto,
                            as: 'produto'
                        }]
                    }]
                }
            );

            return res.status(200).json(carrinhoCompleto);

        } catch (err) {
            return res.status(500).json({
                message: 'Erro ao buscar carrinho: ' + err.message
            });
        }
    }

    static async adicionarProduto(req, res) {
        try {
            const { sessaoId } = req.params;
            const { produtoId, quantidade = 1 } = req.body;

            if (
                !Number.isInteger(Number(produtoId)) ||
                Number(produtoId) <= 0 ||
                !Number.isInteger(Number(quantidade)) ||
                Number(quantidade) <= 0
            ) {
                return res.status(422).json({
                    message: 'Produto ou quantidade inválida!'
                });
            }

            const produto = await Produto.findByPk(produtoId);

            if (!produto) {
                return res.status(404).json({
                    message: 'Produto não encontrado!'
                });
            }

            const [carrinho] = await Carrinho.findOrCreate({
                where: { sessaoId }
            });

            const item = await ItemCarrinho.findOne({
                where: {
                    carrinhoId: carrinho.id,
                    produtoId
                }
            });

            if (item) {
                await item.update({
                    quantidade: item.quantidade + Number(quantidade)
                });
            } else {
                await ItemCarrinho.create({
                    carrinhoId: carrinho.id,
                    produtoId,
                    quantidade: Number(quantidade)
                });
            }

            return res.status(201).json({
                message: 'Produto adicionado ao carrinho!'
            });

        } catch (err) {
            return res.status(500).json({
                message: 'Erro ao adicionar produto: ' + err.message
            });
        }
    }

    static async alterarQuantidade(req, res) {
        try {
            const { sessaoId, produtoId } = req.params;
            const { quantidade } = req.body;

            if (
                !Number.isInteger(Number(quantidade)) ||
                Number(quantidade) <= 0
            ) {
                return res.status(422).json({
                    message: 'A quantidade deve ser maior que zero!'
                });
            }

            const carrinho = await Carrinho.findOne({
                where: { sessaoId }
            });

            if (!carrinho) {
                return res.status(404).json({
                    message: 'Carrinho não encontrado!'
                });
            }

            const item = await ItemCarrinho.findOne({
                where: {
                    carrinhoId: carrinho.id,
                    produtoId
                }
            });

            if (!item) {
                return res.status(404).json({
                    message: 'Produto não encontrado no carrinho!'
                });
            }

            await item.update({
                quantidade: Number(quantidade)
            });

            return res.status(200).json({
                message: 'Quantidade atualizada!'
            });

        } catch (err) {
            return res.status(500).json({
                message: 'Erro ao alterar quantidade: ' + err.message
            });
        }
    }

    static async removerProduto(req, res) {
        try {
            const { sessaoId, produtoId } = req.params;

            const carrinho = await Carrinho.findOne({
                where: { sessaoId }
            });

            if (!carrinho) {
                return res.status(404).json({
                    message: 'Carrinho não encontrado!'
                });
            }

            const item = await ItemCarrinho.findOne({
                where: {
                    carrinhoId: carrinho.id,
                    produtoId
                }
            });

            if (!item) {
                return res.status(404).json({
                    message: 'Produto não encontrado no carrinho!'
                });
            }

            await item.destroy();

            return res.status(200).json({
                message: 'Produto removido do carrinho!'
            });

        } catch (err) {
            return res.status(500).json({
                message: 'Erro ao remover produto: ' + err.message
            });
        }
    }

    static async limparCarrinho(req, res) {
        try {
            const { sessaoId } = req.params;

            const carrinho = await Carrinho.findOne({
                where: { sessaoId }
            });

            if (!carrinho) {
                return res.status(404).json({
                    message: 'Carrinho não encontrado!'
                });
            }

            await ItemCarrinho.destroy({
                where: { carrinhoId: carrinho.id }
            });

            return res.status(200).json({
                message: 'Carrinho esvaziado!'
            });

        } catch (err) {
            return res.status(500).json({
                message: 'Erro ao limpar carrinho: ' + err.message
            });
        }
    }
};