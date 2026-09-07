# ShopCore

API de back-end de e-commerce (usuários, produtos e pedidos) construída para praticar autenticação com JWT e modelagem de banco relacional — as duas lacunas do meu portfólio anterior.

## Stack

- **Back-end:** Node.js + Express
- **Banco:** SQLite
- **Autenticação:** bcrypt (hash de senha) + JWT (rotas protegidas)
- **Front-end:** React + Tailwind
- **Testes de API:** Thunder Client

## Funcionalidades

- Cadastro e login de usuário (senha com hash, sessão via JWT)
- CRUD de produtos (admin)
- Criação de pedidos com verificação automática de estoque e cálculo de total
- Histórico de pedidos por usuário

## Modelo de dados

| Tabela | Descrição |
|---|---|
| `usuarios` | Dados de login |
| `produtos` | Catálogo com preço e estoque |
| `pedidos` | Pertence a um usuário |
| `itens_pedido` | Relaciona pedido ↔ produto (quantidade + preço no momento da compra) |

## Estrutura de pastas

```
shopcore/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   ├── database.sqlite
│   └── .env
└── frontend/
```

## Como rodar

```bash
# back-end
cd backend
npm install
npm run dev

# front-end
cd frontend
npm install
npm run dev
```

## Rotas da API

| Método | Rota | Protegida | Descrição |
|---|---|---|---|
| POST | `/auth/cadastro` | Não | Cria novo usuário |
| POST | `/auth/login` | Não | Autentica e retorna JWT |
| GET | `/produtos` | Não | Lista produtos |
| POST | `/produtos` | Sim (admin) | Cria produto |
| PUT | `/produtos/:id` | Sim (admin) | Edita produto |
| DELETE | `/produtos/:id` | Sim (admin) | Remove produto |
| POST | `/pedidos` | Sim | Cria pedido (verifica estoque, calcula total) |
| GET | `/pedidos` | Sim | Lista histórico de pedidos do usuário |

## Status

**Projeto concluído.** Back-end (autenticação, CRUD de produtos, pedidos com regra de negócio) e front-end (login, listagem, carrinho, finalização de pedido, histórico) completos e testados de ponta a ponta.

## Escopo

Ver [ESCOPO.md](./ESCOPO.md) para detalhes de modelagem, regras de negócio e decisões de escopo.