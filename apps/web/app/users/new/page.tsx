import { UserForm } from '../components/UserForm';

export default async function NewUserPage() {
  return (
    <div className="h-full flex-1 bg-neutral-100">
      <main className="max-w-xl mx-auto p-6 bg-white rounded-sm shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Criar Usuário</h1>
        <UserForm />
      </main>
    </div>
  );
}
