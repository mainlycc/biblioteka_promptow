import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Settings, Image } from "lucide-react"
import { PromptGrid } from "@/components/prompt-grid"
import { GraphicCard } from "@/components/graphic-card"
import { usePathname } from "next/navigation"

export default function HomePage() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarTrigger />
        <SidebarContent>
          <SidebarMenuItem label="Strona główna" href="/">
            <Home className="w-5 h-5" />
          </SidebarMenuItem>
          <SidebarMenuItem label="Graficzne" href="/graficzne">
            <Image className="w-5 h-5" />
          </SidebarMenuItem>
          <SidebarMenuItem label="Ustawienia" href="#">
            <Settings className="w-5 h-5" />
          </SidebarMenuItem>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-8 pt-4">
        {pathname !== "/graficzne" && <PromptGrid />}
      </main>
    </SidebarProvider>
  )
}
