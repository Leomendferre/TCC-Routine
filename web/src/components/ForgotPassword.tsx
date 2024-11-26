import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "../lib/axios";

import logoImage from '../assets/logo.svg';


const ForgotPassword: React.FC = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState(Math.random().toString(36).substring(7)); 
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== generatedCode) {
      alert('Código incorreto!');
      return;
    }

    try {
      await api.post('/reset-password', { username, newPassword });
      alert('Senha alterada com sucesso!');
      navigate('/');
    } catch (error) {
      alert('Erro ao redefinir a senha');
    }
  };

  return (
    <div className="w-screen h-screen bg-black">
      <div className="flex justify-center p-8">
        <a href="/">
          <img className="w-28 h-16 lg:w-32 lg:h-24" src={logoImage} alt="Routine Logo"/>
        </a>
      </div>
      <div className="w-screen max-w-md m-auto p-8 space-y-6 text-white shadow-md rounded-lg">
        <h1 className="text-xl font-bold text-center">Redefinir Senha</h1>
        <form onSubmit={handleResetPassword} className="space-y-4">
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
            <label className="block text-gray-300">Nova senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-gray-300">Código</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <p className="text-gray-400 text-sm">Código de verificação: {generatedCode}</p>
          <div className="flex justify-center mt-0">
            <button
              type="submit"
              className="w-1/2 mx-auto mt-5 py-2 py-2 mt-5 font-semibold bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Redefinir Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
