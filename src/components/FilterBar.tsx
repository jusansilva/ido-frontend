"use client";

export default function FilterBar() {
  return (
    <section className="bg-[--surface] rounded-xl shadow p-6 mb-10 flex flex-col md:flex-row md:items-end gap-6 border border-[var(--muted)]">
      <div className="flex-1 w-full mb-4 md:mb-0">
        <label className="block text-sm font-semibold mb-2 text-primary">Buscar campanhas</label>
        <input
          type="text"
          placeholder="Ex.: Campanha de inverno"
          className="w-full border border-[var(--muted)] rounded px-3 py-2 focus:outline-none focus:border-primary bg-transparent"
        />
      </div>
      <div className="flex-1 w-full mb-4 md:mb-0">
        <label className="block text-sm font-semibold mb-2 text-primary">Categoria</label>
        <select className="w-full border border-[var(--muted)] rounded px-3 py-2 focus:outline-none focus:border-primary bg-transparent">
          <option>Todas as categorias</option>
          <option>Saúde</option>
          <option>Animais</option>
          <option>Educação</option>
          <option>Emergência</option>
        </select>
      </div>
      <div className="flex-1 w-full">
        <label className="block text-sm font-semibold mb-2 text-primary">Ordenar por</label>
        <select className="w-full border border-[var(--muted)] rounded px-3 py-2 focus:outline-none focus:border-primary bg-transparent">
          <option>Mais recentes</option>
          <option>Mais apoiadas</option>
          <option>Maior meta</option>
        </select>
      </div>
    </section>
  );
}
