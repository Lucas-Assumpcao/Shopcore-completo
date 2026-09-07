const db = require('../config/database');

function listarProdutos(req, res) {
  const produtos = db.prepare('SELECT * FROM produtos').all();
  res.json(produtos);
}

function criarProduto(req, res) {
  const { nome, preco, estoque } = req.body;

  const resultado = db
    .prepare('INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)')
    .run(nome, preco, estoque);

  res.status(201).json({ id: resultado.lastInsertRowid, nome, preco, estoque });
}

function atualizarProduto(req, res) {
  const { id } = req.params;
  const { nome, preco, estoque } = req.body;

  const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(id);
  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  db.prepare('UPDATE produtos SET nome = ?, preco = ?, estoque = ? WHERE id = ?')
    .run(nome, preco, estoque, id);

  res.json({ id: Number(id), nome, preco, estoque });
}

function removerProduto(req, res) {
  const { id } = req.params;

  const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(id);
  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  db.prepare('DELETE FROM produtos WHERE id = ?').run(id);

  res.status(204).send();
}

module.exports = { listarProdutos, criarProduto, atualizarProduto, removerProduto };
