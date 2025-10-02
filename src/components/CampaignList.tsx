"use client";
import { useEffect, useState } from 'react';
import CampaignCard, { type Campaign } from './CampaignCard';
import { api, type Campaign as ApiCampaign } from '@/lib/api';

const mockCampaignsBase: Campaign[] = [
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
  const [items, setItems] = useState<Campaign[]>(mockCampaignsBase);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const initiatives = await api.initiatives.list().catch(() => [] as { id: number; title: string; description: string; imageUrl: string }[]);
        const iniCards: Campaign[] = initiatives.slice(0, 3).map((i) => ({
          id: undefined,
          title: String(i.title || ''),
          description: String(i.description || ''),
          image: String(i.imageUrl || '/logo.jpeg'),
          raised: 0,
          goal: 10000,
        }));

        let filled: Campaign[] = iniCards;
        if (iniCards.length < 3) {
          const list = await api.campaigns.list();
          const candidates = (Array.isArray(list) ? list : [])
            .filter((c: ApiCampaign) => !c.closed && c.approved !== false);
          const top = candidates.slice(0, 3 - iniCards.length);
          const enriched = await Promise.all(
            top.map(async (c) => {
              try {
                const r = await api.campaigns.report(c.id);
                const raised = Math.max(0, Math.round((r?.total || 0) / 100));
                return toCard(c, raised);
              } catch {
                return toCard(c);
              }
            })
          );
          filled = [...iniCards, ...enriched];
        }
        const completed = fillWithMocks(filled, 3);
        if (!cancelled) {
          setItems(completed);
          setLoaded(true);
        }
      } catch {
        // Keep mocks on failure
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="mb-10">
      <h2 className="text-center text-2xl font-bold text-primary mb-6">Campanhas Sugeridas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((c, i) => (
          <CampaignCard key={`${c.title}-${i}`} campaign={c} />
        ))}
      </div>
      {!loaded && <p className="text-center text-sm text-gray-500 mt-3">Carregando campanhas...</p>}
    </section>
  );
}

function toCard(c: ApiCampaign, raised?: number): Campaign {
  return {
    id: c.id,
    title: c.title,
    description: 'Campanha solidária',
    image: '/logo.jpeg',
    raised: typeof raised === 'number' ? raised : 0,
    goal: 10000,
  };
}

function fillWithMocks(list: Campaign[], target: number): Campaign[] {
  if (list.length >= target) return list.slice(0, target);
  const needed = target - list.length;
  const mocks: Campaign[] = [];
  for (let i = 0; i < needed; i++) {
    mocks.push(mockCampaignsBase[i % mockCampaignsBase.length]);
  }
  return [...list, ...mocks];
}
