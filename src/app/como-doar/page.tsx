import Header from '@/components/Header';
import PageTitle from '@/components/PageTitle';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function ComoDoarPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-['Roboto',sans-serif]">
      <PageTitle title="Como Doar" />
      <Header />
      <div className="h-20 md:h-24" />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">Como Doar</h1>
        <p className="text-gray-700 mb-8">
          Doar no iDoe é simples e seguro. Siga os passos abaixo para contribuir com campanhas que fazem a diferença.
        </p>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-primary">1. Crie sua conta ou faça login</h2>
          <p>
            Para acompanhar suas doações e gerar certificados, é recomendado ter uma conta. Acesse a página de{' '}
            <Link href="/register" className="text-primary underline">cadastro</Link> ou faça{' '}
            <Link href="/login" className="text-primary underline">login</Link> se já possui uma conta.
          </p>
          <div className="flex gap-4 items-center bg-[--surface] rounded-lg shadow p-4 border border-[var(--muted)]">
            <Image src="/file.svg" alt="Cadastro" width={48} height={48} />
            <p className="text-gray-700">Leva menos de 1 minuto e permite emitir certificados.</p>
          </div>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-primary">2. Escolha uma campanha</h2>
          <p>
            Visite a página de{' '}
            <Link href="/campaigns" className="text-primary underline">Campanhas</Link> para ver campanhas em andamento. Você pode conferir título, status e relatórios públicos de cada campanha.
          </p>
          <div className="flex gap-4 items-center bg-[--surface] rounded-lg shadow p-4 border border-[var(--muted)]">
            <Image src="/globe.svg" alt="Campanhas" width={48} height={48} />
            <p className="text-gray-700">Prefira campanhas com objetivos claros e atualizações frequentes.</p>
          </div>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-primary">3. Selecione o valor e confirme</h2>
          <p>
            Dentro da campanha escolhida, informe o valor que deseja doar e confirme a operação. Valores são registrados em moeda local e associados com segurança à sua conta.
          </p>
          <div className="flex gap-4 items-center bg-[--surface] rounded-lg shadow p-4 border border-[var(--muted)]">
            <Image src="/window.svg" alt="Pagamento" width={48} height={48} />
            <p className="text-gray-700">Após a confirmação, você recebe a doação registrada e pode emitir comprovante.</p>
          </div>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-primary">4. Acompanhe e gere seu certificado</h2>
          <p>
            Após concluir a doação, você pode acompanhar seu histórico em “Minhas doações” e, quando aplicável, gerar o certificado de doação com código único para verificação.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-primary">Meios de pagamento</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Cartão de crédito e débito (processamento instantâneo)</li>
            <li>PIX (confirmação rápida e com menor custo)</li>
            <li>Boleto bancário (compensação em até 3 dias úteis)</li>
          </ul>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Os pagamentos são processados pela Safe2Pay, gateway brasileiro com suporte a PIX, cartões e boletos. A disponibilidade pode variar conforme a campanha.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[--surface] rounded-lg shadow p-4 border border-[var(--muted)]">
              <h3 className="font-semibold text-primary mb-2">PIX (Safe2Pay)</h3>
              <p className="text-gray-700 text-sm">Gere um QR Code ou use o código “copia e cola”. A confirmação costuma ser em segundos.</p>
            </div>
            <div className="bg-[--surface] rounded-lg shadow p-4 border border-[var(--muted)]">
              <h3 className="font-semibold text-primary mb-2">Cartão (Safe2Pay)</h3>
              <p className="text-gray-700 text-sm">Pagamentos processados e antifraude pelo provedor. Suporte a principais bandeiras.</p>
            </div>
            <div className="bg-[--surface] rounded-lg shadow p-4 border border-[var(--muted)]">
              <h3 className="font-semibold text-primary mb-2">Boleto (Safe2Pay)</h3>
              <p className="text-gray-700 text-sm">Geração de boleto com linha digitável. Compensação em até 3 dias úteis.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-primary">Taxas e repasses</h2>
          <p className="text-gray-700">
            Parte do valor pode estar sujeita a taxas de processamento do meio de pagamento e do provedor financeiro. O repasse às campanhas ocorre de acordo com o cronograma definido pelo organizador, seguindo as políticas da plataforma.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>PIX: taxa reduzida, repasse geralmente mais rápido</li>
            <li>Cartão: taxa de adquirência conforme bandeira e parcelamento</li>
            <li>Boleto: tarifa fixa por emissão/compensação</li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-primary">Segurança e privacidade</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Transações protegidas por HTTPS e processamento na Safe2Pay</li>
            <li>Dados de cartão são enviados diretamente à Safe2Pay e não ficam armazenados no iDoe</li>
            <li>Certificado de doação com código único para auditoria</li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-primary">Suporte</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Em caso de dúvidas, entre em contato com o organizador da campanha pela própria página da campanha ou com o suporte da plataforma.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-primary">Dúvidas frequentes</h2>
          <div className="space-y-3">
            <details className="bg-[--surface] rounded-lg shadow p-4 border border-[var(--muted)]">
              <summary className="font-semibold cursor-pointer">Minhas doações são públicas?</summary>
              <p className="mt-2 text-gray-700">Os valores agregados das campanhas são públicos. Seu histórico pessoal é acessível apenas a você quando autenticado.</p>
            </details>
            <details className="bg-[--surface] rounded-lg shadow p-4 border border-[var(--muted)]">
              <summary className="font-semibold cursor-pointer">Posso obter reembolso?</summary>
              <p className="mt-2 text-gray-700">Como regra geral não há reembolso, mas entre em contato com o suporte da campanha para casos excepcionais.</p>
            </details>
            <details className="bg-[--surface] rounded-lg shadow p-4 border border-[var(--muted)]">
              <summary className="font-semibold cursor-pointer">Como funciona o certificado?</summary>
              <p className="mt-2 text-gray-700">Cada doação elegível gera um certificado com código exclusivo vinculado à sua doação, permitindo auditoria e comprovação.</p>
            </details>
          </div>
        </section>

        <section className="space-y-4 mb-6">
          <h2 className="text-2xl font-semibold text-primary">Pronto para começar?</h2>
          <div className="flex gap-3">
            <Link href="/register" className="px-4 py-2 rounded-lg bg-success text-white font-semibold">Criar conta</Link>
            <Link href="/campaigns" className="px-4 py-2 rounded-lg border border-primary text-primary font-semibold">Ver campanhas</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
