const express = require('express');
const experienciaController = require('../controllers/experienciaController');

const router = express.Router();

router.post('/', experienciaController.create);
router.get('/', experienciaController.findAll);
router.get('/:id', experienciaController.findById);
router.put('/:id', experienciaController.update);
router.delete('/:id', experienciaController.remove);

module.exports = router;