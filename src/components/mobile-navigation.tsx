"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Search, Image as ImageIcon, Film, FileText } from "lucide-react"

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
    href: "/",
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

export function MobileNavigation() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname === href || pathname.startsWith(href + "/")
  }

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8"
          aria-label="Otwórz menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] max-h-[600px]">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle className="text-left text-lg">Menu nawigacji</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col p-4 space-y-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center p-4 rounded-lg transition-colors min-h-[56px]",
                isActive(route.href)
                  ? "bg-orange-100 text-orange-600"
                  : "hover:bg-gray-50 text-gray-700"
              )}
            >
              <route.icon
                className={cn(
                  "h-6 w-6 mr-4",
                  isActive(route.href) ? "text-orange-600" : route.color
                )}
              />
              <span className="text-base font-medium">{route.label}</span>
            </Link>
          ))}
          
          <div className="pt-4 mt-4 border-t">
            <Link href="/contact" onClick={handleLinkClick}>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg text-base">
                + Dodaj prompt
              </Button>
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
} 