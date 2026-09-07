import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CarrinhoProvider } from './context/CarrinhoContext';
import { Login } from './pages/Login';
import { Produtos } from './pages/Produtos';
import { Pedidos } from './pages/Pedidos';
import { Carrinho } from './components/Carrinho';

function Conteudo() {
  const { logado, logout } = useAuth();
  const [aba, setAba] = useState('produtos');

  if (!logado) {
    return <Login />;
  }

  return (
    <CarrinhoProvider>
      <div>
        <div className="flex justify-between items-center p-4 border-b bg-white">
          <div className="flex gap-4">
            <button
              onClick={() => setAba('produtos')}
              className={`font-semibold ${aba === 'produtos' ? 'text-blue-600' : 'text-gray-500'}`}
            >
              Produtos
            </button>
            <button
              onClick={() => setAba('pedidos')}
              className={`font-semibold ${aba === 'pedidos' ? 'text-blue-600' : 'text-gray-500'}`}
            >
              Meus pedidos
            </button>
          </div>
          <button
            onClick={logout}
            className="bg-gray-200 rounded px-4 py-2 hover:bg-gray-300"
          >
            Sair
          </button>
        </div>

        {aba === 'produtos' ? (
          <>
            <Produtos />
            <Carrinho />
          </>
        ) : (
          <Pedidos />
        )}
      </div>
    </CarrinhoProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Conteudo />
    </AuthProvider>
  );
}

export default App;
