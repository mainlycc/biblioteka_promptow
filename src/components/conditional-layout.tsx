"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header-dashboard"
import Footer from "@/components/footer-dashboard"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  if (isHomePage) {
    // Strona główna - bez Header z dashboardu
    return <>{children}</>
  }

  // Inne strony - z Header
  return (
    <>
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </>
  )
}

