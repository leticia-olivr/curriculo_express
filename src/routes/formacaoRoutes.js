const express = require('express');
const formacaoController = require('../controllers/formacaoController');

const router = express.Router();

router.post('/', formacaoController.create);
router.get('/', formacaoController.findAll);
router.get('/:id', formacaoController.findById);
router.put('/:id', formacaoController.update);
router.delete('/:id', formacaoController.remove);

module.exports = router;