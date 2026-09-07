import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api
      .listarPedidos()
      .then(setPedidos)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return <p className="text-center mt-10 text-gray-500">Carregando pedidos...</p>;
  }

  if (erro) {
    return <p className="text-center mt-10 text-red-600">{erro}</p>;
  }

  if (pedidos.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Você ainda não fez nenhum pedido.
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Meus pedidos</h1>

      <ul className="flex flex-col gap-3">
        {pedidos.map((pedido) => (
          <li
            key={pedido.id}
            className="border rounded-lg p-4 bg-white shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">Pedido #{pedido.id}</p>
              <p className="text-sm text-gray-500">
                {new Date(pedido.criado_em).toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-gray-500 capitalize">{pedido.status}</p>
            </div>
            <span className="font-bold text-blue-600">
              R$ {pedido.total.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
