"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSession } from '@/lib/auth';

export default function AdminPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean>(false);

  useEffect(() => {
    const s = getSession();
    if (!s || s.user.role !== 'ADMIN') {
      router.push('/');
    } else {
      setAllowed(true);
    }
  }, [router]);

  if (!allowed) return null;

  return (
    <div className="min-h-screen bg-background text-text font-['Roboto',sans-serif]">
      <Header />
      <div className="h-20 md:h-24"></div>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">Área Administrativa</h1>
        <p className="mb-4">Bem-vindo! Seu usuário possui acesso ADMIN.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Em breve: dashboard com estatísticas</li>
          <li>Moderação de campanhas</li>
          <li>Gestão de usuários e tokens</li>
        </ul>
      </main>
      <Footer />
    </div>
  );
}

