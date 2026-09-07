const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth');
const { criarPedido, listarPedidos } = require('../controllers/pedidoController');

router.post('/', verificarToken, criarPedido);
router.get('/', verificarToken, listarPedidos);

module.exports = router;
