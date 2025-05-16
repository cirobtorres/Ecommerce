'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser } from '@/lib/services/userService';
import { useRouter } from 'next/navigation';

type UserForm = { id: string; name: string; email: string; password: string };
type CreateUserForm = Omit<UserForm, 'id'>;

type UserFormProps = {
  initialData?: UserForm;
  onSuccess?: () => void;
};

const saveUser = (data: Partial<UserForm>) => {
  if (data.id) {
    return updateUser(data as UserForm);
  } else {
    return createUser(data as CreateUserForm);
  }
};

export function UserForm({ initialData, onSuccess }: Readonly<UserFormProps>) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState('');

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending, isError, isSuccess, reset } = useMutation({
    mutationFn: saveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });

      onSuccess?.();

      if (!initialData) {
        router.push('/users');
      }
    },
    onError: (err) => {
      console.error('Erro na mutação:', err);
    },
  });

  const handleBackToUserList = () => {
    reset();
    router.push('/users');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      id: initialData?.id, // undefined se for criação
      password: initialData ? undefined : password, // enviar password apenas na criação
    };

    mutate(userData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          Nome:
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-neutral-200 rounded-sm px-3 py-2 shadow-xs bg-neutral-100 focus:outline-hidden focus:ring-3 focus:ring-blue-200"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          Email:
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-neutral-200 rounded-sm px-3 py-2 shadow-xs bg-neutral-100 focus:outline-hidden focus:ring-3 focus:ring-blue-200"
        />
      </div>
      {!initialData && (
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Senha:
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-neutral-200 rounded-sm px-3 py-2 shadow-xs bg-neutral-100 focus:outline-hidden focus:ring-3 focus:ring-blue-200"
          />
        </div>
      )}
      <div className="flex justify-between">
        <button
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-sm disabled:opacity-50 transition-colors"
          type="submit"
          disabled={isPending}
        >
          {initialData ? 'Atualizar' : 'Criar'}
        </button>
        <button
          type="button"
          className="bg-neutral-100 cursor-pointer hover:bg-neutral-200 text-neutral-700 px-8 py-2 rounded-sm transition-colors"
          onClick={handleBackToUserList}
        >
          Voltar
        </button>
      </div>
      {isPending && <p className="text-neutral-500 italic">Carregando...</p>}
      {isError && <p className="text-red-600">Erro ao salvar os dados!</p>}
      {isSuccess && (
        <p className="text-green-600">Usuário salvo com sucesso!</p>
      )}
    </form>
  );
}
