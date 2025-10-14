import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Panel Administratora - Biblioteka Promptów",
  description: "Panel administratora do zarządzania promptami i blogiem",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


