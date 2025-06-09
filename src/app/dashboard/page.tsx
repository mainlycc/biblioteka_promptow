import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <nav className="flex flex-col gap-2 p-4">
            <a href="#" className="text-orange-600 font-semibold">Dashboard</a>
            <a href="#" className="text-orange-600">Ustawienia</a>
            <a href="#" className="text-orange-600">Wyloguj</a>
          </nav>
        </Sidebar>
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p>To jest bazowa wersja dashboardu.</p>
        </main>
      </div>
    </SidebarProvider>
  )
}
