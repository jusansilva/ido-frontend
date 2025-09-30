import CampaignCard, { type Campaign } from './CampaignCard';

const mockCampaigns: Campaign[] = [
  {
    title: 'Abrigo para Crianças',
    description: 'Ajude a construir um abrigo seguro para crianças em situação de risco.',
    image: '/logo.jpeg',
    raised: 6000,
    goal: 10000,
  },
  {
    title: 'Cestas Básicas para Famílias',
    description: 'Doe para garantir alimentação a famílias carentes da comunidade.',
    image: '/logo.jpeg',
    raised: 8000,
    goal: 10000,
  },
  {
    title: 'Tratamento para Animais',
    description: 'Ajude a custear tratamentos veterinários para pets resgatados.',
    image: '/logo.jpeg',
    raised: 4000,
    goal: 10000,
  },
];

export default function CampaignList() {
  return (
    <section className="mb-10">
      <h2 className="text-center text-2xl font-bold text-primary mb-6">Campanhas Sugeridas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockCampaigns.map((c, i) => (
          <CampaignCard key={i} campaign={c} />
        ))}
      </div>
    </section>
  );
}
