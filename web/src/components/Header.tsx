import { Plus, X, SignOut, Calendar } from 'phosphor-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate, useLocation } from 'react-router-dom';

import logoImage from '../assets/logo.svg';
import { NewRoutinesForm } from './NewRoutinesForm';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  const goToYearlySummary = () => {
    navigate('/yearly-summary');
  };

  const goToMonthlySummary = () => {
    navigate('/app');
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-right justify-between">

        {location.pathname === '/yearly-summary' ? (
          <a href="/app">
            <img className="w-28 h-16 lg:w-32 lg:h-24" src={logoImage} alt="Routines" />
          </a>
        ) : location.pathname === '/app' ? (
            <img className="w-28 h-16 lg:w-32 lg:h-24" src={logoImage} alt="Routines" />
        ) : null}
      

      <div className="flex items-center gap-4 mt-3.5">
        <Dialog.Root>

        {location.pathname === '/app' ? (
          <Dialog.Trigger
            type="button"
            className="border border-green-500 text-sm font-semibold rounded-lg px-4 py-2 lg:px-6 lg:py-4 flex items-center gap-3 hover:border-green-300"
          >
            <Plus size={20} className="text-green-500" />
            Nova Routine
          </Dialog.Trigger>
        ) :null }

          <Dialog.Portal>
            <Dialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0" />

            <Dialog.Content className="absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Dialog.Close className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-200">
                <X size={24} aria-label="Fechar" />
              </Dialog.Close>

              <Dialog.Title className="text-3xl leading-tight font-extrabold">
                Criar routine
              </Dialog.Title>
              <NewRoutinesForm />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {location.pathname === '/app' ? (
          <button
            onClick={goToYearlySummary}
            className="border border-blue-500 text-sm font-semibold rounded-lg px-4 py-2 lg:px-6 lg:py-4 flex items-center gap-3 hover:border-blue-300"
          >
            <Calendar size={20} className="text-blue-500" />
            Resumo Anual
          </button>
        ) : location.pathname === '/yearly-summary' ? (
          <button
            onClick={goToMonthlySummary}
            className="border border-blue-500 text-sm font-semibold rounded-lg px-4 py-2 lg:px-6 lg:py-4 flex items-center gap-3 hover:border-blue-300"
          >
            <Calendar size={20} className="text-blue-500" />
            Resumo do Mês
          </button>
        ) : null}

        <button
          onClick={handleLogout}
          className="border border-red-500 text-sm font-semibold rounded-lg px-4 py-2 lg:px-6 lg:py-4 flex items-center gap-3 hover:border-red-300"
        >
          <SignOut size={20} className="text-red-500" />
          Logout
        </button>       
      </div>
    </div>
  );
}
