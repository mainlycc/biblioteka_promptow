"use client"

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileNavigation } from "@/components/mobile-navigation";
import { useSearch } from "@/contexts/search-context";
import { cn } from "@/lib/utils";
import { FileText, Image as ImageIcon } from "lucide-react";

export function Header() {
  const { searchQuery, setSearchQuery } = useSearch();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <header className="flex items-center justify-between bg-white border-b px-4 md:px-6 lg:px-8 py-2 md:py-3 gap-2 md:gap-4">
      {/* Left section - Mobile menu + Logo */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <MobileNavigation />
        <Link href="/" className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-semibold transition-colors hover:text-[color:var(--main-orange)] min-w-0">
          <Image
            src="/logo.png"
            alt="Biblioteka Promptów - Najlepsze prompty dla AI"
            width={150}
            height={150}
            className="object-contain"
            priority
            loading="eager"
          />
          <span className="sr-only">Biblioteka Promptów</span>
        </Link>
        
        {/* Navigation links - Desktop only */}
        <nav className="hidden md:flex items-center gap-2 ml-4">
          <Link
            href="/prompty"
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
              isActive("/prompty") 
                ? "bg-orange-100 text-orange-700 shadow-sm" 
                : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
            )}
          >
            <FileText className="h-4 w-4" />
            <span>Prompty tekstowe</span>
          </Link>
          <Link
            href="/prompts-graficzne"
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
              isActive("/prompts-graficzne") 
                ? "bg-orange-100 text-orange-700 shadow-sm" 
                : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
            )}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Prompty graficzne</span>
          </Link>
        </nav>
      </div>
      
      {/* Center section - Search (ukryte na stronie głównej) */}
      {!isHomePage && (
      <div className="flex-1 flex justify-center max-w-xs md:max-w-xs lg:max-w-md mx-2 min-w-0">
        <Input 
          placeholder="Szukaj promptów..." 
          className="w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      )}
      
      {/* Right section - Newsletter button */}
      <div className="flex items-center flex-shrink-0">
        <Button asChild className="hidden lg:flex whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white border-orange-500">
          <Link href="/newsletter">Dołącz do nas</Link>
        </Button>
      </div>
    </header>
  );
} 