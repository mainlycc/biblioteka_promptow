"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header-dashboard"
import Footer from "@/components/footer-dashboard"
import { Sidebar } from "@/components/sidebar-dashboard"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  if (isHomePage) {
    // Strona główna - bez Header/Sidebar z dashboardu
    return <>{children}</>
  }

  // Inne strony - z Header/Sidebar
  return (
    <>
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
    </>
  )
}

