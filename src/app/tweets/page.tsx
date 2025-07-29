import { TweetCard } from "@/components/tweet-card"

export default function GraficznePromptyPage() {
  return (
    <main className="flex-1 p-8 pt-4">
      <h1 className="text-2xl font-bold mb-4">Prompty graficzne</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tutaj możesz dodać przykładowe tweety */}
        <TweetCard id="1934631664153760241" />
        <TweetCard id="1934928080268636638" />
        <TweetCard id="1934700085369294915" />
        <TweetCard id="1934528170264572227" />
      </div>
    </main>
  )
} 