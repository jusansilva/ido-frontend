"use client";
import Image from 'next/image';
export default function Footer() {
  return (
    <footer className="bg-background py-10 mt-16 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="flex items-center gap-3 mb-6 md:mb-0">
          <Image src="/logo.jpeg" alt="Logo iDoe" width={160} height={80} className="h-20 w-auto rounded" />
        </div>
        <ul className="flex gap-8 text-base">
          <li><a href="#" className="hover:underline flex items-center gap-2 text-text">Sobre Nós</a></li>
          <li><a href="#" className="hover:underline flex items-center gap-2 text-text">Contato</a></li>
          <li><a href="#" className="hover:underline flex items-center gap-2 text-text">Termos de Uso</a></li>
          <li><a href="#" className="hover:underline flex items-center gap-2 text-text">Política de Privacidade</a></li>
        </ul>
      </div>
      <div className="text-center text-sm mt-6 text-text">&copy; 2025 iDoe. Todos os direitos reservados.</div>
    </footer>
  );
}
