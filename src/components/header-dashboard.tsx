import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="flex items-center justify-between bg-white border-b px-8 py-4 gap-4">
      <Link href="/" className="text-xl font-semibold transition-colors hover:text-[color:var(--main-orange)]">
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