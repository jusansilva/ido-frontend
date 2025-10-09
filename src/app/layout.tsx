import type { Metadata } from "next";
import "./globals.css";
import ClientBoot from "@/components/ClientBoot";

export const metadata: Metadata = {
  title: {
    default: "iDoe - Plataforma de Doações",
    template: "iDoe - %s"
  },
  description: "Plataforma de doações para causas sociais. Doe agora e ajude quem precisa!",
  icons: {
    icon: [
      { url: '/logo.jpeg', sizes: 'any' },
      { url: '/logo.jpeg', type: 'image/jpeg' }
    ],
    apple: '/logo.jpeg',
  },
  openGraph: {
    title: "iDoe - Plataforma de Doações",
    description: "Plataforma de doações para causas sociais. Doe agora e ajude quem precisa!",
    images: ['/logo.jpeg'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/logo.jpeg" type="image/jpeg" />
      </head>
      <body className={`antialiased bg-[var(--background)] text-[var(--foreground)]`}>
        <ClientBoot />
        {children}
      </body>
    </html>
  );
}
