import { Plus, X, SignOut } from 'phosphor-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';

import logoImage from '../assets/logo.svg';
import { NewRoutinesForm } from './NewRoutinesForm';

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
      <img src={logoImage} alt="Routines" />

      <div className="flex items-center gap-4">
        <Dialog.Root>
          <Dialog.Trigger
            type="button"
            className="border border-green-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 hover:border-green-300"
          >
            <Plus size={20} className="text-green-500" />
            Novo routine
          </Dialog.Trigger>

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

        <button
          onClick={handleLogout}
          className="border border-red-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 hover:border-red-300"
        >
          <SignOut size={20} className="text-red-500" />
          Logout
        </button>
      </div>
    </div>
  );
}
