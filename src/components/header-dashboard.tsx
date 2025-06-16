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
          alt="Logo Biblioteki Promptów"
          width={50}
          height={50}
          className="object-contain"
        />
        Biblioteka promptów
      </Link>
      <div className="flex-1 flex justify-center">
        <Input placeholder="Szukaj promptów..." className="max-w-md" />
      </div>
      <Button asChild variant="outline">
        <Link href="/login">Zaloguj się</Link>
      </Button>
    </header>
  );
} 