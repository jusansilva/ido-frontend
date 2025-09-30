import Image from 'next/image';

export default function FeaturedCampaign() {
  return (
    <section className="bg-white rounded-xl shadow mb-10 p-6 flex flex-col md:flex-row items-center gap-6">
      <Image src="/logo.jpeg" alt="Capa da Campanha" width={160} height={160} className="w-40 h-40 object-cover rounded" />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Um Lar para Crianças em Situação de Risco</h1>
        <p className="text-gray-700 mb-4">
          Nosso objetivo é arrecadar fundos para a construção de um lar que oferecerá abrigo, alimentação,
          educação e carinho para crianças desamparadas.
        </p>
        <div className="mb-2">
          <div className="w-full bg-secondary rounded h-3 mb-1">
            <div className="bg-primary h-3 rounded" style={{ width: '30%' }} />
          </div>
          <p className="text-primary font-bold">
            R$ 3.000 <span className="text-gray-600 text-sm">de R$ 10.000 arrecadados</span>
          </p>
        </div>
        <div className="flex gap-6 text-gray-600 text-sm">
          <span><strong>300</strong> Doadores</span>
          <span><strong>20</strong> Dias Restantes</span>
        </div>
      </div>
    </section>
  );
}
