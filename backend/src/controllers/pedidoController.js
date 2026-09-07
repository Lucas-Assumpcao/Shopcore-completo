const db = require('../config/database');

function criarPedido(req, res) {
  const { itens } = req.body;
  const usuarioId = req.usuario.id;

  if (!itens || itens.length === 0) {
    return res.status(400).json({ erro: 'Pedido precisa ter ao menos um item' });
  }

  try {
    db.exec('BEGIN');

    let total = 0;
    const itensValidados = [];

    // 1. valida estoque e monta os dados de cada item
    for (const item of itens) {
      const produto = db
        .prepare('SELECT * FROM produtos WHERE id = ?')
        .get(item.produto_id);

      if (!produto) {
        throw new Error(`Produto ${item.produto_id} não encontrado`);
      }

      if (produto.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para o produto "${produto.nome}"`);
      }

      const subtotal = produto.preco * item.quantidade;
      total += subtotal;

      itensValidados.push({
        produto_id: produto.id,
        quantidade: item.quantidade,
        preco_unitario: produto.preco,
      });
    }

    // 2. cria o pedido
    const resultadoPedido = db
      .prepare('INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)')
      .run(usuarioId, total);

    const pedidoId = resultadoPedido.lastInsertRowid;

    // 3. cria os itens do pedido e debita o estoque
    for (const item of itensValidados) {
      db.prepare(
        'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)'
      ).run(pedidoId, item.produto_id, item.quantidade, item.preco_unitario);

      db.prepare('UPDATE produtos SET estoque = estoque - ? WHERE id = ?')
        .run(item.quantidade, item.produto_id);
    }

    db.exec('COMMIT');

    res.status(201).json({ id: pedidoId, total, itens: itensValidados });
  } catch (err) {
    db.exec('ROLLBACK');
    res.status(400).json({ erro: err.message });
  }
}

function listarPedidos(req, res) {
  const usuarioId = req.usuario.id;

  const pedidos = db
    .prepare('SELECT * FROM pedidos WHERE usuario_id = ?')
    .all(usuarioId);

  res.json(pedidos);
}

module.exports = { criarPedido, listarPedidos };
