"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  function validate() {
    const e: typeof errors = {};
    if (!email) e.email = 'Informe seu e-mail.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'E-mail inválido.';
    if (!password) e.password = 'Informe sua senha.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await api.login(email, password);
      if (res?.accessToken && res?.refreshToken && res?.user) {
        saveSession({ accessToken: res.accessToken, refreshToken: res.refreshToken, user: res.user });
      }
      setToast({ type: 'success', message: 'Login realizado com sucesso!' });
      const to = res?.user?.role === 'ADMIN' ? '/admin' : '/';
      setTimeout(() => router.push(to), 800);
    } catch {
      setToast({ type: 'error', message: 'Erro ao entrar. Tente novamente.' });
    }
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-12 bg-background text-text">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">Entrar</h1>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-primary">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
            />
            {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-primary">Senha</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:border-primary"
              />
              <button type="button" aria-label="Mostrar senha" className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary" onClick={() => setShowPwd((v) => !v)}>
                {showPwd ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-error">{errors.password}</p>}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span />
            <a href="#" className="text-primary hover:underline">Esqueci minha senha</a>
          </div>
          <button type="submit" className="w-full bg-primary text-white font-semibold px-4 py-2 rounded-lg">Entrar</button>
        </form>
        <p className="text-center text-sm mt-6">
          Não tem conta? <Link className="text-primary underline" href="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
