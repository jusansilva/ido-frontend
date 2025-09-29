import Image from "next/image";
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="bg-background text-text font-['Roboto',sans-serif]">
      <Header />
      <div className="h-20 md:h-24"></div>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Hero />
        {/* Outros componentes */}
      </main>
      <Footer />
    </div>
  );
}
