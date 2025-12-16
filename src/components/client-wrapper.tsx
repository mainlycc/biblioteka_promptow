'use client'

import { ClientErrorBoundary } from "@/components/client-error-boundary"
import { SearchProvider } from "@/contexts/search-context"
import { ConditionalLayout } from "@/components/conditional-layout"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import { GoogleAnalytics } from "@/components/google-analytics"
import { PerformanceOptimizer } from "@/components/performance-optimizer"

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClientErrorBoundary>
      <SearchProvider>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Toaster />
        <Analytics />
        <GoogleAnalytics />
        <PerformanceOptimizer />
      </SearchProvider>
    </ClientErrorBoundary>
  )
}

