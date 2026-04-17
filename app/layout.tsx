import type { Metadata } from 'next';
import { Merriweather, Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.bioSummary,
  keywords: ['portfolio', 'engineering', 'projects', siteConfig.engineerName],
  authors: [{ name: siteConfig.engineerName }],
  creator: siteConfig.engineerName,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: siteConfig.title,
    description: siteConfig.bioSummary,
    siteName: siteConfig.title,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.bioSummary,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${merriweather.variable} ${inter.variable}`}>
      <body className="font-sans bg-neutral-50 text-neutral-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
