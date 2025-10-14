// Funkcja do formatowania tekstu wstępu
function formatIntroductionText(text: string): string {
  if (!text) {
    return ''
  }
  
  // Jeśli tekst nie ma podwójnych nowych linii, podziel na pojedyncze
  let paragraphs
  if (text.includes('\n\n')) {
    paragraphs = text.split('\n\n')
  } else if (text.includes('\n')) {
    paragraphs = text.split('\n')
  } else {
    // Jeśli nie ma żadnych nowych linii, traktuj całość jako jeden akapit
    paragraphs = [text]
  }
  
  const processedParagraphs = paragraphs.map((paragraph) => {
    const trimmedParagraph = paragraph.trim()
    if (!trimmedParagraph) return ''
    
    // Sprawdź czy to nagłówek
    if (trimmedParagraph.startsWith('### ')) {
      return `<h3 class="text-xl font-bold mt-6 mb-3 text-black">${trimmedParagraph.substring(4)}</h3>`
    }
    if (trimmedParagraph.startsWith('## ')) {
      return `<h2 class="text-2xl font-bold mt-8 mb-4 text-black">${trimmedParagraph.substring(3)}</h2>`
    }
    if (trimmedParagraph.startsWith('# ')) {
      return `<h1 class="text-3xl font-bold mt-10 mb-5 text-black">${trimmedParagraph.substring(2)}</h1>`
    }
    
    // Sprawdź czy to element listy
    if (trimmedParagraph.startsWith('- ')) {
      return `<li class="mb-1 text-black">${trimmedParagraph.substring(2)}</li>`
    }
    
    // Sprawdź czy to podtytuł (cały akapit w **pogrubieniu**)
    if (trimmedParagraph.match(/^\*\*.*\*\*$/)) {
      const content = trimmedParagraph.replace(/^\*\*(.*)\*\*$/, '$1')
      return `<h3 class="text-lg font-bold mt-6 mb-3 text-black">${content}</h3>`
    }
    
    // Sprawdź czy to podtytuł bez gwiazdek (np. "Co To Jest" lub "Do Czego Służy?")
    if (trimmedParagraph.match(/^(Co To Jest|Do Czego Służy\??|Jak To Działa\??|Przykłady|Wskazówki|Uwagi|Podsumowanie)$/i)) {
      return `<h3 class="text-lg font-bold mt-6 mb-3 text-black">${trimmedParagraph}</h3>`
    }
    
    // Formatowanie inline dla zwykłego tekstu
    let processedParagraph = trimmedParagraph
      // Formatowanie **pogrubienie**
      .replace(/\*\*(.*?)\*\*/g, (_, content) => {
        return `<strong class="text-black font-bold">${content}</strong>`
      })
      // Formatowanie *kursywa*
      .replace(/\*(.*?)\*/g, (_, content) => {
        return `<em class="text-black italic">${content}</em>`
      })
      // Formatowanie `kod`
      .replace(/`(.*?)`/g, (_, content) => {
        return `<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-black">${content}</code>`
      })
      // Formatowanie linków [tekst](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
        return `<a href="${url}" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">${text}</a>`
      })
    
    // Opakuj w paragraf
    return `<p class="mb-4 leading-relaxed text-black">${processedParagraph}</p>`
  })
  
  // Połącz akapity
  let result = processedParagraphs.join('\n')
  
  // Opakuj elementy listy w <ul>
  result = result.replace(/<li[^>]*>.*?<\/li>/g, (match) => {
    return `<ul class="list-disc ml-6 mb-4">${match}</ul>`
  })
  
  return result
}

interface PromptIntroductionProps {
  introduction: string
}

export function PromptIntroduction({ introduction }: PromptIntroductionProps) {
  if (!introduction) return null

  return (
    <div className="mb-8">
      <div className="text-black">
        <div 
          dangerouslySetInnerHTML={{ 
            __html: formatIntroductionText(introduction)
          }}
        />
      </div>
    </div>
  )
}


