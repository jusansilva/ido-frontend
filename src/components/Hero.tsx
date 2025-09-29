"use client";
import { useState } from 'react';
import Modal from './Modal';

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="bg-white rounded-xl shadow-lg mt-12 mb-12 p-8 flex flex-col md:flex-row items-center">
      <div className="flex-1">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 leading-tight">
          Transforme vidas com sua doação!
        </h1>
        <p className="text-lg text-text mb-6">
          Milhares de pessoas já confiaram no iDoe...
        </p>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <button
            className="bg-success text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-green-700"
            onClick={() => setIsModalOpen(true)}
          >
            Criar campanha
          </button>
          <button className="border-2 border-primary text-primary font-bold px-6 py-3 rounded-lg bg-white hover:bg-secondary">
            Quero doar
          </button>
        </div>
        <a href="#" className="text-primary underline font-medium">Saiba mais sobre o iDoe</a>
      </div>
      <div className="flex-1 flex justify-center">
        <img src="/logo.jpeg" alt="Imagem destaque iDoe" className="rounded-2xl shadow-lg w-full max-w-xs object-cover" />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}