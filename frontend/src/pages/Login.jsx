import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    try {
      await login(email, senha);
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Entrar no ShopCore</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="border rounded px-3 py-2"
        />

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
