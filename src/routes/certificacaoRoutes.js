const express = require('express');
const certificacaoController = require('../controllers/certificacaoController');

const router = express.Router();

router.post('/', certificacaoController.create);
router.get('/', certificacaoController.findAll);
router.get('/:id', certificacaoController.findById);
router.put('/:id', certificacaoController.update);
router.delete('/:id', certificacaoController.remove);

module.exports = router;