import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/mascot.png" alt="Biblioteka Promptów" width={40} height={40} className="h-10 w-10" />
          <span className="text-lg font-bold text-foreground">Biblioteka Promptów</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#funkcje"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Funkcje
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden md:inline-flex">
            Zaloguj się
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Rozpocznij</Button>
        </div>
      </div>
    </header>
  )
}

