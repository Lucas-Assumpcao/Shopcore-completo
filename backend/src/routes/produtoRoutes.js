const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth');
const {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  removerProduto,
} = require('../controllers/produtoController');

router.get('/', listarProdutos);
router.post('/', verificarToken, criarProduto);
router.put('/:id', verificarToken, atualizarProduto);
router.delete('/:id', verificarToken, removerProduto);

module.exports = router;
