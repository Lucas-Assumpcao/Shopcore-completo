import { useState } from 'react';
import { useCarrinho } from '../context/CarrinhoContext';
import { api } from '../services/api';

export function Carrinho() {
  const { itens, removerItem, total, limparCarrinho } = useCarrinho();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  async function finalizarPedido() {
    setEnviando(true);
    setErro('');
    setSucesso(false);

    const itensParaApi = itens.map((item) => ({
      produto_id: item.produto.id,
      quantidade: item.quantidade,
    }));

    try {
      await api.criarPedido(itensParaApi);
      limparCarrinho();
      setSucesso(true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <div className="max-w-md mx-auto mt-6 px-4 text-center text-green-700 font-semibold">
        Pedido realizado com sucesso!
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-6 px-4 text-center text-gray-500">
        Carrinho vazio.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-6 px-4">
      <h2 className="text-lg font-bold mb-3 text-gray-800">Carrinho</h2>

      <ul className="flex flex-col gap-2">
        {itens.map((item) => (
          <li
            key={item.produto.id}
            className="flex justify-between items-center bg-white border rounded p-2"
          >
            <span>
              {item.produto.nome} × {item.quantidade}
            </span>
            <div className="flex items-center gap-3">
              <span className="font-semibold">
                R$ {(item.produto.preco * item.quantidade).toFixed(2)}
              </span>
              <button
                onClick={() => removerItem(item.produto.id)}
                className="text-red-600 text-sm hover:underline"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-right font-bold mt-3 text-gray-800">
        Total: R$ {total.toFixed(2)}
      </p>

      {erro && <p className="text-red-600 text-sm mt-2">{erro}</p>}

      <button
        onClick={finalizarPedido}
        disabled={enviando}
        className="mt-3 w-full bg-green-600 text-white rounded py-2 font-semibold hover:bg-green-700 disabled:opacity-50"
      >
        {enviando ? 'Enviando...' : 'Finalizar pedido'}
      </button>
    </div>
  );
}
