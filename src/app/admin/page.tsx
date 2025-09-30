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
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newSortOrder, setNewSortOrder] = useState<number>(0);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [initiatives, setInitiatives] = useState<{ id: number; title: string; description: string; imageUrl: string; sortOrder: number; createdAt: string; updatedAt: string }[]>([]);
  const [initLoading, setInitLoading] = useState<boolean>(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [orderDirty, setOrderDirty] = useState<boolean>(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

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
          setInitLoading(true);
          setInitError(null);
          try {
            const inis = await api.initiatives.list();
            const sorted = [...inis].sort((a,b)=> (a.sortOrder??0)-(b.sortOrder??0) || a.id-b.id);
            setInitiatives(sorted);
          } catch (e: any) {
            setInitError(e?.message || 'Falha ao carregar iniciativas');
          } finally {
            setInitLoading(false);
          }
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
            <section className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold text-primary mb-3">Cadastrar iniciativa</h2>
              <p className="text-sm text-gray-700 mb-3">Cadastre iniciativas para destacar na página inicial. Defina imagem, título, descrição e ordem.</p>
              <form
                className="grid gap-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newTitle.trim() || !newDescription.trim() || !newImageFile) return;
                  setCreating(true);
                  setCreateError(null);
                  setCreateSuccess(null);
                  try {
                    // 1) Get upload URL
                    const up = await api.admin.initiatives.getUploadUrl(newImageFile.name, newImageFile.type || 'application/octet-stream');
                    // 2) PUT file to S3
                    await fetch(up.url, { method: 'PUT', headers: { 'Content-Type': newImageFile.type || 'application/octet-stream' }, body: newImageFile });
                    const imageUrl = up.publicUrl || up.url.split('?')[0];
                    // 3) Create initiative with imageUrl
                    await api.admin.initiatives.create({ title: newTitle.trim(), description: newDescription.trim(), imageUrl, sortOrder: newSortOrder });
                    setNewTitle('');
                    setNewDescription('');
                    setNewImageFile(null);
                    setNewSortOrder(0);
                    setCreateSuccess('Iniciativa criada com sucesso.');
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
                  } catch (err: any) {
                    setCreateError(err?.message || 'Falha ao criar iniciativa');
                  } finally {
                    setCreating(false);
                  }
                }}
              >
                <label className="text-sm">
                  Imagem (arquivo)
                  <input type="file" accept="image/*" onChange={(e)=> setNewImageFile(e.target.files?.[0] || null)} className="mt-1 w-full" />
                </label>
                <label className="text-sm">
                  Título
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Título da iniciativa"
                    className="mt-1 flex-1 w-full border rounded px-3 py-2"
                  />
                </label>
                <label className="text-sm">
                  Descrição
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Descreva a iniciativa"
                    className="mt-1 flex-1 w-full border rounded px-3 py-2"
                    rows={3}
                  />
                </label>
                <label className="text-sm">
                  Ordem (quanto menor, mais acima)
                  <input
                    type="number"
                    value={newSortOrder}
                    onChange={(e) => setNewSortOrder(Number(e.target.value) || 0)}
                    className="mt-1 w-28 border rounded px-3 py-2"
                  />
                </label>
                <div>
                  <button
                    type="submit"
                    disabled={creating || !newTitle.trim() || !newImageFile || !newDescription.trim()}
                    className="px-4 py-2 rounded bg-primary text-white disabled:opacity-60"
                  >{creating ? 'Salvando...' : 'Criar'}</button>
                </div>
              </form>
              {createError && <p className="text-error mt-2">{createError}</p>}
              {createSuccess && <p className="text-green-700 mt-2">{createSuccess}</p>}
            </section>
            <section className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-primary">Iniciativas</h2>
                <button
                  disabled={!orderDirty}
                  onClick={async ()=>{
                    // Normalize sortOrder to current index
                    const updates = initiatives.map((it, idx)=> ({ id: it.id, sortOrder: idx }));
                    for (const u of updates) {
                      await api.admin.initiatives.update(u.id, { sortOrder: u.sortOrder });
                    }
                    const fresh = await api.initiatives.list();
                    const sorted = [...fresh].sort((a,b)=> (a.sortOrder??0)-(b.sortOrder??0) || a.id-b.id);
                    setInitiatives(sorted);
                    setOrderDirty(false);
                  }}
                  className={`px-3 py-1 rounded border ${orderDirty ? 'border-primary text-primary' : 'border-gray-300 text-gray-400 cursor-not-allowed'}`}
                >Salvar ordem</button>
              </div>
              {initLoading ? (
                <p>Carregando...</p>
              ) : initError ? (
                <p className="text-error">{initError}</p>
              ) : !initiatives.length ? (
                <p className="text-gray-700">Nenhuma iniciativa cadastrada.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="px-3 py-2">Ordem</th>
                        <th className="px-3 py-2">Imagem</th>
                        <th className="px-3 py-2">Título</th>
                        <th className="px-3 py-2">Descrição</th>
                        <th className="px-3 py-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {initiatives.map((ini, idx) => (
                        <tr
                          key={ini.id}
                          className={`border-t align-top ${dragIndex === idx ? 'bg-gray-50' : ''}`}
                          draggable
                          onDragStart={()=> setDragIndex(idx)}
                          onDragOver={(e)=> { e.preventDefault(); }}
                          onDrop={(e)=> {
                            e.preventDefault();
                            if (dragIndex === null || dragIndex === idx) return;
                            const next = [...initiatives];
                            const [moved] = next.splice(dragIndex, 1);
                            next.splice(idx, 0, moved);
                            setInitiatives(next);
                            setOrderDirty(true);
                            setDragIndex(null);
                          }}
                        >
                          <td className="px-3 py-2 w-16">
                            <span className="cursor-move select-none text-gray-500">☰</span>
                          </td>
                          <td className="px-3 py-2">
                            <img src={ini.imageUrl} alt="img" className="w-16 h-16 object-cover rounded" />
                          </td>
                          <td className="px-3 py-2 min-w-56">
                            <input defaultValue={ini.title} onChange={(e)=> ini.title=e.target.value} className="w-full border rounded px-2 py-1" />
                          </td>
                          <td className="px-3 py-2 min-w-72">
                            <textarea defaultValue={ini.description} onChange={(e)=> ini.description=e.target.value} className="w-full border rounded px-2 py-1" rows={2} />
                            <input type="file" accept="image/*" onChange={(e:any)=> (ini as any).__file = (e.target.files?.[0] || null)} className="mt-1 w-full" />
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-col gap-2">
                              <button className="px-3 py-1 rounded bg-primary text-white" onClick={async ()=>{
                                let imageUrl: string | undefined = undefined;
                                const f: File | undefined = (ini as any).__file;
                                if (f) {
                                  const up = await api.admin.initiatives.getUploadUrl(f.name, f.type || 'application/octet-stream');
                                  await fetch(up.url, { method: 'PUT', headers: { 'Content-Type': f.type || 'application/octet-stream' }, body: f });
                                  imageUrl = up.publicUrl || up.url.split('?')[0];
                                }
                                await api.admin.initiatives.update(ini.id, { title: ini.title, description: ini.description, imageUrl: imageUrl ?? ini.imageUrl, sortOrder: ini.sortOrder });
                                const inis = await api.initiatives.list();
                                const sorted = [...inis].sort((a,b)=> (a.sortOrder??0)-(b.sortOrder??0) || a.id-b.id);
                                setInitiatives(sorted);
                              }}>Salvar</button>
                              <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={async ()=>{
                                if (!confirm('Excluir iniciativa?')) return;
                                await api.admin.initiatives.delete(ini.id);
                                const inis = await api.initiatives.list();
                                const sorted = [...inis].sort((a,b)=> (a.sortOrder??0)-(b.sortOrder??0) || a.id-b.id);
                                setInitiatives(sorted);
                              }}>Excluir</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
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
