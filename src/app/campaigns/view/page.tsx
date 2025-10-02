"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CampaignDetailClient from '../_components/CampaignDetailClient';

function Content() {
  const sp = useSearchParams();
  const id = Number(sp.get('id') || 0);
  if (!id || Number.isNaN(id)) {
    return <div className="min-h-screen bg-background text-text font-['Roboto',sans-serif] p-8">ID de campanha inválido.</div>;
  }
  return <CampaignDetailClient id={id} />;
}

export default function CampaignViewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-text p-8">Carregando...</div>}>
      <Content />
    </Suspense>
  );
}
