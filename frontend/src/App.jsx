import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';

function Conteudo() {
  const { logado, logout } = useAuth();

  if (!logado) {
    return <Login />;
  }

  return (
    <div className="max-w-sm mx-auto mt-20 text-center">
      <p className="text-xl mb-4">Você está logado!</p>
      <button
        onClick={logout}
        className="bg-gray-200 rounded px-4 py-2 hover:bg-gray-300"
      >
        Sair
      </button>
    </div>
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
