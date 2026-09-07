const BASE_URL = 'http://localhost:3000';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const erro = await response.json().catch(() => ({}));
    throw new Error(erro.erro || `Erro ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  cadastrar: (dados) => request('/auth/cadastro', { method: 'POST', body: JSON.stringify(dados) }),
  login: (dados) => request('/auth/login', { method: 'POST', body: JSON.stringify(dados) }),
  listarProdutos: () => request('/produtos'),
  criarPedido: (itens) => request('/pedidos', { method: 'POST', body: JSON.stringify({ itens }) }),
  listarPedidos: () => request('/pedidos'),
};
