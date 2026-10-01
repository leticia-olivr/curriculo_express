const express = require('express');
const pessoaController = require('../controllers/pessoaController');

const router = express.Router();

router.post('/', pessoaController.create);
router.get('/', pessoaController.findAll);
router.get('/:id', pessoaController.findById);
router.put('/:id', pessoaController.update);
router.delete('/:id', pessoaController.remove);

module.exports = router;