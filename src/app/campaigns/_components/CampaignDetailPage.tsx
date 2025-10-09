"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTitle from '@/components/PageTitle';
import { api, type Campaign, type Payment } from '@/lib/api';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

export default function CampaignDetailPage({ id }: { id: number }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [report, setReport] = useState<{ count: number; total: number; donorsCount: number } | null>(null);
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
        const [c, r] = await Promise.all([
          api.campaigns.get(Number(id)),
          api.campaigns.report(Number(id))
        ]);
        if (!cancelled) {
          setCampaign(c);
          setReport(r);
        }
      } catch {
        if (!cancelled) setError('Campanha não encontrada');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Valores padrão se não estiverem no banco
  const imageUrl = campaign?.imageUrl || '/logo.jpeg';
  const description = campaign?.description || 'Descrição da campanha não disponível.';
  const goal = campaign?.goal || 50000; // R$ 500,00 padrão
  const raised = report?.total || 0;
  const category = campaign?.category || 'Geral';
  const donorsCount = report?.donorsCount || 0;
  const percent = Math.min(100, Math.round((raised / goal) * 100));
  
  // Calcular dias restantes
  const daysLeft = campaign?.endDate 
    ? Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 30;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-['Roboto',sans-serif]">
      <PageTitle title={campaign?.title || 'Detalhes da Campanha'} />
      <Header />
      <div className="h-20 md:h-24" />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando campanha...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-error/10 border border-error rounded-lg p-6 text-center">
            <p className="text-error text-lg mb-4">{error}</p>
            <Link href="/campaigns" className="text-primary underline">
              ← Voltar para campanhas
            </Link>
          </div>
        )}
        
        {campaign && (
          <>
            {/* Breadcrumb */}
            <div className="mb-6">
              <Link href="/campaigns" className="inline-flex items-center text-sm text-primary hover:underline">
                ← Voltar para campanhas
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna Principal - Imagem e Detalhes */}
              <div className="lg:col-span-2 space-y-6">
                {/* Imagem da Campanha */}
                <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={imageUrl}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Título e Categoria */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {category}
                    </span>
                    {campaign?.closed && (
                      <span className="px-3 py-1 bg-gray-500/10 text-gray-600 rounded-full text-sm font-medium">
                        Encerrada
                      </span>
                    )}
                    {campaign?.approved === false && (
                      <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-sm font-medium">
                        Aguardando aprovação
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                    {campaign.title}
                  </h1>
                </div>

                {/* Descrição */}
                <div className="bg-[--surface] rounded-lg shadow p-6 border border-[var(--muted)]">
                  <h2 className="text-xl font-semibold text-primary mb-3">Sobre esta campanha</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </div>

                {/* Admin: Moderação */}
                {isAdmin && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow p-6 border border-yellow-200 dark:border-yellow-800">
                    <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">
                      Painel de Moderação
                    </h3>
                    
                    {modSuccess && (
                      <div className="mb-4 p-3 rounded bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200">
                        {modSuccess}
                      </div>
                    )}
                    
                    {modError && (
                      <div className="mb-4 p-3 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200">
                        {modError}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <p className="text-sm">
                        Status: <span className="font-semibold">
                          {campaign?.approved === true ? '✓ Aprovada' : '⏳ Pendente'}
                        </span>
                      </p>
                      <div className="flex gap-3">
                        <button
                          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                          disabled={!!moderating || campaign?.approved === true}
                          onClick={async () => {
                            setModError(null);
                            setModSuccess(null);
                            setModerating('approve');
                            try {
                              await api.admin.moderateCampaign(Number(id), true);
                              const c = await api.campaigns.get(Number(id));
                              setCampaign(c);
                              setModSuccess('✓ Campanha aprovada com sucesso!');
                            } catch (e: unknown) {
                              setModError(e instanceof Error ? e.message : 'Falha ao aprovar');
                            } finally {
                              setModerating(null);
                            }
                          }}
                        >
                          {moderating === 'approve' ? 'Aprovando...' : 'Aprovar'}
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
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
                            } catch (e: unknown) {
                              setModError(e instanceof Error ? e.message : 'Falha ao reprovar');
                            } finally {
                              setModerating(null);
                            }
                          }}
                        >
                          {moderating === 'reject' ? 'Reprovando...' : 'Reprovar'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - Doações */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Card de Progresso */}
                  <div className="bg-[--surface] rounded-lg shadow p-6 border border-[var(--muted)]">
                    <div className="mb-6">
                      <p className="text-3xl font-bold text-primary mb-1">
                        {formatCurrency(raised)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        arrecadados de {formatCurrency(goal)}
                      </p>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="mb-6">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                        <div 
                          className="bg-success h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 text-right">{percent}% atingido</p>
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-[var(--muted)]">
                      <div>
                        <p className="text-2xl font-bold text-primary">{donorsCount}</p>
                        <p className="text-sm text-gray-600">Doadores</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{daysLeft}</p>
                        <p className="text-sm text-gray-600">Dias restantes</p>
                      </div>
                    </div>

                    {/* Botão de Doação */}
                    {!isLogged ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 text-center mb-4">
                          Faça login para doar
                        </p>
                        <Link 
                          href="/login"
                          className="block w-full text-center px-6 py-3 rounded-lg bg-success text-white font-semibold hover:opacity-90 transition"
                        >
                          Entrar
                        </Link>
                        <Link 
                          href="/register"
                          className="block w-full text-center px-6 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-[var(--hover-surface)] transition"
                        >
                          Criar conta
                        </Link>
                      </div>
                    ) : campaign?.closed ? (
                      <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-600">Campanha encerrada</p>
                      </div>
                    ) : (
                      <DonateBox campaignId={id} />
                    )}
                  </div>

                  {/* Informações Adicionais */}
                  <div className="bg-[--surface] rounded-lg shadow p-6 border border-[var(--muted)]">
                    <h3 className="font-semibold text-primary mb-4">Informações</h3>
                    <div className="space-y-3 text-sm">
                      {campaign?.endDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data de término:</span>
                          <span className="font-medium">
                            {new Date(campaign.endDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Criada em:</span>
                        <span className="font-medium">
                          {campaign?.createdAt ? new Date(campaign.createdAt).toLocaleDateString('pt-BR') : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

function DonateBox({ campaignId }: { campaignId: number }) {
  const [amount, setAmount] = useState(5000); // R$ 50,00
  const [customAmount, setCustomAmount] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [method, setMethod] = useState<'PIX' | 'BOLETO' | 'CREDIT'>('PIX');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const presetAmounts = [1000, 2500, 5000, 10000]; // R$ 10, 25, 50, 100

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleDonate = async () => {
    setLoading(true);
    setError(null);
    
    const finalAmount = showCustom ? parseInt(customAmount) * 100 : amount;
    
    if (finalAmount < 100) {
      setError('Valor mínimo: R$ 1,00');
      setLoading(false);
      return;
    }

    try {
      // Simulação - ajustar quando API estiver pronta
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError('Erro ao processar doação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {success && (
        <div className="p-4 bg-success/10 border border-success rounded-lg text-success text-center">
          ✓ Doação realizada com sucesso!
        </div>
      )}

      {/* Valores Predefinidos */}
      {!showCustom && (
        <div className="grid grid-cols-2 gap-3">
          {presetAmounts.map((value) => (
            <button
              key={value}
              onClick={() => setAmount(value)}
              className={`p-3 rounded-lg border-2 font-semibold transition ${
                amount === value
                  ? 'border-success bg-success/10 text-success'
                  : 'border-[var(--muted)] hover:border-primary'
              }`}
            >
              {formatCurrency(value)}
            </button>
          ))}
        </div>
      )}

      {/* Valor Customizado */}
      {showCustom && (
        <div>
          <label className="block text-sm font-semibold mb-2">Valor (R$)</label>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="0,00"
            min="1"
            step="0.01"
            className="w-full border border-[var(--muted)] rounded px-3 py-2 bg-transparent"
          />
        </div>
      )}

      <button
        onClick={() => setShowCustom(!showCustom)}
        className="text-sm text-primary underline"
      >
        {showCustom ? 'Usar valores predefinidos' : 'Inserir outro valor'}
      </button>

      {/* Método de Pagamento */}
      <div>
        <label className="block text-sm font-semibold mb-2">Método de pagamento</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as typeof method)}
          className="w-full border border-[var(--muted)] rounded px-3 py-2 bg-transparent"
        >
          <option value="PIX">PIX</option>
          <option value="BOLETO">Boleto</option>
          <option value="CREDIT">Cartão de Crédito</option>
        </select>
      </div>

      {error && (
        <div className="p-3 bg-error/10 border border-error rounded text-error text-sm">
          {error}
        </div>
      )}

      {/* Botão de Doar */}
      <button
        onClick={handleDonate}
        disabled={loading}
        className="w-full px-6 py-3 rounded-lg bg-success text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Processando...' : `Doar ${formatCurrency(showCustom ? parseInt(customAmount || '0') * 100 : amount)}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Sua doação é segura e criptografada
      </p>
    </div>
  );
}
