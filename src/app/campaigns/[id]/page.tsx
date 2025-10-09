"use client";
import PageTitle from '@/components/PageTitle';
import CampaignDetailPage from '../_components/CampaignDetailPage';
import Link from 'next/link';
import { use } from 'react';

export default function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = use(params);
  const id = Number(idStr);
  
  if (!id || Number.isNaN(id)) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-['Roboto',sans-serif] flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error mb-4">ID de campanha inválido</h1>
          <Link href="/campaigns" className="text-primary underline">← Voltar para campanhas</Link>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <PageTitle title={`Campanha #${id}`} />
      <CampaignDetailPage id={id} />
    </>
  );
}
