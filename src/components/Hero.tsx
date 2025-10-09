"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Hero() {
  const router = useRouter();

  return (
    <section className="bg-[--surface] rounded-xl shadow-lg mt-12 mb-12 p-8 flex flex-col md:flex-row items-center border border-[var(--muted)]">
      <div className="flex-1">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 leading-tight">
          Transforme vidas com sua doação!
        </h1>
        <p className="text-lg mb-6">
          As pessoas já confiam no iDoe para realizar o impossível. Junte-se a nós e faça parte dessa corrente do bem!
        </p>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <button
            className="bg-success text-white font-bold px-6 py-3 rounded-lg shadow hover:opacity-90"
            onClick={() => router.push('/campaigns/new')}
          >
            Criar campanha
          </button>
          <button
            className="border-2 border-primary text-primary font-bold px-6 py-3 rounded-lg bg-[--surface] hover:bg-[var(--hover-surface)]"
            onClick={() => router.push('/campaigns')}
          >
            Quero doar
          </button>
        </div>
        <a href="/sobre" className="text-primary underline font-medium">Saiba mais sobre o iDoe</a>
      </div>
      <div className="flex-1 flex justify-center">
        <Image src="/logo.jpeg" alt="Imagem destaque iDoe" width={320} height={320} className="rounded-2xl shadow-lg w-full max-w-xs h-auto object-cover" />
      </div>
    </section>
  );
}
