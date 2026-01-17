import { Search, Copy, Sparkles } from "lucide-react"
import Link from "next/link"

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      icon: Search,
      title: "Znajdź odpowiedni prompt",
      description: "Przeglądaj naszą bibliotekę lub użyj wyszukiwarki, aby znaleźć prompt dopasowany do Twojego zadania. Prompty są podzielone na kategorie tematyczne.",
    },
    {
      number: 2,
      icon: Copy,
      title: "Skopiuj prompt jednym klikiem",
      description: "Wystarczy kliknąć przycisk kopiowania i gotowy prompt zostanie skopiowany do schowka. Możesz od razu użyć go w swoim narzędziu AI.",
    },
    {
      number: 3,
      icon: Sparkles,
      title: "Wklej do ChatGPT lub Claude i ciesz się wynikami",
      description: "Wklej skopiowany prompt do ChatGPT, Claude, Gemini lub innego narzędzia AI. Dostosuj prompt do swoich potrzeb i uzyskaj profesjonalne rezultaty w kilka sekund.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Jak używać <span className="text-primary">promptów</span> w 3 krokach
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Prosty proces od znalezienia do wykorzystania - wszystko w kilka kliknięć.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <ol className="space-y-8 md:space-y-12">
            {steps.map((step) => (
              <li
                key={step.number}
                className="flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 text-2xl font-bold text-primary" style={{ borderColor: 'var(--main-orange)' }}>
                  {step.number}
                </div>
                <div className="flex-1 bg-background rounded-2xl border p-6 hover:shadow-lg transition-all" style={{ borderColor: 'var(--main-orange)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 text-center">
            <Link
              href="/prompty"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
            >
              Rozpocznij teraz
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
