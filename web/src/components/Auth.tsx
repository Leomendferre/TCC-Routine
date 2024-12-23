import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "../lib/axios"

import logoImage from '../assets/logo.svg';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await api.post('/login', { username, password });
        localStorage.setItem('userId', response.data.id);
        navigate('/app');
      } else {
        const response = await api.post('/register', { username, password });
        alert('Usuário registrado com sucesso');
        setIsLogin(true);
      }
    } catch (error) {
      alert('Erro ao autenticar usuário');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');   };

  return (
    <div className="w-screen h-screen  bg-black">
      <div className="flex justify-center p-8">
          <img className="w-28 h-16 lg:w-32 lg:h-24" src={logoImage} alt="Routine Logo"/>
      </div>
      <div className="w-screen max-w-md m-auto p-8 space-y-6 text-white shadow-md rounded-lg">
        <div className="flex justify-around">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 ${isLogin ? 'font-bold border-b-2 border-red-500' : ''}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 ${!isLogin ? 'font-bold border-b-2 border-red-500' : ''}`}
          >
            Criar conta
          </button>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-gray-300">Nome do usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-gray-300">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="w-1/2 mx-auto mt-5 py-2 font-semibold bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              {isLogin ? 'Login' : 'Criar conta'}
            </button>
          </div>
        </form>
        
        {isLogin ? (
        <div className="text-center">
          <button onClick={handleForgotPassword} className="text-sm text-blue-400 hover:underline">
            Esqueceu a senha?
          </button>
        </div>
        ) : ''}
        
      </div>
    </div>
  );
};

export default Auth;
