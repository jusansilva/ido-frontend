"use client";
import PageTitle from '@/components/PageTitle';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CampaignDetailPage from '../_components/CampaignDetailPage';

function Content() {
  const sp = useSearchParams();
  const id = Number(sp.get('id') || 0);
  if (!id || Number.isNaN(id)) {
    return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-['Roboto',sans-serif] p-8">ID de campanha inválido.</div>;
  }
  return <CampaignDetailPage id={id} />;
}

export default function CampaignViewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">Carregando...</div>}>
      <PageTitle title="Campanha" />
      <Content />
    </Suspense>
  );
}
