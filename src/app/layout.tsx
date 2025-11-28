import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header-dashboard";
import Footer from "@/components/footer-dashboard";
import { Sidebar } from "@/components/sidebar-dashboard";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@/components/google-analytics";
import { PerformanceOptimizer } from "@/components/performance-optimizer";
import { ErrorBoundary } from "@/components/error-boundary";
import { SearchProvider } from "@/contexts/search-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Biblioteka Promptów - Najlepsze Prompty dla AI",
    template: "%s | Biblioteka Promptów"
  },
  description: "Darmowa biblioteka najlepszych promptów dla ChatGPT, Claude i Gemini. Gotowe szablony AI dla biznesu, kreatywności i codziennej pracy.",
  keywords: [
    "prompty",
    "prompt engineering",
    "ChatGPT",
    "Claude",
    "Gemini",
    "AI",
    "sztuczna inteligencja",
    "szablony promptów",
    "biblioteka promptów",
    "prompt templates",
    "darmowe prompty chatgpt",
    "najlepsze prompty claude",
    "prompty do ai",
    "gotowe prompty",
    "prompty dla gemini",
    "skuteczne prompty",
    "prompty po polsku",
    "szablony do chatgpt",
    "biblioteka ai",
    "prompty biznesowe"
  ],
  authors: [{ name: "Biblioteka Promptów" }],
  creator: "Biblioteka Promptów",
  publisher: "Biblioteka Promptów",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bibliotekapromptow.pl'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: 'https://bibliotekapromptow.pl',
    title: 'Biblioteka Promptów - Najlepsze Prompty dla AI',
    description: 'Odkryj najlepsze prompty dla ChatGPT, Claude, Gemini i innych modeli AI. Skuteczne szablony promptów dla biznesu, kreatywności i codziennej pracy.',
    siteName: 'Biblioteka Promptów',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Biblioteka Promptów - Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biblioteka Promptów - Najlepsze Prompty dla AI',
    description: 'Odkryj najlepsze prompty dla ChatGPT, Claude, Gemini i innych modeli AI. Skuteczne szablony promptów dla biznesu, kreatywności i codziennej pracy.',
    images: ['/logo.png'],
    creator: '@bibliotekapromptow',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://supabase.co" />
        <link rel="dns-prefetch" href="https://supabase.co" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://vercel.live" />
        <link rel="dns-prefetch" href="https://vercel.live" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#d03801" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Hotjar Tracking Code for Site 6466278 (name missing) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:6466278,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <ErrorBoundary>
          <SearchProvider>
            <Header />
            <div className="flex flex-1">
              <div className="hidden md:block">
                <Sidebar />
              </div>
              <main className="flex-1 w-full">
                {children}
              </main>
            </div>
            <Footer />
            <Toaster />
            <Analytics />
            <GoogleAnalytics />
            <PerformanceOptimizer />
          </SearchProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
