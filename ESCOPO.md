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
✅ Etapa 2 — Middleware de proteção de rotas concluído (verificação de JWT no header Authorization)
✅ Etapa 3 — CRUD de produtos concluído (listagem pública, criação/edição/remoção protegidas por JWT)
✅ Etapa 4 — Pedidos e regra de negócio concluído (verificação de estoque, cálculo automático de total, transação)
✅ Etapa 5 — Testes via Thunder Client concluído (todas as rotas e cenários de erro validados)
✅ Etapa 6 — Front-end (React + Tailwind)
  - ✅ 6.1 Setup do projeto (Vite + React + Tailwind, api.js centralizado)
  - ✅ 6.2 Autenticação no front (AuthContext, tela de Login, tratamento de erro)
  - ✅ 6.3 Listagem de produtos (grid com nome, preço e estoque, consumindo GET /produtos)
  - ✅ 6.4 Carrinho de compras (Context com adicionar/remover/somar quantidade, cálculo de total)
  - ✅ 6.5 Finalizar pedido (POST /pedidos, tratamento de sucesso e erro de estoque na tela)
  - ✅ 6.6 Histórico de pedidos (GET /pedidos, navegação por abas entre Produtos e Meus pedidos)

**Projeto concluído — todas as etapas testadas de ponta a ponta.**

## Decisões e aprendizados (Etapa 6.3 a 6.6)

- Listagem de produtos e histórico de pedidos usam `useEffect` com array de dependências vazio (`[]`) para buscar dados uma única vez ao montar o componente
- Carrinho traduz `{ produto, quantidade }` (formato interno) para `{ produto_id, quantidade }` (formato esperado pela API) apenas no momento de finalizar o pedido
- Navegação entre "Produtos" e "Meus pedidos" resolvida com abas simples via `useState`, sem precisar de biblioteca de rotas (escopo enxuto, sem React Router)

## Decisões e aprendizados (Etapa 6.1 e 6.2)

- Cliente de API centralizado em `services/api.js`: anexa o token JWT automaticamente via `localStorage`, evitando repetir essa lógica em cada tela
- Estado de autenticação compartilhado via `AuthContext` (Context API do React) — evita passar o token manualmente entre componentes
- Erro do formulário de login tratado localmente com `try/catch`, mostrando mensagem sem trocar de tela

## Testes realizados (Etapa 5)

| Rota | Cenário | Resultado |
|---|---|---|
| `POST /auth/cadastro` | Cadastro válido | 201 + dados do usuário (sem senha) |
| `POST /auth/cadastro` | Email já existente | 400 |
| `POST /auth/login` | Credenciais corretas | 200 + token JWT |
| `POST /auth/login` | Senha errada | 401 |
| `GET /produtos` | Sem token (pública) | 200 + array de produtos |
| `POST /produtos` | Sem token | 401 |
| `POST /produtos` | Com token válido | 201 + produto criado |
| `PUT /produtos/:id` | Com token válido | 200 + produto atualizado |
| `DELETE /produtos/:id` | Com token válido | 204 |
| `POST /pedidos` | Estoque suficiente | 201 + total calculado, estoque debitado |
| `POST /pedidos` | Estoque insuficiente | 400, estoque inalterado (rollback) |
| `GET /pedidos` | Com token | 200 + histórico do usuário

## Decisões e aprendizados (Etapa 4)

- Criação de pedido usa transação (`BEGIN`/`COMMIT`/`ROLLBACK`) — se qualquer item falhar (produto inexistente ou estoque insuficiente), nada é salvo e o estoque não é alterado
- Preço gravado em `itens_pedido` vem do produto no momento da compra, não é recalculado depois — histórico do pedido não muda se o preço do produto mudar
- Total do pedido é calculado no back-end (quantidade × preço atual), nunca confiando em um valor enviado pelo cliente
- Ambas as rotas de pedidos (`POST` e `GET`) são protegidas — diferente de produtos, não existe pedido "público"
- Testado: criação com sucesso debita estoque corretamente; pedido com quantidade acima do estoque é bloqueado com 400 e não altera nada; histórico lista corretamente os pedidos do usuário logado

## Decisões e aprendizados (Etapa 3)

- Rota `GET /produtos` é pública (listagem do catálogo); `POST`, `PUT` e `DELETE` são protegidas pelo middleware `verificarToken`
- `req.params.id` usado para identificar o produto em `PUT /produtos/:id` e `DELETE /produtos/:id` — diferente do `req.body`, que carrega os dados a serem gravados
- Testado que a proteção funciona nos dois sentidos: bloqueia com `401` sem token, libera com `201` quando o header `Authorization: Bearer <token>` está correto

## Decisões e aprendizados (Etapa 1)

- Trocado `better-sqlite3` pelo módulo nativo `node:sqlite` (Release Candidate desde o Node 24.15) — evita a necessidade de compilar código nativo com Visual Studio Build Tools no Windows
- `node:sqlite` não tem o atalho `.pragma()` do `better-sqlite3`; o mesmo efeito é obtido com `db.exec('PRAGMA foreign_keys = ON;')`
- Login e cadastro nunca revelam qual dado está errado (email inexistente vs senha incorreta respondem com a mesma mensagem genérica), evitando enumeração de usuários
- Senha nunca é devolvida nas respostas da API, nem em texto puro nem como hash

## Decisões e aprendizados (Etapa 2)

- Middleware criado em `middlewares/auth.js` (não em `controllers/`) — middleware é reusado por várias rotas, não pertence à lógica de uma rota específica
- Token esperado no header `Authorization: Bearer <token>`; `jwt.verify` valida assinatura e expiração ao mesmo tempo
- `req.usuario` é populado pelo middleware para que os próximos controllers (produtos, pedidos) saibam de quem é a requisição sem repetir a verificação

## Fora de escopo (decisão consciente)

- Cupons de desconto
- Categorias de produto
- Carrinho persistente entre sessões
- Pagamento real (gateway de pagamento)

## Considerações finais

O ShopCore fechou as duas lacunas que motivaram o projeto: banco de dados relacional de verdade (4 tabelas com chave estrangeira, transação garantindo consistência entre pedido e estoque) e autenticação completa (hash de senha, JWT, middleware de proteção reutilizável).

**Principais desafios técnicos superados:**
- Migração de `better-sqlite3` para `node:sqlite` por incompatibilidade de compilação nativa no Windows — resolvido sem perder a API síncrona nem a funcionalidade
- Uso de transação (`BEGIN`/`COMMIT`/`ROLLBACK`) para garantir que a criação de pedido nunca deixe o banco num estado inconsistente
- Modelagem correta do histórico de preço (`itens_pedido.preco_unitario`), evitando que o histórico de vendas mude se o preço do produto for atualizado depois

**Habilidades demonstradas para o portfólio:** modelagem de banco relacional, autenticação com JWT e hash de senha, regras de negócio com transação, consumo de API protegida em React via Context API, e organização de código em camadas (rotas, controllers, middlewares).

**Próximos passos possíveis** (fora do escopo atual, mas naturais de evoluir): paginação na listagem de produtos, refresh token, deploy do back-end e front-end.