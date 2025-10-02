"use client";
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string; terms?: string }>({});

  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0..5
  }, [password]);

  function validate() {
    const e: typeof errors = {};
    if (!name) e.name = 'Informe seu nome.';
    if (!email) e.email = 'Informe seu e-mail.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'E-mail inválido.';
    if (password.length < 8) e.password = 'A senha precisa ter ao menos 8 caracteres.';
    if (confirm !== password) e.confirm = 'As senhas não conferem.';
    if (!terms) e.terms = 'Aceite os termos para continuar.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await api.register(name, email, password);
      if (res?.accessToken && res?.refreshToken && res?.user) {
        saveSession({ accessToken: res.accessToken, refreshToken: res.refreshToken, user: res.user });
        setToast({ type: 'success', message: 'Cadastro realizado com sucesso!' });
        const to = res.user.role === 'ADMIN' ? '/admin' : '/';
        setTimeout(() => router.push(to), 900);
      } else {
        setToast({ type: 'success', message: 'Cadastro realizado! Faça login.' });
        setTimeout(() => router.push('/login'), 900);
      }
    } catch {
      setToast({ type: 'error', message: 'Erro ao cadastrar. Tente novamente.' });
    }
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-12 bg-[var(--background)] text-[var(--foreground)]">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <div className="w-full max-w-md bg-[--surface] rounded-xl shadow p-6 md:p-8 border border-[var(--muted)]">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">Criar conta</h1>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-primary">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              className="w-full border border-[var(--muted)] rounded px-3 py-2 focus:outline-none focus:border-primary bg-transparent"
            />
            {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-primary">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full border border-[var(--muted)] rounded px-3 py-2 focus:outline-none focus:border-primary bg-transparent"
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
                className="w-full border border-[var(--muted)] rounded px-3 py-2 pr-10 focus:outline-none focus:border-primary bg-transparent"
              />
              <button type="button" aria-label="Mostrar senha" className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary" onClick={() => setShowPwd((v) => !v)}>
                {showPwd ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-error">{errors.password}</p>}
            <div className="mt-2">
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${strength <= 2 ? 'bg-error' : strength === 3 ? 'bg-yellow-500' : 'bg-success'}`}
                  style={{ width: `${(strength / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs mt-1 text-gray-600">
                Força da senha: {strength <= 2 ? 'Fraca' : strength === 3 ? 'Média' : 'Forte'}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-primary">Confirmar senha</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-[var(--muted)] rounded px-3 py-2 pr-10 focus:outline-none focus:border-primary bg-transparent"
              />
              <button type="button" aria-label="Mostrar confirmação" className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary" onClick={() => setShowConfirm((v) => !v)}>
                {showConfirm ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {errors.confirm && <p className="mt-1 text-sm text-error">{errors.confirm}</p>}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
            Aceito os termos e a política de privacidade.
          </label>
          {errors.terms && <p className="-mt-2 text-sm text-error">{errors.terms}</p>}
          <button type="submit" className="w-full bg-success text-white font-semibold px-4 py-2 rounded-lg">Cadastrar</button>
        </form>
        <p className="text-center text-sm mt-6">
          Já tem conta? <Link className="text-primary underline" href="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
