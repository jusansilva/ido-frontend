"use client";
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api, type Campaign, type Payment } from '@/lib/api';
import { getSession } from '@/lib/auth';
import { useParams } from 'next/navigation';

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = getSession();
  const isLogged = !!session;
  const isAdmin = session?.user?.role === 'ADMIN';
  const [moderating, setModerating] = useState<null | 'approve' | 'reject'>(null);
  const [modError, setModError] = useState<string | null>(null);
  const [modSuccess, setModSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const c = await api.campaigns.get(Number(id));
        if (!cancelled) setCampaign(c);
      } catch {
        if (!cancelled) setError('Campanha não encontrada');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  return (
    <div className="min-h-screen bg-background text-text font-['Roboto',sans-serif]">
      <Header />
      <div className="h-20 md:h-24" />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading && <p>Carregando...</p>}
        {error && <p className="text-error">{error}</p>}
        {campaign && (
          <>
            <a href="/campaigns" className="inline-flex items-center text-sm text-primary underline mb-2">← Voltar</a>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">{campaign.title}</h1>
            <p className="text-sm text-gray-600 mb-2">Status: {campaign.closed ? 'Encerrada' : 'Aberta'}</p>
            {modSuccess && (
              <div className="mb-4 rounded bg-green-50 border border-green-200 text-green-800 px-3 py-2 text-sm">
                {modSuccess}
              </div>
            )}
            {isAdmin && (
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-sm">Aprovação: <span className="font-semibold">{campaign.approved === true ? 'Aprovada' : campaign.approved === false ? 'Pendente' : 'Desconhecida'}</span></p>
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-60"
                      disabled={!!moderating}
                      onClick={async () => {
                        setModError(null);
                        setModSuccess(null);
                        setModerating('approve');
                        try {
                          await api.admin.moderateCampaign(Number(id), true);
                          const c = await api.campaigns.get(Number(id));
                          setCampaign(c);
                          setModSuccess('Campanha aprovada com sucesso.');
                        } catch (e: any) {
                          setModError(e?.message || 'Falha ao aprovar');
                        } finally {
                          setModerating(null);
                        }
                      }}
                    >Aprovar</button>
                    <button
                      className="px-4 py-2 rounded-lg border border-red-600 text-red-700 hover:bg-red-50 disabled:opacity-60"
                      disabled={!!moderating}
                      onClick={async () => {
                        setModError(null);
                        setModSuccess(null);
                        setModerating('reject');
                        try {
                          await api.admin.moderateCampaign(Number(id), false);
                          const c = await api.campaigns.get(Number(id));
                          setCampaign(c);
                          setModSuccess('Campanha marcada como pendente.');
                        } catch (e: any) {
                          setModError(e?.message || 'Falha ao reprovar');
                        } finally {
                          setModerating(null);
                        }
                      }}
                    >Reprovar</button>
                  </div>
                </div>
                {modError && <p className="text-error mt-2">{modError}</p>}
              </div>
            )}

            {!isLogged ? (
              <div className="bg-white rounded-lg shadow p-4">
                <p className="mb-3">Para doar, faça login ou crie sua conta.</p>
                <div className="flex gap-3">
                  <a href="/login" className="px-4 py-2 rounded-lg bg-primary text-white">Entrar</a>
                  <a href="/register" className="px-4 py-2 rounded-lg border border-primary text-primary">Cadastrar</a>
                </div>
              </div>
            ) : campaign.closed ? (
              <div className="bg-white rounded-lg shadow p-4">
                <p>Esta campanha está encerrada.</p>
              </div>
            ) : (
              <DonateBox campaignId={campaign.id} />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function DonateBox({ campaignId }: { campaignId: number }) {
  const [amount, setAmount] = useState(5000); // R$ 50,00 padrão
  const [method, setMethod] = useState<'PIX' | 'BOLETO' | 'CREDIT'>('PIX');
  const [ccHolder, setCcHolder] = useState('');
  const [ccNumber, setCcNumber] = useState('');
  const [ccExp, setCcExp] = useState(''); // MM/AAAA
  const [ccCvv, setCcCvv] = useState('');
  const [ccInst, setCcInst] = useState(1);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [status, setStatus] = useState<Payment['status'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createPayment() {
    setLoading(true);
    setError(null);
    try {
      let creditCard: (
        { holder: string; number: string; expMonth: number; expYear: number; cvv: string; installments?: number } |
        { token: string; installments?: number }
      ) | undefined = method === 'CREDIT' ? mapCc() : undefined;
      // Tokenização opcional: se configurado, chama endpoint de tokenização para obter token e evita enviar PAN ao backend.
      const tokenizeUrl = process.env.NEXT_PUBLIC_SAFE2PAY_TOKENIZE_URL;
      if (method === 'CREDIT' && tokenizeUrl && creditCard) {
        try {
          const resp = await fetch(tokenizeUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(creditCard) });
          const data = await resp.json();
          if (resp.ok && data?.token) {
            const installments = (creditCard && 'installments' in creditCard) ? creditCard.installments : undefined;
            creditCard = { token: String(data.token), installments };
          }
        } catch {}
      }
      const p = await api.payments.create(campaignId, amount, method, creditCard);
      setPayment(p);
      setStatus(p.status);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao iniciar pagamento';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!payment || !payment.id) return;
    if (status && status !== 'PENDING') return;
    const iv = setInterval(async () => {
      try {
        const s = await api.payments.status(payment.id);
        if (s?.status && s.status !== status) setStatus(s.status);
      } catch {}
    }, 4000);
    return () => clearInterval(iv);
  }, [payment, status]);

  function mapCc() {
    const [mm, yyyy] = ccExp.split('/').map((s) => s.trim());
    return {
      holder: ccHolder,
      number: ccNumber.replace(/\s+/g, ''),
      expMonth: Number(mm || 0),
      expYear: Number(yyyy || 0),
      cvv: ccCvv,
      installments: ccInst,
    };
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h2 className="text-xl font-semibold text-primary">Fazer uma doação</h2>
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <label className="flex items-center gap-2">Valor (R$)
          <input type="number" min={1} step={1} value={Math.round(amount/100)} onChange={(e) => setAmount(Math.max(1, Number(e.target.value)) * 100)} className="border rounded px-2 py-1 w-28" />
        </label>
        <label className="flex items-center gap-2">Método
          <select value={method} onChange={(e) => setMethod(e.target.value as 'PIX' | 'BOLETO' | 'CREDIT')} className="border rounded px-2 py-1">
            <option value="PIX">PIX (Safe2Pay)</option>
            <option value="BOLETO">Boleto (Safe2Pay)</option>
            <option value="CREDIT">Cartão (Safe2Pay)</option>
          </select>
        </label>
        <button onClick={createPayment} disabled={loading} className="px-4 py-2 rounded-lg bg-primary text-white">
          {loading ? 'Processando...' : 'Doar'}
        </button>
      </div>

      {method === 'CREDIT' && (
        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm">Nome impresso no cartão
            <input value={ccHolder} onChange={(e) => setCcHolder(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" placeholder="FULANO DE TAL" />
          </label>
          <label className="text-sm">Número do cartão
            <input value={ccNumber} onChange={(e) => setCcNumber(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" placeholder="4111 1111 1111 1111" />
          </label>
          <label className="text-sm">Validade (MM/AAAA)
            <input value={ccExp} onChange={(e) => setCcExp(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" placeholder="12/2028" />
          </label>
          <label className="text-sm">CVV
            <input value={ccCvv} onChange={(e) => setCcCvv(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" placeholder="123" />
          </label>
          <label className="text-sm">Parcelas
            <input type="number" min={1} max={12} value={ccInst} onChange={(e) => setCcInst(Math.max(1, Math.min(12, Number(e.target.value))))} className="mt-1 w-full border rounded px-2 py-1" />
          </label>
        </div>
      )}

      {error && <p className="text-error">{error}</p>}

      {payment && (
        <div className="border-t pt-4 space-y-3">
          <p>Status: <span className="font-semibold">{status}</span></p>
          {payment.method === 'PIX' && (
            <div className="space-y-2">
              {payment.pixQrCode && (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="QR Code PIX" src={payment.pixQrCode} className="w-48 h-48" />
              )}
              {payment.pixCode && (
                <div className="bg-gray-100 p-2 rounded text-xs break-all">{payment.pixCode}</div>
              )}
              <p className="text-xs text-gray-600">Abra seu app do banco e escaneie o QR Code ou use o código “copia e cola”.</p>
            </div>
          )}
          {payment.method === 'BOLETO' && (
            <div className="space-y-2">
              {payment.boletoUrl && (
                <a href={payment.boletoUrl} className="text-primary underline" target="_blank" rel="noreferrer">Abrir boleto</a>
              )}
              {payment.boletoDigitableLine && (
                <div className="bg-gray-100 p-2 rounded text-xs break-all">{payment.boletoDigitableLine}</div>
              )}
              <p className="text-xs text-gray-600">O boleto pode levar até 3 dias úteis para compensar.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
