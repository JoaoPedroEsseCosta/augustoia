const Produto = require('../model/Produto');

module.exports = class ProdutoController {
    static async create(req, res) {
        const { nome, preco } = req.body;

       if (preco === undefined || preco === null || preco === '') {
    return res.status(422).json({
        message: 'O preço é obrigatório!'
    });
}

if (!Number.isFinite(Number(preco)) || Number(preco) < 0) {
    return res.status(422).json({
        message: 'O preço não pode ser negativo!'
    });
}

        const produto = new Produto({ nome, preco });

        try {
            await produto.save();
            res.status(201).json({
                message: 'Produto criado com sucesso',
                produto
            });
        } catch (err) {
            res.status(500).json({
                message: 'Erro ao criar o produto: ' + err
            });
        }
    }

    static async getAll(req, res) {
        try {
            const produtos = await Produto.findAll();
            res.status(200).json(produtos);
        } catch (err) {
            res.status(500).json({
                message: 'Erro ao buscar os produtos: ' + err
            });
        }
    }

    static async getById(req, res) {
        const { id } = req.params;

        try {
            const produto = await Produto.findByPk(id);

            if (!produto) {
                return res.status(404).json({
                    message: 'Produto não encontrado!'
                });
            }

            res.status(200).json(produto);
        } catch (err) {
            res.status(500).json({
                message: 'Erro ao buscar o produto: ' + err
            });
        }
    }

    static async update(req, res) {
        const { id } = req.params;
        const { nome, preco } = req.body;

        try {
            const produto = await Produto.findByPk(id);

            if (!produto) {
                return res.status(404).json({
                    message: 'Produto não encontrado'
                });
            }

            await produto.update({ nome, preco });

            res.status(200).json({
                message: 'Produto atualizado com sucesso'
            });
        } catch (err) {
            res.status(500).json({
                message: 'Erro ao atualizar o produto: ' + err
            });
        }
    }

    static async delete(req, res) {
        const { id } = req.params;

        try {
            const produto = await Produto.findByPk(id);

            if (!produto) {
                return res.status(404).json({
                    message: 'Produto não encontrado'
                });
            }

            await produto.destroy();

            res.status(200).json({
                message: 'Produto deletado com sucesso!'
            });
        } catch (err) {
            res.status(500).json({
                message: 'Erro ao deletar o produto: ' + err
            });
        }
    }
};