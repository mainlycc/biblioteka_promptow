import { useEffect } from 'react'

export function PerformanceOptimizer() {
  useEffect(() => {
    // Preload krytycznych zasobów
    const preloadLinks = [
      { rel: 'preload', href: '/logo.png', as: 'image' },
      { rel: 'preload', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' },
    ]

    preloadLinks.forEach(({ rel, href, as }) => {
      const link = document.createElement('link')
      link.rel = rel
      link.href = href
      if (as) link.setAttribute('as', as)
      document.head.appendChild(link)
    })

    // Prefetch ważnych stron
    const prefetchPages = ['/blog', '/contact', '/newsletter']
    prefetchPages.forEach(page => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = page
      document.head.appendChild(link)
    })

    // Cleanup
    return () => {
      const links = document.querySelectorAll('link[rel="preload"], link[rel="prefetch"]')
      links.forEach(link => link.remove())
    }
  }, [])

  return null
}

// Hook do lazy loading komponentów
export function useLazyLoad() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('loaded')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    const lazyElements = document.querySelectorAll('[data-lazy]')
    lazyElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

// Hook do preload obrazów
export function useImagePreload(imageUrls: string[]) {
  useEffect(() => {
    imageUrls.forEach(url => {
      const img = new Image()
      img.src = url
    })
  }, [imageUrls])
} 