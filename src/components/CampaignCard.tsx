export type Campaign = {
  title: string;
  description: string;
  image: string;
  raised: number;
  goal: number;
};

import Image from 'next/image';

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const percent = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
      <div className="relative w-full h-32 rounded mb-3 overflow-hidden">
        <Image src={campaign.image} alt={campaign.title} fill className="object-cover" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">{campaign.title}</h3>
      <p className="text-gray-700 mb-2 text-center">{campaign.description}</p>
      <div className="w-full bg-secondary rounded h-2 mb-2">
        <div className="bg-primary h-2 rounded" style={{ width: `${percent}%` }} />
      </div>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-bold text-primary">R$ {campaign.raised.toLocaleString('pt-BR')}</span> de R$ {campaign.goal.toLocaleString('pt-BR')}
      </p>
      <button className="mt-2 bg-primary text-white font-semibold px-4 py-2 rounded transition-transform hover:scale-105">
        Doar
      </button>
    </div>
  );
}
