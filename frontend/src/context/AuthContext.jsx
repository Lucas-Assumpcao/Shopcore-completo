import { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  async function login(email, senha) {
    const resposta = await api.login({ email, senha });
    localStorage.setItem('token', resposta.token);
    setToken(resposta.token);
  }

  async function cadastrar(nome, email, senha) {
    await api.cadastrar({ nome, email, senha });
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, cadastrar, logout, logado: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
