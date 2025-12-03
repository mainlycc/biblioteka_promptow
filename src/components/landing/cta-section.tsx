import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-8 md:p-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-background/10 via-transparent to-transparent" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 text-balance">
              Gotowy, aby tworzyć lepsze treści z AI?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-lg">
              Dołącz do tysięcy użytkowników i zacznij korzystać z naszej biblioteki promptów już dziś.
            </p>
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90 gap-2 text-base px-8">
              Rozpocznij za darmo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

