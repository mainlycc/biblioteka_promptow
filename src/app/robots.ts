import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/static/', '/dashboard/', '/login/'],
    },
    sitemap: 'https://bibliotekapromptow.pl/sitemap.xml',
  }
}
