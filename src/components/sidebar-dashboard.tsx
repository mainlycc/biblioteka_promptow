"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Search, Image as ImageIcon, Film, FileText } from "lucide-react"
import React from "react"

const routes = [
  {
    label: "Wyszukaj",
    icon: Search,
    href: "/search",
    color: "text-pink-700",
  },
  {
    label: "Prompty tekstowe",
    icon: FileText,
    href: "/prompty",
    color: "text-pink-700",
  },
  {
    label: "Prompty graficzne",
    icon: ImageIcon,
    href: "/prompts-graficzne",
    color: "text-pink-700",
  },
  {
    label: "Prompty filmowe",
    icon: Film,
    href: "/filmowe",
    color: "text-pink-700",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  // Funkcja do sprawdzania czy strona jest aktywna
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname === href || pathname.startsWith(href + "/")
  }
  


  return (
    <div className={`space-y-4 py-4 flex flex-col h-full bg-white text-black border-r transition-all duration-200 w-64`}>
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-black hover:bg-orange-50 rounded-lg transition",
                isActive(route.href) ? "text-orange-600 bg-orange-100" : "text-zinc-400",
              )}
            >
              <div className={cn("flex items-center")}> 
                <route.icon className={cn("h-5 w-5 mr-3", isActive(route.href) ? "text-orange-600" : route.color)}/>
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 pb-4">
        <Link
          href="/contact"
          className={cn(
            "w-full block text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
          )}
        >
          + Dodaj prompt
        </Link>
      </div>
    </div>
  )
} 