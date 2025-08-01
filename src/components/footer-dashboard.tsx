import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-[#fffcf8] mt-auto" style={{ borderColor: "#f0d3b8" }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#d03801]/70">
          <div className="flex items-center gap-4">
            <span>© 2024 Biblioteka promptów</span>
            <Link href="/blog" className="hover:text-[#d03801] transition-colors">
              Blog
            </Link>
            <Link href="/polityka-prywatnosci" className="hover:text-[#d03801] transition-colors">
              Polityka Prywatności
            </Link>
            <Link href="/regulamin" className="hover:text-[#d03801] transition-colors">
              Regulamin
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-[#d03801] transition-colors">
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 