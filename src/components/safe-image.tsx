"use client"

import Image, { ImageProps } from "next/image"

/**
 * Wrapper na Next.js Image z obsługą onError (Client Component).
 * Ukrywa obraz jeśli nie uda się go załadować.
 */
export function SafeImage(props: ImageProps) {
  return (
    <Image
      {...props}
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement
        target.style.display = 'none'
      }}
    />
  )
}
