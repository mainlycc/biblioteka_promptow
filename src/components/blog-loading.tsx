import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function BlogLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Skeleton */}
      <div className="mb-8 text-center">
        <Skeleton className="h-8 w-32 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      {/* Blog Posts Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="border-[color:var(--main-orange)]">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              
              <div className="flex items-center justify-between text-xs mb-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Newsletter Skeleton */}
      <Card className="mt-12 border-[color:var(--main-orange)]">
        <CardHeader className="text-center">
          <Skeleton className="h-6 w-32 mx-auto" />
        </CardHeader>
        <CardContent className="text-center">
          <Skeleton className="h-4 w-96 mx-auto mb-4" />
          <Skeleton className="h-10 w-48 mx-auto" />
        </CardContent>
      </Card>
    </div>
  )
}

export function BlogPostLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Navigation Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Article Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        <div className="space-y-3 mb-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
        
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Article Content Skeleton */}
      <article className="prose prose-lg max-w-none">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        
        <div className="mt-8 space-y-4">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        <div className="mt-8 space-y-4">
          <Skeleton className="h-6 w-80" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </article>

      {/* Related Articles Skeleton */}
      <div className="mt-12 pt-8 border-t">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="p-4 border rounded-lg">
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}
