require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config/database'); // garante que o banco e as tabelas existem

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// TODO (amanhã): app.use('/auth', require('./routes/authRoutes'));
// TODO: app.use('/produtos', require('./routes/produtoRoutes'));
// TODO: app.use('/pedidos', require('./routes/pedidoRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ShopCore backend rodando na porta ${PORT}`);
});
