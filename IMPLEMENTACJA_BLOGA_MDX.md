# Jak zaimplementować blog MDX w Next.js

Dokumentacja opisująca implementację funkcjonalności bloga MDX w zwykłym projekcie Next.js, na podstawie analizy aplikacji `next-mdx-blog`.

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Wymagane zależności](#wymagane-zależności)
3. [Konfiguracja Next.js](#konfiguracja-nextjs)
4. [Struktura projektu](#struktura-projektu)
5. [Komponenty MDX](#komponenty-mdx)
6. [Routing dynamiczny](#routing-dynamiczny)
7. [Obsługa postów MDX z plików](#obsługa-postów-mdx-z-plików)
8. [Obsługa postów z bazy danych (opcjonalnie)](#obsługa-postów-z-bazy-danych-opcjonalnie)
9. [Sitemap](#sitemap)
10. [Przykłady użycia](#przykłady-użycia)

---

## Wprowadzenie

Ten dokument opisuje, jak zaimplementować blog wykorzystujący MDX w Next.js. Aplikacja obsługuje dwa źródła postów:
- **Pliki MDX** - statyczne pliki w strukturze folderów
- **Baza danych** (opcjonalnie) - posty przechowywane w Supabase/PostgreSQL

---

## Wymagane zależności

Zainstaluj następujące pakiety:

```bash
npm install @next/mdx next-mdx-remote sugar-high
# lub
pnpm add @next/mdx next-mdx-remote sugar-high
```

**Opis pakietów:**
- `@next/mdx` - oficjalne wsparcie dla MDX w Next.js
- `next-mdx-remote` - renderowanie treści MDX z bazy danych lub innych źródeł
- `sugar-high` - podświetlanie składni kodu (lekka alternatywa dla Prism.js)

**Opcjonalne zależności:**
- `@supabase/supabase-js` - jeśli używasz Supabase do przechowywania postów
- `postgres` - jeśli używasz bezpośrednio PostgreSQL

---

## Konfiguracja Next.js

### 1. Plik `next.config.ts`

Skonfiguruj Next.js do obsługi plików MDX:

```typescript
import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  // Dodaj rozszerzenia MDX do obsługiwanych typów plików
  pageExtensions: ['mdx', 'ts', 'tsx'],
  
  // Włącz eksperymentalne wsparcie MDX (Rust compiler - szybsze)
  experimental: {
    mdxRs: true
  }
};

// Utwórz wrapper MDX
const withMDX = createMDX({});

export default withMDX(nextConfig);
```

**Uwaga:** Flaga `mdxRs: true` używa kompilatora Rust, który jest szybszy, ale nie obsługuje pluginów rehype/remark. Jeśli potrzebujesz pluginów, usuń tę flagę.

### 2. Plik `tsconfig.json`

Upewnij się, że TypeScript rozpoznaje pliki MDX:

```json
{
  "compilerOptions": {
    // ... inne opcje
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.mdx",  // Ważne: dołącz pliki MDX
    "**/*.ts",
    "**/*.tsx"
  ]
}
```

### 3. Plik `mdx-components.tsx` (w katalogu głównym)

Utwórz plik z komponentami MDX, które będą używane do renderowania treści:

```typescript
import React, { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { highlight } from 'sugar-high';

// Definicje typów dla komponentów
type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type AnchorProps = ComponentPropsWithoutRef<'a'>;

const components = {
  // Nagłówki z niestandardowymi stylami
  h1: (props: HeadingProps) => (
    <h1 className="font-medium pt-12 mb-0" {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2 className="text-gray-800 font-medium mt-8 mb-3" {...props} />
  ),
  h3: (props: HeadingProps) => (
    <h3 className="text-gray-800 font-medium mt-8 mb-3" {...props} />
  ),
  
  // Paragrafy
  p: (props: ParagraphProps) => (
    <p className="text-gray-800 leading-snug" {...props} />
  ),
  
  // Listy
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="text-gray-800 list-disc pl-5 space-y-1" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="text-gray-800 list-decimal pl-5 space-y-2" {...props} />
  ),
  
  // Linki - automatyczna obsługa wewnętrznych i zewnętrznych
  a: ({ href, children, ...props }: AnchorProps) => {
    const className = 'text-blue-500 hover:text-blue-700 underline underline-offset-2';
    
    // Linki wewnętrzne używają Next.js Link
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    
    // Linki do kotwic (hash)
    if (href?.startsWith('#')) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    
    // Linki zewnętrzne z target="_blank"
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
  
  // Podświetlanie składni kodu
  code: ({ children, ...props }: ComponentPropsWithoutRef<'code'>) => {
    const codeHTML = highlight(children as string);
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
  },
  
  // Obrazy - automatyczna optymalizacja dla lokalnych obrazów
  img: ({
    src,
    alt,
    ...props
  }: ComponentPropsWithoutRef<'img'> & { src?: string; alt?: string }) => {
    if (!src) return null;
    
    // Zewnętrzne URL - zwykły tag img
    if (src.startsWith('http') || src.startsWith('//')) {
      return (
        <img
          src={src}
          alt={alt || ''}
          className="my-4 rounded-lg max-w-full h-auto"
          loading="lazy"
          {...props}
        />
      );
    }
    
    // Lokalne obrazy - Next.js Image dla optymalizacji
    return (
      <div className="my-4">
        <Image
          src={src}
          alt={alt || ''}
          width={800}
          height={400}
          className="rounded-lg max-w-full h-auto"
          loading="lazy"
          {...props}
        />
      </div>
    );
  },
  
  // Blockquote
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="ml-[0.075em] border-l-3 border-gray-300 pl-4 text-gray-700"
      {...props}
    />
  ),
};

// Eksportuj hook dla komponentów MDX
export function useMDXComponents() {
  return components;
}
```

---

## Struktura projektu

Zalecana struktura folderów:

```
projekt/
├── app/
│   ├── layout.tsx          # Główny layout
│   ├── page.tsx            # Strona główna z listą postów
│   ├── globals.css         # Globalne style
│   ├── n/                  # Katalog z postami
│   │   ├── [slug]/         # Dynamiczny routing dla postów z bazy
│   │   │   └── page.tsx
│   │   ├── 1/              # Post MDX jako folder
│   │   │   └── page.mdx
│   │   ├── 2/
│   │   │   └── page.mdx
│   │   └── ...
│   └── sitemap.ts          # Generowanie sitemap
├── lib/
│   ├── mdx-posts.ts        # Funkcje do obsługi postów MDX
│   └── blog.ts             # Funkcje do obsługi postów z bazy (opcjonalnie)
├── mdx-components.tsx       # Komponenty MDX
├── next.config.ts
└── tsconfig.json
```

---

## Routing dynamiczny

### Posty z plików MDX

Posty MDX są automatycznie routowane przez Next.js App Router. Każdy folder z plikiem `page.mdx` staje się trasą.

**Przykład:**
- `app/n/1/page.mdx` → dostępny pod adresem `/n/1`
- `app/n/moj-post/page.mdx` → dostępny pod adresem `/n/moj-post`

### Posty z bazy danych

Utwórz dynamiczny route w `app/n/[slug]/page.tsx`:

```typescript
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import { getPostBySlug, getAllPostSlugs } from '@/lib/blog';
import { useMDXComponents } from '@/mdx-components';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generowanie statycznych ścieżek (SSG)
export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generowanie metadanych dla SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    alternates: {
      canonical: `/n/${slug}`,
    },
    openGraph: post.featured_image
      ? {
          images: [post.featured_image],
        }
      : undefined,
  };
}

// Komponent strony posta
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const components = useMDXComponents();

  return (
    <>
      <MDXRemote source={post.content} components={components} />
    </>
  );
}
```

---

## Obsługa postów MDX z plików

Utwórz plik `lib/mdx-posts.ts`:

```typescript
import { promises as fs } from 'fs';
import path from 'path';

export interface MDXPostInfo {
  slug: string;
  title: string;
}

// Pobierz wszystkie slugi z katalogu postów
async function getNoteSlugs(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, {
    recursive: true,
    withFileTypes: true,
  });
  
  return entries
    .filter((entry) => entry.isFile() && entry.name === 'page.mdx')
    .map((entry) => {
      const relativePath = path.relative(
        dir,
        path.join(entry.parentPath, entry.name)
      );
      return path.dirname(relativePath);
    })
    .map((slug) => slug.replace(/\\/g, '/'));
}

// Wyciągnij tytuł z pliku MDX
async function extractTitleFromMDX(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Próba wyciągnięcia z metadata export
    const metadataMatch = content.match(
      /export const metadata = \{[\s\S]*?title:\s*['"](.*?)['"]/
    );
    if (metadataMatch) {
      return metadataMatch[1];
    }
    
    // Fallback: pierwszy nagłówek H1
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      return h1Match[1];
    }
    
    // Ostateczny fallback: nazwa folderu
    const slug = path.basename(path.dirname(filePath));
    return slug;
  } catch (error) {
    console.error(`Error reading MDX file ${filePath}:`, error);
    return path.basename(path.dirname(filePath));
  }
}

// Główna funkcja do pobierania wszystkich postów MDX
export async function getMDXPosts(): Promise<MDXPostInfo[]> {
  try {
    const notesDirectory = path.join(process.cwd(), 'app', 'n');
    const slugs = await getNoteSlugs(notesDirectory);
    
    const posts = await Promise.all(
      slugs.map(async (slug) => {
        const filePath = path.join(notesDirectory, slug, 'page.mdx');
        const title = await extractTitleFromMDX(filePath);
        return { slug, title };
      })
    );
    
    return posts;
  } catch (error) {
    console.error('Error getting MDX posts:', error);
    return [];
  }
}
```

---

## Obsługa postów z bazy danych (opcjonalnie)

Jeśli chcesz przechowywać posty w bazie danych (np. Supabase), utwórz plik `lib/blog.ts`:

```typescript
import { supabase } from './supabase'; // lub inna konfiguracja bazy

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string; // Treść w formacie MDX
  author: string;
  published_at: string | null;
  updated_at: string | null;
  read_time: number | null;
  category: string;
  featured_image: string | null;
  is_published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[];
  created_at: string | null;
}

// Pobierz wszystkie opublikowane posty
export async function getAllPosts(): Promise<BlogPost[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data || [];
}

// Pobierz pojedynczy post po slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Post nie znaleziony
    }
    console.error('Error fetching post:', error);
    return null;
  }

  return data;
}

// Pobierz wszystkie slugi (dla generateStaticParams)
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}
```

**Konfiguracja Supabase** (`lib/supabase.ts`):

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;
```

---

## Sitemap

Utwórz plik `app/sitemap.ts` dla automatycznego generowania sitemap:

```typescript
import { promises as fs } from 'fs';
import path from 'path';
import { getAllPosts } from '@/lib/blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

async function getNoteSlugs(dir: string) {
  const entries = await fs.readdir(dir, {
    recursive: true,
    withFileTypes: true
  });
  return entries
    .filter((entry) => entry.isFile() && entry.name === 'page.mdx')
    .map((entry) => {
      const relativePath = path.relative(
        dir,
        path.join(entry.parentPath, entry.name)
      );
      return path.dirname(relativePath);
    })
    .map((slug) => slug.replace(/\\/g, '/'));
}

export default async function sitemap() {
  const notesDirectory = path.join(process.cwd(), 'app', 'n');
  const [mdxSlugs, supabasePosts] = await Promise.all([
    getNoteSlugs(notesDirectory).catch(() => []),
    getAllPosts().catch(() => []),
  ]);

  const mdxNotes = mdxSlugs.map((slug) => ({
    url: `${SITE_URL}/n/${slug}`,
    lastModified: new Date().toISOString()
  }));

  const supabaseNotes = supabasePosts.map((post) => ({
    url: `${SITE_URL}/n/${post.slug}`,
    lastModified: post.updated_at || post.published_at || new Date().toISOString()
  }));

  const routes = ['', '/work'].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString()
  }));

  return [...routes, ...mdxNotes, ...supabaseNotes];
}
```

---

## Przykłady użycia

### 1. Strona główna z listą postów

`app/page.tsx`:

```typescript
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { getMDXPosts } from '@/lib/mdx-posts';

export default async function HomePage() {
  const [supabasePosts, mdxPosts] = await Promise.all([
    getAllPosts().catch(() => []),
    getMDXPosts().catch(() => []),
  ]);

  // Połącz posty i posortuj
  const allPosts = [
    ...supabasePosts.map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.published_at,
      source: 'supabase' as const,
    })),
    ...mdxPosts.map((post) => ({
      slug: post.slug,
      title: post.title,
      date: null,
      source: 'mdx' as const,
    })),
  ].sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });

  return (
    <>
      <h1>Mój Blog</h1>
      <ul>
        {allPosts.map((post) => (
          <li key={post.slug}>
            <Link href={`/n/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
```

### 2. Przykładowy post MDX

`app/n/1/page.mdx`:

```mdx
export const metadata = {
  title: 'Mój pierwszy post',
  alternates: {
    canonical: '/n/1',
  },
};

# Mój pierwszy post

To jest przykład posta napisanego w MDX.

## Podsekcja

Możesz używać **pogrubienia** i *kursywy*.

### Kod

```javascript
function hello() {
  console.log('Hello, World!');
}
```

### Obrazy

![Opis obrazu](/images/example.jpg)

### Linki

- [Link wewnętrzny](/n/2)
- [Link zewnętrzny](https://example.com)
```

### 3. Layout główny

`app/layout.tsx`:

```typescript
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Mój Blog',
    template: '%s | Mój Blog'
  },
  description: 'Opis mojego bloga.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={inter.className}>
      <body className="antialiased">
        <div className="min-h-screen p-8 bg-white text-gray-900">
          <main className="max-w-[60ch] mx-auto w-full space-y-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
```

---

## Podsumowanie

Aby zaimplementować blog MDX w Next.js:

1. ✅ Zainstaluj wymagane zależności (`@next/mdx`, `next-mdx-remote`, `sugar-high`)
2. ✅ Skonfiguruj `next.config.ts` z obsługą MDX
3. ✅ Utwórz `mdx-components.tsx` z niestandardowymi komponentami
4. ✅ Utwórz strukturę folderów dla postów (`app/n/`)
5. ✅ Zaimplementuj routing dynamiczny dla postów z bazy danych
6. ✅ Utwórz funkcje pomocnicze do obsługi postów (`lib/mdx-posts.ts`, `lib/blog.ts`)
7. ✅ Dodaj sitemap dla SEO
8. ✅ Stwórz stronę główną z listą postów

**Zalety tego podejścia:**
- ✅ Wsparcie dla statycznych plików MDX (szybkie, łatwe w utrzymaniu)
- ✅ Możliwość przechowywania postów w bazie danych (dynamiczne, CMS-friendly)
- ✅ Automatyczne podświetlanie składni
- ✅ Optymalizacja obrazów przez Next.js
- ✅ SEO-friendly (metadata, sitemap)
- ✅ TypeScript support

---

## Dodatkowe zasoby

- [Dokumentacja @next/mdx](https://nextjs.org/docs/app/building-your-application/configuring/mdx)
- [Dokumentacja next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [Dokumentacja Next.js App Router](https://nextjs.org/docs/app)

