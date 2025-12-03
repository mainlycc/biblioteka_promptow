import { MessageSquare, Users, Zap } from "lucide-react"

export function BentoSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Wbudowana integracja z <span className="text-primary">AI</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Prompty przygotowane specjalnie dla najpopularniejszych narzędzi sztucznej inteligencji.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-background rounded-2xl border p-6 hover:shadow-lg transition-all" style={{ borderColor: 'var(--main-orange)' }}>
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Czatuj z AI</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Wykorzystaj nasze prompty do prowadzenia efektywnych rozmów z chatbotami AI.
            </p>
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">AI</span>
                </div>
                <span className="text-sm font-medium text-foreground">Asystent</span>
              </div>
              <p className="text-xs text-muted-foreground">
                &ldquo;Świetnie! Oto 5 wariantów nagłówka dla Twojego produktu...&rdquo;
              </p>
            </div>
          </div>

          <div className="bg-background rounded-2xl border p-6 hover:shadow-lg transition-all" style={{ borderColor: 'var(--main-orange)' }}>
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Zaproś zespół</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Udostępnij dostęp swojemu zespołowi i twórzcie razem lepsze treści.
            </p>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center"
                >
                  <span className="text-xs font-medium text-primary">{i}</span>
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

