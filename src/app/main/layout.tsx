import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import { GoogleAnalytics } from "@/components/google-analytics"
import { PerformanceOptimizer } from "@/components/performance-optimizer"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      {children}
      <Toaster />
      <Analytics />
      <GoogleAnalytics />
      <PerformanceOptimizer />
    </ErrorBoundary>
  );
}

