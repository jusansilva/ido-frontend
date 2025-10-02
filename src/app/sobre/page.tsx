import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background text-text font-['Roboto',sans-serif]">
      <Header />
      <div className="h-20 md:h-24" />
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Sobre o iDoe</h1>
          <p className="text-lg text-gray-700">
            O iDoe conecta pessoas e causas com simplicidade, transparência e segurança. Nossa missão é
            facilitar doações e ampliar o impacto social de quem precisa.
          </p>
        </header>

        <section className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-2xl font-semibold text-primary">Nossa missão</h2>
          <p>
            Tornar a solidariedade acessível. Ajudamos organizações e pessoas a arrecadar recursos de forma rápida,
            confiável e com prestação de contas clara.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-primary">Como funciona</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Crie uma campanha contando o objetivo e a necessidade.</li>
            <li>Receba doações via PIX, Boleto ou Cartão com parceiros de pagamento.</li>
            <li>Acompanhe doações e compartilhe relatórios de transparência.</li>
          </ol>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-2xl font-semibold text-primary">Transparência</h2>
          <p>
            O iDoe oferece relatórios por campanha com total arrecadado, média de doações e quantidade de doadores.
            Acesse a página de <Link className="text-primary underline" href="/transparencia">Transparência</Link> para saber mais.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-2xl font-semibold text-primary">Segurança</h2>
          <p>
            Integramos com provedores de pagamento confiáveis e aplicamos boas práticas de segurança para proteger
            seus dados e transações.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-primary">Perguntas frequentes</h2>
          <div className="space-y-3">
            <details className="rounded border p-3">
              <summary className="font-medium cursor-pointer">Quem pode criar campanhas?</summary>
              <p className="mt-2 text-sm text-gray-700">Qualquer usuário autenticado pode criar uma campanha.</p>
            </details>
            <details className="rounded border p-3">
              <summary className="font-medium cursor-pointer">Como acompanho minhas doações?</summary>
              <p className="mt-2 text-sm text-gray-700">Na área de Campanhas e no seu painel, você encontra suas doações e status.</p>
            </details>
            <details className="rounded border p-3">
              <summary className="font-medium cursor-pointer">Existe moderação das campanhas?</summary>
              <p className="mt-2 text-sm text-gray-700">Sim. Campanhas passam por aprovação de um administrador antes de destaque público.</p>
            </details>
          </div>
        </section>

        <section className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-primary">Comece agora</h2>
          <div className="flex gap-3 justify-center">
            <Link href="/campaigns/new" className="px-5 py-3 rounded-lg bg-primary text-white">Criar campanha</Link>
            <Link href="/campaigns" className="px-5 py-3 rounded-lg border border-primary text-primary">Ver campanhas</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
