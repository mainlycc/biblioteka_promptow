import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileNavigation } from "@/components/mobile-navigation";

export function Header() {
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
      </div>
      
      {/* Center section - Search */}
      <div className="flex-1 flex justify-center max-w-xs md:max-w-xs lg:max-w-md mx-2 min-w-0">
        <Input placeholder="Szukaj promptów..." className="w-full" />
      </div>
      
      {/* Right section - Newsletter button */}
      <div className="flex items-center flex-shrink-0">
        <Button asChild variant="outline" className="hidden lg:flex whitespace-nowrap">
          <Link href="/newsletter">Dołącz do nas</Link>
        </Button>
      </div>
    </header>
  );
} 