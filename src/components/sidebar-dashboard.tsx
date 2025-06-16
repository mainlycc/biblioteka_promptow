"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, Home, PlusCircle, Search, Settings, Users } from "lucide-react"

const routes = [
  {
    label: "Strona główna",
    icon: Home,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Wszystkie prompty",
    icon: BookOpen,
    href: "/prompts",
    color: "text-violet-500",
  },
  {
    label: "Dodaj prompt",
    icon: PlusCircle,
    href: "/prompt/new",
    color: "text-pink-700",
  },
  {
    label: "Wyszukaj",
    icon: Search,
    href: "/search",
    color: "text-orange-700",
  },
  {
    label: "Użytkownicy",
    icon: Users,
    href: "/users",
    color: "text-emerald-500",
  },
  {
    label: "Ustawienia",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white text-black border-r">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-black hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-black bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 