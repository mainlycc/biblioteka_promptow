"use client"

import * as React from "react"
import { Menu } from "lucide-react"

const SidebarContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true)
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className="flex min-h-screen">{children}</div>
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider")
  return context
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar()
  return (
    <aside
      className={`bg-white border-r transition-all duration-200 ${
        open ? "w-64" : "w-16"
      } h-screen flex flex-col relative`}
    >
      {children}
      <a
        href="/login"
        className="absolute bottom-4 left-4 right-4 flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600 transition font-semibold"
      >
        + Dodaj prompt
      </a>
    </aside>
  )
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { open, setOpen } = useSidebar()
  return (
    <button
      className={`absolute top-4 left-4 z-50 bg-white border rounded p-2 shadow hover:bg-gray-50 transition md:hidden ${className || ''}`}
      onClick={() => setOpen(!open)}
      aria-label={open ? "Zwiń menu" : "Rozwiń menu"}
      type="button"
    >
      <Menu />
    </button>
  )
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <nav className="flex-1 flex flex-col gap-2 p-4 mt-16">{children}</nav>
}

export function SidebarMenuItem({
  label,
  href = "#",
  children,
}: {
  label: string
  href?: string
  children: React.ReactNode
}) {
  const { open } = useSidebar()
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-2 py-2 rounded hover:bg-orange-50 text-orange-700 font-medium transition"
    >
      {children}
      {open && <span>{label}</span>}
    </a>
  )
}
