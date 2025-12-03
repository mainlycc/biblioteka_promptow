import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Anna Kowalska",
      role: "Freelancer",
      content: "Biblioteka Promptów zmieniła sposób, w jaki pracuję z AI. Oszczędzam godziny każdego tygodnia!",
      rating: 5,
    },
    {
      name: "Marek Nowak",
      role: "Content Creator",
      content: "Świetne prompty do tworzenia treści. Polecam każdemu, kto chce lepiej wykorzystać ChatGPT.",
      rating: 5,
    },
    {
      name: "Kasia Wiśniewska",
      role: "Właścicielka firmy",
      content: "Proste i skuteczne. Mój zespół używa tych promptów codziennie do tworzenia postów.",
      rating: 5,
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ludzie <span className="text-primary">kochają</span> nasze prompty
            </h2>
            <p className="text-muted-foreground mb-6">
              Dołącz do tysięcy zadowolonych użytkowników, którzy już wykorzystują naszą bibliotekę do tworzenia
              lepszych treści z AI.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-3 w-3 text-primary fill-primary" />
                </div>
                Oszczędność czasu i wysiłku
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-3 w-3 text-primary fill-primary" />
                </div>
                Lepsze rezultaty z AI
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-3 w-3 text-primary fill-primary" />
                </div>
                Więcej inspiracji i pomysłów
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-background rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
