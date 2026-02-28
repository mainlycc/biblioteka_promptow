const createMDX = require('@next/mdx');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Dodaj rozszerzenia MDX do obsługiwanych typów plików
  pageExtensions: ['mdx', 'ts', 'tsx'],
  
  // Optymalizacja obrazów
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Przekierowania 301 (SEO-safe)
  async redirects() {
    return [
      // www → non-www (konsolidacja authority i canonicali)
      // Bez tego Google widzi dwie wersje strony i dzieli sygnały SEO
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.bibliotekapromptow.pl' }],
        destination: 'https://bibliotekapromptow.pl/:path*',
        permanent: true,
      },
      // UWAGA: Zanim ten redirect zadziała, musisz zmienić slug w Supabase:
      //   stare: "stwórz-zaproszenia-slubne-ai-canva-poradnik"  (z polskim ó)
      //   nowe:  "stworz-zaproszenia-slubne-ai-canva-poradnik"  (bez polskich znaków)
      // Po zmianie sluga w bazie odkomentuj poniższy wpis:
      // {
      //   source: '/blog/stw%C3%B3rz-zaproszenia-slubne-ai-canva-poradnik',
      //   destination: '/blog/stworz-zaproszenia-slubne-ai-canva-poradnik',
      //   permanent: true,
      // },
    ];
  },

  // Headers bezpieczeństwa
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // {
          //   key: 'Content-Security-Policy',
          //   value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: http:; connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://vercel.live wss://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
          // },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ];
  },

  // Wyłącz ESLint podczas buildu (lint osobno przez `pnpm lint`)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Kompresja
  compress: true,

  // Transpilacja pakietów zewnętrznych
  transpilePackages: ['next-mdx-remote'],

  // Optymalizacja bundle
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Włącz eksperymentalne wsparcie MDX (Rust compiler - szybsze)
    // Jeśli potrzebujesz pluginów rehype/remark, ustaw na false
    mdxRs: true,
  },

};

// Utwórz wrapper MDX
const withMDX = createMDX({});

module.exports = withMDX(nextConfig); 