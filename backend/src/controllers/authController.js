const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

async function cadastrar(req, res) {
  const { nome, email, senha } = req.body;

  const existente = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
  if (existente) {
    return res.status(400).json({ erro: 'Email já cadastrado' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const resultado = db
    .prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)')
    .run(nome, email, senhaHash);

  res.status(201).json({ id: resultado.lastInsertRowid, nome, email });
}

async function login(req, res) {
  const { email, senha } = req.body;

  const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (!usuario) {
    return res.status(401).json({ erro: 'Email ou senha inválidos' });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaValida) {
    return res.status(401).json({ erro: 'Email ou senha inválidos' });
  }

  const token = jwt.sign(
    { id: usuario.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({ token });
}

module.exports = { cadastrar, login };
