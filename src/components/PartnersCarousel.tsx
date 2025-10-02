"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const slides = [
  { name: 'Abrigo Esperança', img: '/logo.jpeg', desc: 'Acolhimento e cuidado para crianças.' },
  { name: 'Aprende+', img: '/logo.jpeg', desc: 'Programa de bolsas e material escolar.' },
  { name: 'SOS Bichos', img: '/logo.jpeg', desc: 'Resgate e tratamento de animais.' },
  { name: 'Alerta Solidário', img: '/logo.jpeg', desc: 'Respostas rápidas em desastres.' },
];

export default function PartnersCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function scrollTo(index: number) {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }

  function prev() {
    const idx = Math.max(0, active - 1);
    scrollTo(idx);
  }

  function next() {
    const idx = Math.min(slides.length - 1, active + 1);
    scrollTo(idx);
  }

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let ticking = false;
    const handler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const children = Array.from(el.children) as HTMLElement[];
        const trackRect = el.getBoundingClientRect();
        const centerX = trackRect.left + trackRect.width / 2;
        let bestIdx = 0;
        let bestDist = Number.POSITIVE_INFINITY;
        children.forEach((sl, i) => {
          const rect = sl.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const d = Math.abs(cx - centerX);
          if (d < bestDist) {
            bestDist = d;
            bestIdx = i;
          }
        });
        setActive(bestIdx);
        ticking = false;
      });
    };
    el.addEventListener('scroll', handler, { passive: true });
    // Initialize
    handler();
    return () => el.removeEventListener('scroll', handler as EventListener);
  }, []);

  return (
    <section id="iniciativas" className="mb-12">
      <div className="bg-[--surface] rounded-xl shadow-lg p-8 md:p-12 flex-col md:flex-row items-center gap-8 mb-10 md:flex border border-[var(--muted)]">
        <div className="flex-1">
          <span className="inline-block text-sm font-semibold text-success mb-3">INICIATIVA</span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-primary mb-4 leading-tight">
            Nossas iniciativas que transformam comunidades
          </h2>
          <p className="text-gray-700 mb-6">
            Programas focados em saúde, educação, assistência a animais e emergência. Trabalhamos com ONGs locais e
            voluntários para maximizar impacto e transparência. Conheça as iniciativas ativas e como apoiar cada uma.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="inline-flex items-center gap-2 bg-success text-white px-5 py-3 rounded-lg shadow hover:brightness-95 transition">
              Conheça as Iniciativas
            </a>
            <a href="#" className="inline-flex items-center gap-2 border-2 border-primary text-primary px-5 py-3 rounded-lg hover:bg-[var(--hover-surface)] transition">
              Quero Ajudar
            </a>
          </div>
        </div>

        <div className="flex-1 w-full min-w-0">
          <div className="relative w-full overflow-hidden">
            <div ref={trackRef} className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth py-4 no-scrollbar w-full">
              {slides.map((p) => (
                <div key={p.name} className="min-w-[240px] sm:min-w-[260px] md:min-w-[300px] lg:min-w-[340px] snap-center bg-[--surface] rounded-lg p-4 md:p-6 lg:p-8 flex-shrink-0 flex flex-col items-center justify-center border border-[var(--muted)]">
                  <Image
                    src={p.img}
                    alt={p.name}
                    width={192}
                    height={96}
                    className="w-32 h-16 md:w-40 md:h-20 lg:w-48 lg:h-24 object-contain mb-4 rounded grayscale hover:grayscale-0 transition"
                  />
                  <h3 className="text-lg font-semibold text-primary">{p.name}</h3>
                  <p className="text-sm text-gray-600 mt-2 text-center">{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:block">
              <button onClick={prev} className="bg-[--surface] border border-[var(--muted)] rounded-full p-2 shadow">‹</button>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:block">
              <button onClick={next} className="bg-[--surface] border border-[var(--muted)] rounded-full p-2 shadow">›</button>
            </div>

            <div className="flex gap-2 justify-center mt-4">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Ir para slide ${i + 1}`}
                  onClick={() => scrollTo(i)}
                  className={`w-2 h-2 rounded-full ${active === i ? 'bg-primary' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
