import { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);

  function adicionarItem(produto) {
    setItens((atual) => {
      const existente = atual.find((item) => item.produto.id === produto.id);

      if (existente) {
        return atual.map((item) =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...atual, { produto, quantidade: 1 }];
    });
  }

  function removerItem(produtoId) {
    setItens((atual) => atual.filter((item) => item.produto.id !== produtoId));
  }

  function limparCarrinho() {
    setItens([]);
  }

  const total = itens.reduce(
    (soma, item) => soma + item.produto.preco * item.quantidade,
    0
  );

  return (
    <CarrinhoContext.Provider
      value={{ itens, adicionarItem, removerItem, limparCarrinho, total }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  return useContext(CarrinhoContext);
}
