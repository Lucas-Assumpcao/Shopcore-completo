# ESCOPO — ShopCore

## Motivação

O portfólio atual (Catálogo de Anime/Livros, bot com IA via n8n + Azure OpenAI, Docker + Postman) não cobre dois pontos essenciais para back-end: **banco de dados relacional de verdade** e **autenticação**. O ShopCore existe para fechar essas duas lacunas com um tema de back-end de e-commerce.

## Tema

API de e-commerce full-stack: usuários, produtos e pedidos.

## Escopo (enxuto, de propósito)

Sem cupom, sem categoria de produto, sem carrinho persistente — só o essencial para provar autenticação + relacionamento real entre tabelas + regra de negócio.

## Modelo de dados

- **usuarios**: dados de login (nome, email, senha com hash)
- **produtos**: catálogo com preço e estoque
- **pedidos**: pertence a um usuário (`usuario_id`)
- **itens_pedido**: relaciona pedido ↔ produto, guardando quantidade e **preço no momento da compra** (não referencia o preço atual do produto — histórico não pode mudar se o preço do produto mudar depois)

```
usuarios (1) ──< pedidos (1) ──< itens_pedido >── (1) produtos
```

## Autenticação

- Cadastro e login de usuário
- Senha armazenada com hash (bcrypt)
- Rotas protegidas por JWT (token no header `Authorization: Bearer`)

## CRUD

- **Produtos**: gerenciado pelo admin (criar, listar, editar, remover)
- **Pedidos**: usuário cria pedido e consulta seu histórico

## Regra de negócio

Ao criar um pedido:
1. Verificar se há estoque disponível para cada item
2. Calcular o total automaticamente a partir de quantidade × preço unitário
3. Debitar o estoque do produto

## Stack

- Back-end: Node.js + Express
- Banco: SQLite
- Front-end: React + Tailwind
- Testes de API: Thunder Client

## Status

✅ Etapa 1 — Autenticação concluída (cadastro e login, senha com hash bcrypt, geração de JWT)
🔲 Etapa 2 — Middleware de proteção de rotas (próximo passo)
🔲 Etapa 3 — CRUD de produtos
🔲 Etapa 4 — Pedidos e regra de negócio
🔲 Etapa 5 — Testes via Thunder Client
🔲 Etapa 6 — Front-end (React + Tailwind)

## Decisões e aprendizados (Etapa 1)

- Trocado `better-sqlite3` pelo módulo nativo `node:sqlite` (Release Candidate desde o Node 24.15) — evita a necessidade de compilar código nativo com Visual Studio Build Tools no Windows
- `node:sqlite` não tem o atalho `.pragma()` do `better-sqlite3`; o mesmo efeito é obtido com `db.exec('PRAGMA foreign_keys = ON;')`
- Login e cadastro nunca revelam qual dado está errado (email inexistente vs senha incorreta respondem com a mesma mensagem genérica), evitando enumeração de usuários
- Senha nunca é devolvida nas respostas da API, nem em texto puro nem como hash

## Fora de escopo (decisão consciente)

- Cupons de desconto
- Categorias de produto
- Carrinho persistente entre sessões
- Pagamento real (gateway de pagamento)