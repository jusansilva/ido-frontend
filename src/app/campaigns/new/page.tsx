"use client";
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { getSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCampaignPage() {
  const session = getSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    if (typeof window !== 'undefined') router.push('/login');
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const c = await api.campaigns.create(title);
      const pending = !c.approved;
      setMessage(pending ? 'Campanha criada e enviada para aprovação do admin.' : 'Campanha criada com sucesso.');
      setTimeout(() => router.push('/campaigns'), 1200);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao criar campanha');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-text font-['Roboto',sans-serif]">
      <Header />
      <div className="h-20 md:h-24" />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">Nova campanha</h1>
        <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-4 space-y-4">
          <label className="block text-sm">Título
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" placeholder="Ex.: Campanha de inverno" />
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-primary text-white">{loading ? 'Enviando...' : 'Criar'}</button>
            <Link className="px-4 py-2 rounded-lg border border-primary text-primary" href="/campaigns">Cancelar</Link>
          </div>
          {message && <p className="text-success">{message}</p>}
          {error && <p className="text-error">{error}</p>}
        </form>
      </main>
      <Footer />
    </div>
  );
}
