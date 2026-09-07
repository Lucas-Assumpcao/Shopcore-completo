import { useCarrinho } from '../context/CarrinhoContext';

export function Carrinho() {
  const { itens, removerItem, total } = useCarrinho();

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
    </div>
  );
}
