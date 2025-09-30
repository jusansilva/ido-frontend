"use client";
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { API_BASE } from '@/lib/api';

type Summary = {
  totalDonations: number;
  totalAmount: number;
  averageAmount: number;
  donorsCount: number;
  lastDonationAt: string | null;
  campaignsCount: number;
  topCampaigns: { campaignId: number; title: string; total: number }[];
  recentDonations: { id: number; amount: number; campaignId: number; createdAt: string }[];
};

export default function TransparenciaPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/transparency`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || 'Falha ao carregar');
        if (!cancelled) setData(json as Summary);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erro');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const currency = (v: number) => (v / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="min-h-screen bg-background text-text font-['Roboto',sans-serif]">
      <Header />
      <div className="h-20 md:h-24" />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">Transparência</h1>
        <p className="text-gray-700 mb-6">Acompanhe métricas públicas agregadas de campanhas e doações.</p>
        {loading && <p>Carregando...</p>}
        {error && <p className="text-error">{error}</p>}
        {data && (
          <div className="space-y-10">
            <section>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Kpi label="Doações" value={String(data.totalDonations)} />
                <Kpi label="Total Arrecadado" value={currency(data.totalAmount)} />
                <Kpi label="Doador(es) Únicos" value={String(data.donorsCount)} />
                <Kpi label="Campanhas" value={String(data.campaignsCount)} />
              </div>
              <p className="text-xs text-gray-500 mt-2">Última doação: {data.lastDonationAt ? new Date(data.lastDonationAt).toLocaleString('pt-BR') : 'N/A'}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Top campanhas</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                  <thead>
                    <tr className="text-left">
                      <th className="px-4 py-2">Campanha</th>
                      <th className="px-4 py-2">Total</th>
                      <th className="px-4 py-2">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topCampaigns.map((c) => (
                      <tr key={c.campaignId} className="border-t">
                        <td className="px-4 py-2">{c.title}</td>
                        <td className="px-4 py-2">{currency(c.total)}</td>
                        <td className="px-4 py-2"><a className="text-primary underline" href={`/campaigns/${c.campaignId}`}>Abrir</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Doações recentes</h2>
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
                    {data.recentDonations.map((d) => (
                      <tr key={d.id} className="border-t">
                        <td className="px-4 py-2">{new Date(d.createdAt).toLocaleString('pt-BR')}</td>
                        <td className="px-4 py-2">#{d.campaignId}</td>
                        <td className="px-4 py-2">{currency(d.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-primary">Verificação de certificado</h2>
              <p className="text-sm text-gray-700">Para verificar um certificado, acesse a rota pública do backend: <code className="bg-gray-100 px-1 rounded">/certificates/&lt;code&gt;/verify</code>.</p>
              <p className="text-sm text-gray-700">Exemplo: <a href={`${API_BASE}/certificates/SEUCODIGO/verify`} className="text-primary underline">{`${API_BASE}/certificates/SEUCODIGO/verify`}</a></p>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-bold text-primary">{value}</div>
    </div>
  );
}

