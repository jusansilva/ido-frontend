"use client";
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="Logo iDoe" className="h-20 md:h-20" />
        </div>
        <nav className="hidden md:flex gap-8">
          <a href="#" className="font-medium hover:text-primary">Início</a>
          {/* Outros links */}
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
          <img src="/logo.jpeg" alt="Logo iDoe" className="h-20 mb-4" />
        </div>
        <ul className="flex flex-col gap-6 px-6">
          <li><a href="#" className="font-medium text-primary">Início</a></li>
          {/* Outros itens */}
        </ul>
      </nav>
    </header>
  );
}