"use client";

import { useState } from 'react';

export default function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    category: '',
    image: null as File | null,
    endDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validação básica
    if (!formData.title || !formData.description || !formData.goal || !formData.category || !formData.image || !formData.endDate) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    // Simulação de envio (substitua por sua lógica real)
    alert('Campanha criada com sucesso! (Simulação)');
    setFormData({ title: '', description: '', goal: '', category: '', image: null, endDate: '' }); // Limpa formulário
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, image: file });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-[--surface] rounded-xl shadow-lg p-8 w-full max-w-lg mx-4 relative border border-[var(--muted)]">
        <button className="absolute top-4 right-4 text-2xl text-primary hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">Criar Nova Campanha</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título da Campanha */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-primary">Título da Campanha</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Ajude a construir um abrigo para animais"
              required
              className="w-full border border-[var(--muted)] rounded px-3 py-2 focus:outline-none focus:border-primary bg-transparent"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-primary">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Descreva o objetivo da campanha e como as doações serão usadas..."
              required
              className="w-full border border-[var(--muted)] rounded px-3 py-2 focus:outline-none focus:border-primary bg-transparent"
            />
          </div>

          {/* Meta de Arrecadação */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-primary">Meta de Arrecadação (R$)</label>
            <input
              type="number"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              placeholder="Ex: 10000"
              min="1"
              required
              className="w-full border border-[var(--muted)] rounded px-3 py-2 focus:outline-none focus:border-primary bg-transparent"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-primary">Categoria</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full border border-[var(--muted)] rounded px-3 py-2 focus:outline-none focus:border-primary bg-transparent"
            >
              <option value="">Selecione uma categoria</option>
              <option value="saude">Saúde</option>
              <option value="animais">Animais</option>
              <option value="educacao">Educação</option>
              <option value="emergencia">Emergência</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          {/* Imagem de Capa */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-primary">Imagem de Capa</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="w-full border border-[var(--muted)] rounded px-3 py-2 focus:outline-none focus:border-primary bg-transparent"
            />
            <p className="text-sm text-gray-600 mt-1">Selecione uma imagem representativa da campanha (JPG, PNG, etc.).</p>
          </div>

          {/* Data de Término */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-primary">Data de Término</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
              className="w-full border border-[var(--muted)] rounded px-3 py-2 focus:outline-none focus:border-primary bg-transparent"
            />
          </div>

          {/* Botão de Enviar */}
          <div className="text-center">
            <button type="submit" className="bg-success text-white font-bold px-8 py-3 rounded-lg shadow hover:opacity-90 transition">
              Criar Campanha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
