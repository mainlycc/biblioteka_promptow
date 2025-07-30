import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="flex items-center justify-between bg-white border-b px-8 py-4 gap-4">
      <Link href="/" className="flex items-center gap-3 text-xl font-semibold transition-colors hover:text-[color:var(--main-orange)]">
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
      <div className="flex-1 flex justify-center">
        <Input placeholder="Szukaj promptów..." className="max-w-md" />
      </div>
      <Button asChild variant="outline">
        <Link href="/newsletter">Dołącz do nas</Link>
      </Button>
    </header>
  );
} 