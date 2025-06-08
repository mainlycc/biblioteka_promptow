import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Settings, Image } from "lucide-react"
import { GraphicCard } from "@/components/graphic-card"

export default function GraficznePage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarTrigger />
        <SidebarContent>
          <SidebarMenuItem label="Strona główna" href="/">
            <Home className="w-5 h-5" />
          </SidebarMenuItem>
          <SidebarMenuItem label="Graficzne" href="/graficzne">
            <Image className="w-5 h-5" aria-label="Ikona graficzna" />
          </SidebarMenuItem>
          <SidebarMenuItem label="Ustawienia" href="#">
            <Settings className="w-5 h-5" />
          </SidebarMenuItem>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-8 pt-4">
        <h1 className="text-2xl font-bold mb-4">Prompty graficzne</h1>
        <GraphicCard images={[]} />
      </main>
    </SidebarProvider>
  )
} 