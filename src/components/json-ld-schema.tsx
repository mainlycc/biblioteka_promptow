import Script from 'next/script'

interface PromptSchemaProps {
  prompt: {
    id: string
    title: string
    description: string
    tags: string[]
    author: string
    created_at: string
  }
}

export function PromptSchema({ prompt }: PromptSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `https://bibliotekapromptow.pl/prompt/${prompt.id}`,
    "name": prompt.title,
    "description": prompt.description,
    "author": {
      "@type": "Person",
      "name": prompt.author
    },
    "dateCreated": prompt.created_at,
    "dateModified": prompt.created_at,
    "keywords": prompt.tags.join(", "),
    "url": `https://bibliotekapromptow.pl/prompt/${prompt.id}`,
    "publisher": {
      "@type": "Organization",
      "name": "Biblioteka Promptów",
      "url": "https://bibliotekapromptow.pl"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://bibliotekapromptow.pl/prompt/${prompt.id}`
    }
  }

  return (
    <Script
      id={`prompt-schema-${prompt.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Biblioteka Promptów",
    "url": "https://bibliotekapromptow.pl",
    "logo": "https://bibliotekapromptow.pl/logo.png",
    "description": "Biblioteka najlepszych promptów dla ChatGPT, Claude, Gemini i innych modeli AI",
    "sameAs": [
      "https://twitter.com/bibliotekapromptow",
      "https://github.com/bibliotekapromptow"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "kontakt@bibliotekapromptow.pl",
      "contactType": "customer service"
    }
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Biblioteka Promptów",
    "url": "https://bibliotekapromptow.pl",
    "description": "Najlepsze prompty dla AI - ChatGPT, Claude, Gemini",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://bibliotekapromptow.pl?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
} 