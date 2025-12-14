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

  // Kompresja
  compress: true,

  // Optymalizacja bundle
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Włącz eksperymentalne wsparcie MDX (Rust compiler - szybsze)
    // Jeśli potrzebujesz pluginów rehype/remark, ustaw na false
    mdxRs: true,
  },

  // Webpack optymalizacje
  webpack: (config, { dev, isServer }) => {
    // Wymuś użycie jednej wersji React dla wszystkich modułów
    config.resolve.alias = {
      ...config.resolve.alias,
      react: require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
    };

    // Wymuś użycie jednej wersji React w zależnościach
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        react: require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
      };
    }

    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }
    return config;
  },
};

// Utwórz wrapper MDX
const withMDX = createMDX({});

module.exports = withMDX(nextConfig); 