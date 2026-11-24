const router = require('express').Router();
const CarrinhoController = require('../Controller/CarrinhoController.js');

router.get('/:sessaoId', CarrinhoController.getCarrinho);

router.post('/:sessaoId/itens', CarrinhoController.adicionarProduto);

router.patch(
    '/:sessaoId/itens/:produtoId',
    CarrinhoController.alterarQuantidade
);

router.delete(
    '/:sessaoId/itens/:produtoId',
    CarrinhoController.removerProduto
);

router.delete('/:sessaoId', CarrinhoController.limparCarrinho);

module.exports = router;