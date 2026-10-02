const express = require('express');
const projetoController = require('../controllers/projetoController');

const router = express.Router();

router.post('/', projetoController.create);
router.get('/', projetoController.findAll);
router.get('/:id', projetoController.findById);
router.put('/:id', projetoController.update);
router.delete('/:id', projetoController.remove);

module.exports = router;