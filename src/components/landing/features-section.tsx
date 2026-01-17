import { Lightbulb, Search, Copy, FolderOpen, Sparkles, Users } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: FolderOpen,
      title: "Kategorie tematyczne",
      description: "Prompty uporządkowane w intuicyjne kategorie - marketing, copywriting, programowanie i więcej.",
    },
    {
      icon: Search,
      title: "Szybkie wyszukiwanie",
      description: "Znajdź idealny prompt w kilka sekund dzięki zaawansowanej wyszukiwarce.",
    },
    {
      icon: Copy,
      title: "Kopiuj jednym klikiem",
      description: "Każdy prompt gotowy do użycia - po prostu skopiuj i wklej do swojego narzędzia AI.",
    },
    {
      icon: Sparkles,
      title: "Sprawdzone i przetestowane",
      description: "Wszystkie prompty zostały przetestowane, aby dawać najlepsze rezultaty.",
    },
    {
      icon: Lightbulb,
      title: "Łatwe dla początkujących",
      description: "Nie musisz być ekspertem - nasze prompty są proste i intuicyjne w użyciu.",
    },
    {
      icon: Users,
      title: "Społeczność użytkowników",
      description: "Dołącz do tysięcy osób, które już wykorzystują AI w swojej pracy.",
    },
  ]

  return (
    <section id="funkcje" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Funkcje <span className="text-primary">Biblioteki Promptów</span>, które pokochasz
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Wszystko czego potrzebujesz, aby tworzyć świetne treści z AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-background rounded-2xl border p-6 hover:shadow-lg transition-all duration-300"
              style={{ borderColor: 'var(--main-orange)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

