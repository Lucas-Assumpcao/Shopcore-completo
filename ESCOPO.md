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

🔲 Não iniciado — modelo de dados e estrutura de pastas definidos, próximo passo é a rota de autenticação.

## Fora de escopo (decisão consciente)

- Cupons de desconto
- Categorias de produto
- Carrinho persistente entre sessões
- Pagamento real (gateway de pagamento)
