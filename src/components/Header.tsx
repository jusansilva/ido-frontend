"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { api } from '@/lib/api';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<'USER' | 'ADMIN' | null>(null);

  useEffect(() => {
    const s = getSession();
    setName(s?.user?.name || null);
    setRole(s?.user?.role ?? null);
    const onStorage = () => {
      const ss = getSession();
      setName(ss?.user?.name || null);
      setRole(ss?.user?.role ?? null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  async function handleLogout() {
    try {
      await api.logout();
    } finally {
      // Força atualização de estado local
      setName(null);
      setRole(null);
      // Redirecionamento simples via location
      window.location.href = '/';
    }
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpeg" alt="Logo iDoe" width={160} height={80} className="h-20 w-auto md:h-20" priority />
        </div>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="font-medium hover:text-primary">Início</Link>
          <Link href="/campaigns" className="font-medium hover:text-primary">Campanhas</Link>
          <Link href="/como-doar" className="font-medium hover:text-primary">Como Doar</Link>
          <Link href="/transparencia" className="font-medium hover:text-primary">Transparência</Link>
          {name ? (
            <div className="flex items-center gap-3">
              {role === 'ADMIN' && (
                <Link href="/admin" className="inline-flex items-center font-medium px-3 py-2 rounded-lg border border-primary text-primary hover:bg-secondary">
                  Admin
                </Link>
              )}
              <Link href="/campaigns/new" className="inline-flex items-center font-medium px-3 py-2 rounded-lg border border-primary text-primary hover:bg-secondary">Nova campanha</Link>
              <span className="text-sm text-gray-700">Olá, {name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="inline-flex items-center font-medium px-3 py-2 rounded-lg bg-primary text-white hover:opacity-90">
                Sair
              </button>
            </div>
          ) : (
            <Link href="/login" className="inline-flex items-center font-medium px-4 py-2 rounded-lg border-2 border-primary text-primary hover:bg-secondary">Login</Link>
          )}
        </nav>
        <button
          id="menu-toggle"
          className="block md:hidden text-3xl text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          &#9776;
        </button>
      </div>
      {/* Side menu */}
      <nav
        className={`fixed top-0 right-[-250px] w-[220px] h-full bg-white shadow-lg transition-all duration-300 z-50 pt-6 md:hidden flex flex-col ${
          isOpen ? 'right-0' : ''
        }`}
      >
        <div className="flex flex-col items-center px-6 mb-8">
          <button
            className="text-2xl text-primary self-end"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
          <Image src="/logo.jpeg" alt="Logo iDoe" width={160} height={80} className="h-20 w-auto mb-4" />
        </div>
        <ul className="flex flex-col gap-6 px-6">
          <li><Link href="/" className="font-medium text-primary">Início</Link></li>
          <li><Link href="/campaigns" className="font-medium text-primary">Campanhas</Link></li>
          <li><Link href="/como-doar" className="font-medium text-primary">Como Doar</Link></li>
          <li><Link href="/transparencia" className="font-medium text-primary">Transparência</Link></li>
          {name ? (
            <>
              {role === 'ADMIN' && (
                <li><Link href="/admin" className="inline-flex items-center font-medium px-4 py-2 rounded-lg border-2 border-primary text-primary">Admin</Link></li>
              )}
              <li className="text-sm text-gray-700">Olá, {name.split(' ')[0]}</li>
              <li>
                <button onClick={handleLogout} className="inline-flex items-center font-medium px-4 py-2 rounded-lg bg-primary text-white">Sair</button>
              </li>
            </>
          ) : (
            <li><Link href="/login" className="inline-flex items-center font-medium px-4 py-2 rounded-lg border-2 border-primary text-primary">Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
}
