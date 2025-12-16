'use client'

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import { components } from '@/mdx-components'

interface MDXContentProps {
  source: MDXRemoteSerializeResult
}

/**
 * Komponent kliencki do renderowania treści MDX.
 * Rozwiązuje problem z wieloma kopiami React poprzez renderowanie
 * w kontekście klienckim zamiast Server Component.
 * 
 * Wymaga zserializowanej zawartości MDX przekazanej z Server Component.
 */
export function MDXContent({ source }: MDXContentProps) {
  return <MDXRemote {...source} components={components} />
}

