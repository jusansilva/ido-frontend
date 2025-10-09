import type { Metadata } from "next";
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FilterBar from '@/components/FilterBar';
import FeaturedCampaign from '@/components/FeaturedCampaign';
import CampaignList from '@/components/CampaignList';
import PartnersCarousel from '@/components/PartnersCarousel';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "Início",
  description: "Doe agora e ajude quem precisa! Campanhas de doação verificadas e transparentes."
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-['Roboto',sans-serif]">
      <Header />
      <div className="h-20 md:h-24"></div>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Hero />
        <FilterBar />
        <FeaturedCampaign />
        <CampaignList />
        <PartnersCarousel />
      </main>
      <Footer />
    </div>
  );
}
