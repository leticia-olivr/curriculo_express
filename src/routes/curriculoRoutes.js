const express = require('express');
const curriculoController = require('../controllers/curriculoController');

const router = express.Router();

router.get('/:pessoaId', curriculoController.findByPessoaId);

module.exports = router;