"use client";
import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api, type Campaign, type Donation } from '@/lib/api';
import { getSession } from '@/lib/auth';

export default function CampaignsPage() {
  const session = getSession();
  const isLogged = !!session;
  const userId = session?.user?.id;

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [cs, ds] = await Promise.all([
          api.campaigns.list(),
          isLogged ? api.donations.mine() : Promise.resolve([] as Donation[]),
        ]);
        if (!cancelled) {
          setCampaigns(cs);
          setDonations(ds as Donation[]);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Erro ao carregar dados';
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [isLogged]);

  const openCampaigns = useMemo(() => campaigns.filter(c => !c.closed && c.approved), [campaigns]);
  const myCampaigns = useMemo(() => campaigns.filter(c => userId && c.ownerId === userId) as Campaign[], [campaigns, userId]);

  return (
    <div className="min-h-screen bg-background text-text font-['Roboto',sans-serif]">
      <Header />
      <div className="h-20 md:h-24"></div>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">Campanhas</h1>

        {loading && <p>Carregando...</p>}
        {error && <p className="text-error">{error}</p>}

        {!loading && !isLogged && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Campanhas aprovadas</h2>
            <p className="text-sm text-gray-700">Mostrando campanhas abertas.</p>
            <CampaignsGrid items={openCampaigns} />
          </section>
        )}

        {!loading && isLogged && (
          <div className="space-y-10">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">Minhas campanhas</h2>
              <CampaignsGrid items={myCampaigns} emptyText="Você ainda não criou campanhas." />
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">Minhas doações</h2>
              <DonationsList items={donations} />
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">Campanhas em geral</h2>
              <CampaignsGrid items={campaigns} />
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function CampaignsGrid({ items, emptyText }: { items: Campaign[]; emptyText?: string }) {
  if (!items.length) return <p className="text-gray-700">{emptyText || 'Nenhuma campanha encontrada.'}</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((c) => (
        <div key={c.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary">{c.title}</h3>
            <span className={`text-xs px-2 py-1 rounded ${c.closed ? 'bg-gray-300 text-gray-700' : 'bg-success text-white'}`}>{c.closed ? 'Encerrada' : 'Aberta'}</span>
          </div>
          <p className="text-xs text-gray-600">Criada em {new Date(c.createdAt).toLocaleDateString('pt-BR')}</p>
          <div>
            <a href={`/campaigns/${c.id}`} className="inline-flex items-center px-3 py-1 rounded border border-primary text-primary text-sm">Ver detalhes</a>
          </div>
        </div>
      ))}
    </div>
  );
}

function DonationsList({ items }: { items: Donation[] }) {
  if (!items.length) return <p className="text-gray-700">Você ainda não realizou doações.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="text-left">
            <th className="px-4 py-2">Data</th>
            <th className="px-4 py-2">Campanha</th>
            <th className="px-4 py-2">Valor</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="px-4 py-2">{new Date(d.createdAt).toLocaleDateString('pt-BR')}</td>
              <td className="px-4 py-2">#{d.campaignId}</td>
              <td className="px-4 py-2">R$ {(d.amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
