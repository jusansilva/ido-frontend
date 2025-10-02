# iDoe Frontend (Next.js)

Visão geral
- App migrado para Next.js (App Router) com Tailwind CSS v4.
- As seções do antigo `index.html` foram convertidas em componentes React no diretório `src/components`.
- Os arquivos `index.html` e `script.js` no root ficam como referência visual LEGADA e não são usados em runtime do Next.

Backend real (proxy)
- Coloque o backend em `../ido-backend` (irmão deste projeto) e rode-o (ex.: `npm run dev`, porta 4000 por padrão).
- O Next está configurado para PROXY de `http://localhost:3000/api/*` -> `http://localhost:4000/*` via `next.config.ts`.
- Para alterar o alvo do proxy, defina `API_PROXY_TARGET` (ex.: `API_PROXY_TARGET=http://localhost:8080 npm run dev`).
- Alternativa: em vez de proxy, defina `NEXT_PUBLIC_API_BASE_URL` (ex.: `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`) para o client chamar direto.

Como rodar
- Instalar dependências: `npm i`
- Dev: `npm run dev` e abra `http://localhost:3000`
- Build: `npm run build`
- Start: `npm start`

Ambiente (.env.local)
- Copie o exemplo: `cp .env.local.example .env.local`
- Edite conforme sua necessidade:
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` para o frontend chamar o backend diretamente (sem proxy).
  - Ou remova/comente `NEXT_PUBLIC_API_BASE_URL` e use o proxy: `API_PROXY_TARGET=http://localhost:4000` (tudo que for `/api/*` no Next será redirecionado).
  - Se nada for definido, o client usa por padrão `NEXT_PUBLIC_API_BASE_URL=/api` e as requisições passam pelo proxy do Next.

Estrutura principal
- Home: `src/app/page.tsx`
- Layout global + estilos: `src/app/layout.tsx`, `src/app/globals.css`
- Componentes:
  - Header: `src/components/Header.tsx`
  - Hero (+ Modal): `src/components/Hero.tsx`, `src/components/Modal.tsx`
  - FilterBar: `src/components/FilterBar.tsx`
  - FeaturedCampaign (banner destaque): `src/components/FeaturedCampaign.tsx`
  - CampaignList/CampaignCard (sugeridas): `src/components/CampaignList.tsx`, `src/components/CampaignCard.tsx`
  - PartnersCarousel (iniciativas): `src/components/PartnersCarousel.tsx`
  - Footer: `src/components/Footer.tsx`
  - Toast: `src/components/Toast.tsx`
- Libs:
  - API client: `src/lib/api.ts`
  - Auth storage: `src/lib/auth.ts`

Autenticação (mock -> backend real)
- Antes usávamos rotas /api internas do Next (mock). Removidas para evitar conflito com proxy.
- Agora o Login/Cadastro usam o client `api` que chama `/api/auth/login` e `/api/auth/register` (passam pelo proxy).
- Ajuste os endpoints do backend se forem diferentes.

Estilos e Design System
- Tailwind v4 com plugin `@tailwindcss/postcss` configurado em `postcss.config.mjs`.
- Cores principais definidas em `tailwind.config.js`:
  - `primary` `#200D00`, `secondary` `#E5E8FF`, `text` `#2A2A2A`, `background` `#F8F6F6`, `success` `#00C48C`.
- `globals.css` define o fundo `#F8F6F6` e cor de texto base `#2A2A2A` para manter fidelidade ao HTML legado.

Imagens
- `next/image` foi aplicado onde possível para melhor performance, usando assets de `public/` (ex.: `/logo.jpeg`).

Fontes
- Atualmente usando fontes do sistema por restrição de rede no build.
- Para usar Roboto via `next/font/google` quando houver rede:
  1. Em `src/app/layout.tsx`: `import { Roboto } from 'next/font/google'`
  2. `const roboto = Roboto({ subsets: ['latin'], weight: ['400','500','700'], variable: '--font-roboto' })`
  3. Aplicar no `body` a classe `roboto.variable` e ajustar `font-['Roboto',sans-serif]` conforme necessidade.

Observações
- `index.html` e `script.js` permanecem no root SOMENTE como referência visual. Qualquer ajuste funcional deve ser feito nos componentes React/Next.
- Caso veja diferenças sutis de espaçamento/hover, ajuste direto nas classes Tailwind dos componentes correspondentes.

Deploy (S3 + CloudFront)
- O projeto está configurado para export estático (`output: 'export'` no `next.config.ts`), ideal para S3 + CloudFront.
- Infra (Terraform): veja `infra/terraform/README.md` para criar o bucket S3 privado e a distribuição CloudFront (com OAC e roteamento SPA).
- CI (GitHub Actions): arquivo `.github/workflows/deploy.yml` publica o conteúdo de `out/` no S3 e invalida o CloudFront a cada push em `main`.
- Secrets necessários no repositório (Settings > Secrets and variables > Actions):
  - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`
  - `S3_BUCKET_NAME` (nome do bucket criado pelo Terraform)
  - `CLOUDFRONT_DISTRIBUTION_ID`
  - `NEXT_PUBLIC_API_BASE_URL` (URL pública do backend consumida pelo frontend)
- Build local para validar: `NEXT_PUBLIC_API_BASE_URL=https://api.seudominio.com npm run build` e verifique a pasta `out/`.
