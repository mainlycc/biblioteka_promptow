"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface BlogContentProps {
  content: string
  className?: string
}

export function BlogContent({ content, className }: BlogContentProps) {
  return (
    <div className={cn("blog-content prose prose-lg max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Nagłówki
          h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold mb-6 mt-8 text-black border-b border-gray-200 pb-2" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-bold mb-4 mt-6 text-black" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-semibold mb-3 mt-5 text-black" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-lg font-semibold mb-2 mt-4 text-black" {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className="text-base font-semibold mb-2 mt-3 text-black" {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="text-sm font-semibold mb-2 mt-3 text-black" {...props}>
              {children}
            </h6>
          ),

          // Paragrafy
          p: ({ children, ...props }) => (
            <p className="mb-4 leading-relaxed text-black" {...props}>
              {children}
            </p>
          ),

          // Listy
          ul: ({ children, ...props }) => (
            <ul className="mb-4 pl-6 space-y-1" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="mb-4 pl-6 space-y-1" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-gray-800" {...props}>
              {children}
            </li>
          ),

          // Linki
          a: ({ children, href, ...props }) => (
            <a 
              href={href} 
              className="text-[#d03801] hover:text-[#a02d01] underline transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),

          // Cytaty
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-[#d03801] pl-4 py-2 my-4 bg-gray-50 italic text-gray-700" {...props}>
              {children}
            </blockquote>
          ),

          // Kod
          code: ({ children, className, ...props }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          pre: ({ children, ...props }) => (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 border" {...props}>
              {children}
            </pre>
          ),

          // Tabele
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-gray-300" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-gray-50" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="border-b border-gray-200" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-black" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-gray-300 px-4 py-2 text-black" {...props}>
              {children}
            </td>
          ),

          // Obrazy
          img: ({ src, alt, ...props }) => (
            <div className="my-6">
              <img 
                src={src} 
                alt={alt} 
                className="max-w-full h-auto rounded-lg shadow-sm border" 
                {...props}
              />
              {alt && (
                <p className="text-sm text-gray-600 text-center mt-2 italic">
                  {alt}
                </p>
              )}
            </div>
          ),

          // Linie poziome
          hr: ({ ...props }) => (
            <hr className="my-8 border-gray-300" {...props} />
          ),

          // Pogrubienie i kursywa
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-black" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-black" {...props}>
              {children}
            </em>
          ),

          // Przekreślenie
          del: ({ children, ...props }) => (
            <del className="line-through text-gray-500" {...props}>
              {children}
            </del>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// Komponent do renderowania specjalnych bloków (np. przykładów, ostrzeżeń)
export function InfoBlock({ 
  type = "info", 
  title, 
  children, 
  className 
}: { 
  type?: "info" | "warning" | "success" | "error" 
  title?: string 
  children: React.ReactNode 
  className?: string 
}) {
  const variants = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800"
  }

  const icons = {
    info: "ℹ️",
    warning: "⚠️",
    success: "✅",
    error: "❌"
  }

  return (
    <Card className={cn("mb-6", variants[type], className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span>{icons[type]}</span>
          {title || type.charAt(0).toUpperCase() + type.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

// Komponent do renderowania przykładów kodu
export function CodeExample({ 
  title, 
  language = "text", 
  children, 
  className 
}: { 
  title?: string 
  language?: string 
  children: string 
  className?: string 
}) {
  return (
    <Card className={cn("mb-6 border-gray-200", className)}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-gray-800">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code className={`language-${language}`}>
            {children}
          </code>
        </pre>
      </CardContent>
    </Card>
  )
}
