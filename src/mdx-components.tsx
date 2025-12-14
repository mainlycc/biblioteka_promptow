import { ComponentPropsWithoutRef } from 'react';
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
    <h1 className="text-[36px] leading-tight font-semibold pt-12 mb-4" {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2 className="text-[28px] leading-snug text-gray-800 font-semibold mt-8 mb-3" {...props} />
  ),
  h3: (props: HeadingProps) => (
    <h3 className="text-[24px] leading-snug text-gray-800 font-semibold mt-6 mb-3" {...props} />
  ),
  h4: (props: HeadingProps) => (
    <h4 className="text-[20px] leading-snug text-gray-800 font-semibold mt-5 mb-2" {...props} />
  ),
  h5: (props: HeadingProps) => (
    <h5 className="text-[18px] leading-snug text-gray-800 font-semibold mt-4 mb-2" {...props} />
  ),
  h6: (props: HeadingProps) => (
    <h6 className="text-[16px] leading-snug text-gray-800 font-semibold mt-3 mb-2" {...props} />
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

// Eksportuj funkcję dla komponentów MDX (dla kompatybilności z MDX)
export function useMDXComponents() {
  return components;
}

// Eksportuj bezpośrednio komponenty dla użycia w komponentach serwerowych
export { components };

