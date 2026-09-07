import { AuthProvider, useAuth } from './context/AuthContext';
import { CarrinhoProvider } from './context/CarrinhoContext';
import { Login } from './pages/Login';
import { Produtos } from './pages/Produtos';
import { Carrinho } from './components/Carrinho';

function Conteudo() {
  const { logado, logout } = useAuth();

  if (!logado) {
    return <Login />;
  }

  return (
    <CarrinhoProvider>
      <div>
        <div className="flex justify-end p-4">
          <button
            onClick={logout}
            className="bg-gray-200 rounded px-4 py-2 hover:bg-gray-300"
          >
            Sair
          </button>
        </div>
        <Produtos />
        <Carrinho />
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
