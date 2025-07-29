"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { PlusCircle, Search, Image, Film, FileText } from "lucide-react"
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
    href: "/",
    color: "text-pink-700",
  },
  {
    label: "Prompty graficzne",
    icon: Image,
    href: "/tweets",
    color: "text-pink-700",
  },
  {
    label: "Prompty filmowe",
    icon: Film,
    color: "text-pink-700",
    children: [
      {
        label: "VEO3 lub halio",
        href: "/filmowe/veo3-halio",
        color: "text-pink-700",
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openFilm, setOpenFilm] = React.useState(false);

  return (
    <div className={`space-y-4 py-4 flex flex-col h-full bg-white text-black border-r transition-all duration-200`}>
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            route.children ? (
              <div key={route.label}>
                <button
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-black hover:bg-orange-50 rounded-lg transition",
                    openFilm ? "text-orange-600 bg-orange-100 border-r-2 border-orange-500" : "text-zinc-400"
                  )}
                  onClick={() => setOpenFilm((prev) => !prev)}
                >
                  <div className={cn("flex items-center")}> 
                    <route.icon className={cn("h-5 w-5 mr-3", openFilm ? "text-orange-600" : route.color)}/>
                    {route.label}
                  </div>
                </button>
                {openFilm && (
                  <div className="ml-8 mt-1 space-y-1">
                    {route.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "text-sm flex p-2 w-full justify-start font-medium cursor-pointer hover:text-black hover:bg-orange-50 rounded-lg transition",
                          pathname === child.href ? "text-orange-600 bg-orange-100 border-r-2 border-orange-500" : "text-zinc-400"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
                              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-black hover:bg-orange-50 rounded-lg transition",
                  pathname === route.href ? "text-orange-600 bg-orange-100 border-r-2 border-orange-500" : "text-zinc-400",
                )}
              >
                <div className={cn("flex items-center")}> 
                  <route.icon className={cn("h-5 w-5 mr-3", pathname === route.href ? "text-orange-600" : route.color)}/>
                  {route.label}
                </div>
              </Link>
            )
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 pb-4">
        <Link
          href="/prompt/new"
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