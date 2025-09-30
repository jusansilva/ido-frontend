"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSession } from '@/lib/auth';
import { api, type Campaign } from '@/lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean>(false);
  const [pending, setPending] = useState<Campaign[]>([]);
  const [approved, setApproved] = useState<Campaign[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [campaignsCount, setCampaignsCount] = useState<number>(0);
  const [donationsCount, setDonationsCount] = useState<number>(0);
  const [recent, setRecent] = useState<{ campaigns: Campaign[]; donations: { id: number; amount: number; campaignId: number; createdAt: string }[]; users: { id: number; name: string; email: string; createdAt: string; role: string }[] }>({ campaigns: [], donations: [], users: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const s = getSession();
    if (!s || s.user.role !== 'ADMIN') {
      router.push('/');
    } else {
      setAllowed(true);
      (async () => {
        setLoading(true);
        try {
          const [p, a, dash] = await Promise.all([
            api.admin.campaigns('pending'),
            api.admin.campaigns('approved'),
            api.admin.dashboard(),
          ]);
          setPending(p);
          setApproved(a);
          setUsersCount(dash.usersCount);
          setCampaignsCount(dash.campaignsCount);
          setDonationsCount(dash.donationsCount);
          setRecent({ campaigns: dash.recentCampaigns, donations: dash.recentDonations, users: dash.recentUsers });
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [router]);

  if (!allowed) return null;

  return (
    <div className="min-h-screen bg-background text-text font-['Roboto',sans-serif]">
      <Header />
      <div className="h-20 md:h-24"></div>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">Área Administrativa</h1>
        {loading && <p>Carregando...</p>}
        {!loading && (
          <div className="space-y-10">
            <section>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Kpi label="Usuários" value={String(usersCount)} />
                <Kpi label="Campanhas" value={String(campaignsCount)} />
                <Kpi label="Doações" value={String(donationsCount)} />
              </div>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Campanhas pendentes</h2>
              <CampaignsModeration items={pending} onAction={async (id, ok) => {
                await api.admin.moderateCampaign(id, ok);
                const [p, a] = await Promise.all([api.admin.campaigns('pending'), api.admin.campaigns('approved')]);
                setPending(p);
                setApproved(a);
              }} />
            </section>
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Campanhas aprovadas</h2>
              <CampaignsList items={approved} />
            </section>
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">Acontecimentos recentes</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Card title="Novas campanhas">
                  <ul className="text-sm space-y-2">
                    {recent.campaigns.map((c) => (
                      <li key={c.id}>#{c.id} {c.title} — {new Date(c.createdAt).toLocaleDateString('pt-BR')}</li>
                    ))}
                  </ul>
                </Card>
                <Card title="Novos usuários">
                  <ul className="text-sm space-y-2">
                    {recent.users.map((u) => (
                      <li key={u.id}>{u.name} ({u.email}) — {new Date(u.createdAt).toLocaleDateString('pt-BR')}</li>
                    ))}
                  </ul>
                </Card>
                <Card title="Doações recentes">
                  <ul className="text-sm space-y-2">
                    {recent.donations.map((d) => (
                      <li key={d.id}>#{d.campaignId} − R$ {(d.amount/100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} — {new Date(d.createdAt).toLocaleDateString('pt-BR')}</li>
                    ))}
                  </ul>
                </Card>
              </div>
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

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-primary mb-2">{title}</h3>
      {children}
    </div>
  );
}

function CampaignsModeration({ items, onAction }: { items: Campaign[]; onAction: (id: number, approved: boolean) => Promise<void> }) {
  if (!items.length) return <p className="text-gray-700">Sem pendências.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="text-left">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Título</th>
            <th className="px-4 py-2">Criada em</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="px-4 py-2">{c.id}</td>
              <td className="px-4 py-2">{c.title}</td>
              <td className="px-4 py-2">{new Date(c.createdAt).toLocaleString('pt-BR')}</td>
              <td className="px-4 py-2 flex gap-2">
                <button className="px-3 py-1 rounded bg-success text-white" onClick={() => onAction(c.id, true)}>Aprovar</button>
                <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => onAction(c.id, false)}>Reprovar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CampaignsList({ items }: { items: Campaign[] }) {
  if (!items.length) return <p className="text-gray-700">Nenhuma campanha aprovada.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="text-left">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Título</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Criada em</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="px-4 py-2">{c.id}</td>
              <td className="px-4 py-2">{c.title}</td>
              <td className="px-4 py-2">{c.closed ? 'Encerrada' : 'Aberta'}</td>
              <td className="px-4 py-2">{new Date(c.createdAt).toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
