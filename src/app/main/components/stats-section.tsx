export function StatsSection() {
  const stats = [
    { value: "1000+", label: "Gotowych promptów" },
    { value: "15+", label: "Kategorii tematycznych" },
    { value: "50%", label: "Oszczędność czasu" },
    { value: "99%", label: "Zadowolonych użytkowników" },
  ]

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Twórz z <span className="text-primary">AI</span> bez ograniczeń
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nasza biblioteka pomoże Ci w pełni wykorzystać potencjał sztucznej inteligencji w codziennej pracy.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-secondary/50 border border-border">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
