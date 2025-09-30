"use client";

export default function FilterBar() {
  return (
    <section className="bg-white rounded-xl shadow p-6 mb-10 flex flex-col md:flex-row items-end gap-6">
      <div className="flex-1 w-full mb-4 md:mb-0">
        <label className="block text-sm font-semibold mb-2 text-primary">Buscar campanhas</label>
        <input
          type="text"
          placeholder="O que você está procurando?"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
        />
      </div>
      <div className="flex-1 w-full mb-4 md:mb-0">
        <label className="block text-sm font-semibold mb-2 text-primary">Categoria</label>
        <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary">
          <option>Todas as categorias</option>
          <option>Saúde</option>
          <option>Animais</option>
          <option>Educação</option>
          <option>Emergência</option>
        </select>
      </div>
      <div className="flex-1 w-full">
        <label className="block text-sm font-semibold mb-2 text-primary">Ordenar por</label>
        <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary">
          <option>Mais recentes</option>
          <option>Mais apoiadas</option>
          <option>Maior meta</option>
        </select>
      </div>
    </section>
  );
}

