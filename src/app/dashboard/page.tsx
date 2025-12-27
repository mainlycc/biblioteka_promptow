import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Biblioteka Promptów",
  description: "Dashboard użytkownika Biblioteki Promptów",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function Page() {
  return (
    <main className="flex-1 w-full p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>To jest bazowa wersja dashboardu.</p>
    </main>
  )
}
