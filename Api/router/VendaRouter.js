const router = require('express').Router();
const VendaController = require('../Controller/VendaController.js');

router.post('/finalizar/:sessaoId', VendaController.finalizar);
router.get('/getAll', VendaController.getAll);

module.exports = router;