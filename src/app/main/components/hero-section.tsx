"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Copy, Check } from "lucide-react"
import { useState } from "react"

export function HeroSection() {
  const [copied, setCopied] = useState(false)

  const cards = [
    {
      title: "Analiza Danych Biznesowych",
      tags: ["Analiza", "Excel", "Raporty"],
      prompt: `Jesteś analitykiem danych z doświadczeniem w BI. Przeanalizuj poniższe dane sprzedażowe i przygotuj raport zawierający:

1. Trendy miesięczne i kwartalne
2. Top 5 produktów wg przychodów
3. Segmentację klientów
4. Rekomendacje optymalizacji`,
    },
    {
      title: "Asystent Programisty",
      tags: ["Kod", "Debug", "Python", "JavaScript"],
      prompt: `Jesteś senior developerem. Przeanalizuj kod pod kątem:

1. Błędów logicznych i składniowych
2. Optymalizacji wydajności
3. Najlepszych praktyk i wzorców
4. Bezpieczeństwa aplikacji

Zaproponuj konkretne poprawki z wyjaśnieniem.`,
    },
    {
      title: "Ekspert Copywritingu",
      tags: ["Marketing", "ChatGPT", "Reklama", "Social Media"],
      prompt: `Jesteś ekspertem od copywritingu z 15-letnim doświadczeniem. Napisz 5 wariantów nagłówka dla [PRODUKT].

Wymagania:
- Emocjonalny język
- Max 10 słów
- Różne techniki perswazji

Format: [Nagłówek] - [Technika]`,
    },
    {
      title: "Kreator Treści Social Media",
      tags: ["Instagram", "TikTok", "Viral"],
      prompt: `Jesteś ekspertem od social media. Stwórz post viralowy:

1. Hook przyciągający uwagę
2. Storytelling w 3 zdaniach
3. Call-to-action
4. 5 hashtagów

Temat: [TEMAT]`,
    },
  ]

  const handleCopy = () => {
    navigator.clipboard.writeText(cards[2].prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            Ponad 1000+ gotowych promptów
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Odkryj moc <span className="text-primary">AI</span> z gotowymi{" "}
            <span className="text-primary">promptami</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 text-balance">
            Twórz lepsze treści, oszczędzaj czas i wykorzystaj pełny potencjał sztucznej inteligencji. Gotowe prompty do
            ChatGPT, Midjourney, DALL·E i wielu innych.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-base px-8">
              Rozpocznij za darmo
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 bg-transparent">
              Zobacz prompty
            </Button>
          </div>

          <div className="relative w-full max-w-3xl mx-auto h-[420px]">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl" />

            <div className="absolute w-[300px] h-[300px] bg-background rounded-2xl border-2 border-primary/30 shadow-lg p-4 flex flex-col left-0 top-8 -rotate-12">
              <div className="mb-2">
                <h3 className="text-sm font-bold text-foreground">{cards[0].title}</h3>
              </div>
              <div className="flex-1 bg-secondary rounded-lg p-2.5 font-mono text-[10px] text-foreground leading-relaxed overflow-hidden">
                <pre className="whitespace-pre-wrap">{cards[0].prompt}</pre>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {cards[0].tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute w-[300px] h-[300px] bg-background rounded-2xl border-2 border-primary/50 shadow-xl p-4 flex flex-col left-12 top-14 -rotate-6">
              <div className="mb-2">
                <h3 className="text-sm font-bold text-foreground">{cards[1].title}</h3>
              </div>
              <div className="flex-1 bg-secondary rounded-lg p-2.5 font-mono text-[10px] text-foreground leading-relaxed overflow-hidden">
                <pre className="whitespace-pre-wrap">{cards[1].prompt}</pre>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {cards[1].tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute w-[300px] h-[300px] bg-background rounded-2xl border-2 border-primary/30 shadow-lg p-4 flex flex-col right-0 top-8 rotate-12">
              <div className="mb-2">
                <h3 className="text-sm font-bold text-foreground">{cards[3].title}</h3>
              </div>
              <div className="flex-1 bg-secondary rounded-lg p-2.5 font-mono text-[10px] text-foreground leading-relaxed overflow-hidden">
                <pre className="whitespace-pre-wrap">{cards[3].prompt}</pre>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {cards[3].tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute w-[320px] h-[320px] bg-background rounded-2xl border-2 border-primary shadow-2xl p-5 flex flex-col left-1/2 top-12 -translate-x-1/2 z-10">
              <div className="mb-2">
                <h3 className="text-base font-bold text-foreground">{cards[2].title}</h3>
              </div>
              <div className="flex-1 bg-secondary rounded-lg p-3 font-mono text-xs text-foreground leading-relaxed overflow-hidden">
                <pre className="whitespace-pre-wrap">{cards[2].prompt}</pre>
              </div>
              <div className="flex items-end justify-between mt-2">
                <div className="flex flex-wrap gap-1.5">
                  {cards[2].tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  className="p-2.5 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={handleCopy}
                  aria-label="Kopiuj prompt"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
