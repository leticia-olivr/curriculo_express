const express = require('express');
const habilidadeController = require('../controllers/habilidadeController');

const router = express.Router();

router.post('/', habilidadeController.create);
router.get('/', habilidadeController.findAll);
router.get('/:id', habilidadeController.findById);
router.put('/:id', habilidadeController.update);
router.delete('/:id', habilidadeController.remove);

module.exports = router;