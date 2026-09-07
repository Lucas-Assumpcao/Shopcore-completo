import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api
      .listarProdutos()
      .then(setProdutos)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return <p className="text-center mt-10 text-gray-500">Carregando produtos...</p>;
  }

  if (erro) {
    return <p className="text-center mt-10 text-red-600">{erro}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Produtos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {produtos.map((produto) => (
          <div key={produto.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="font-semibold text-gray-800">{produto.nome}</h2>
            <p className="text-blue-600 font-bold mt-1">
              R$ {produto.preco.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">Estoque: {produto.estoque}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
