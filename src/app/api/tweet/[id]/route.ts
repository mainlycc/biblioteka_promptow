import { getTweet } from "react-tweet/api"
import { enrichTweet } from "react-tweet"
import { NextRequest, NextResponse } from "next/server"
import { translateText } from "@/lib/translate"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tweetId = params.id
    
    if (!tweetId) {
      return NextResponse.json(
        { error: "Tweet ID jest wymagany" },
        { status: 400 }
      )
    }

    // Pobieramy tweet po stronie serwera
    const tweet = await getTweet(tweetId)
    
    if (!tweet) {
      return NextResponse.json(
        { error: "Tweet nie został znaleziony" },
        { status: 404 }
      )
    }

    // Wzbogacamy dane tweeta
    const enrichedTweet = enrichTweet(tweet)
    
    // Pobieramy wszystkie zdjęcia jeśli istnieją
    const allPhotos = enrichedTweet.photos && enrichedTweet.photos.length > 0 
      ? enrichedTweet.photos.map(photo => photo.url)
      : []

    console.log('📸 Pobrane zdjęcia z tweeta:', {
      photosCount: enrichedTweet.photos?.length || 0,
      allPhotos: allPhotos,
      hasVideo: !!enrichedTweet.video
    })

    // Jeśli nie ma zdjęć, sprawdzamy czy jest video poster
    const imageUrl = allPhotos.length > 0 ? allPhotos[0] : (enrichedTweet.video?.poster)

    // Automatyczne tłumaczenie na polski
    const contentPl = await translateText(enrichedTweet.text)

    // Automatyczne generowanie tagów AI
    let aiTags: string[] = []
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const tagsPrompt = `
Przeanalizuj następujący tweet i wygeneruj 4-6 tematycznych tagów w języku polskim.

Treść tweeta: ${enrichedTweet.text}

ZASADY:
- Wygeneruj tylko polskie słowa/frazy jako tagi
- Bez znaku # na początku
- Tagi powinny odzwierciedlać główne tematy i kategorie
- Przykłady dobrych tagów: psychologia, ai, samodyscyplina, biznes, marketing, rozwój osobisty, technologia, kreatywność, produktywność, coaching, nauka, analiza
- Zwróć tylko listę tagów oddzielonych przecinkami
- Maksymalnie 6 tagów
- Używaj pojedynczych słów lub krótkich fraz (max 2 słowa)

Tagi:`;

      const tagsResult = await model.generateContent(tagsPrompt)
      const tagsResponse = await tagsResult.response
      const tagsText = tagsResponse.text()
      
      aiTags = tagsText
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0 && tag.length < 30)
        .slice(0, 6)
    } catch (error) {
      console.warn('Błąd podczas generowania tagów AI:', error)
      // Kontynuuj bez tagów AI
    }

    // Zwracamy dane w formacie zgodnym z naszym interfejsem
    const tweetData = {
      content: enrichedTweet.text,
      content_pl: contentPl,
      image_url: imageUrl,
      images: allPhotos, // Dodajemy wszystkie zdjęcia
      author: `${enrichedTweet.user.name} (@${enrichedTweet.user.screen_name})`,
      author_username: enrichedTweet.user.screen_name,
      author_profile_image: enrichedTweet.user.profile_image_url_https,
      created_at: enrichedTweet.created_at,
      tweet_id: tweetId,
      // Hashtagi z treści tweeta + tagi AI
      hashtags: [
        ...(enrichedTweet.text.match(/#\w+/g) || []).map(tag => tag.slice(1)),
        ...aiTags
      ].filter((tag, index, self) => self.indexOf(tag) === index) // usuń duplikaty
    }

    console.log('📤 Zwracane dane tweeta:', {
      imagesCount: tweetData.images.length,
      images: tweetData.images,
      type: tweetData.images.length > 0 ? 'image' : 'text'
    })

    return NextResponse.json(tweetData)
    
  } catch (error) {
    console.error('Error fetching tweet:', error)
    return NextResponse.json(
      { error: `Błąd podczas pobierania tweeta: ${error instanceof Error ? error.message : 'Nieznany błąd'}` },
      { status: 500 }
    )
  }
}