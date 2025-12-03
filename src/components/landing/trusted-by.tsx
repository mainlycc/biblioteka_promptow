import { Bot, Cpu, Layers, Zap, Sparkles } from "lucide-react"

export function TrustedBy() {
  const tools = [
    { name: "ChatGPT", icon: Bot },
    { name: "Midjourney", icon: Layers },
    { name: "DALL·E", icon: Sparkles },
    { name: "Claude", icon: Cpu },
    { name: "Stable Diffusion", icon: Zap },
  ]

  return (
    <section className="py-12 border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          Prompty dla najpopularniejszych narzędzi AI
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <tool.icon className="h-5 w-5" />
              <span className="font-medium">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

