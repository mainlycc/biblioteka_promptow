import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/images/mascot.png" alt="Biblioteka Promptów" width={40} height={40} className="h-10 w-10" />
              <span className="text-lg font-bold text-foreground">Biblioteka Promptów</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Centrum gotowych promptów do AI. Twórz lepsze treści i oszczędzaj czas. 
              Dowiedz się więcej o <a href="https://openai.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI</a> i <a href="https://www.promptingguide.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">prompt engineering</a>.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Strony</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#funkcje" className="text-muted-foreground hover:text-foreground transition-colors">
                  Funkcje
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Prawne</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Regulamin
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="text-center sm:text-left">
              © {new Date().getFullYear()} Biblioteka Promptów. Wszelkie prawa zastrzeżone.
            </div>
            <div className="text-center sm:text-right">
              Made by{" "}
              <Link 
                href="https://www.mainly.pl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                mainly
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

