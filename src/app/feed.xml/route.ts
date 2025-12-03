import { supabase } from '@/lib/supabase'

export async function GET() {
  const baseUrl = 'https://bibliotekapromptow.pl'
  
  try {
    // Pobierz opublikowane posty blogowe
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(50) // Ostatnie 50 postów

    if (error) {
      console.error('Błąd podczas pobierania postów dla RSS:', error)
      return new Response('Error fetching posts', { status: 500 })
    }

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Biblioteka Promptów - Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Najnowsze artykuły o prompt engineering, AI i sztucznej inteligencji. Porady, tutoriale i najlepsze praktyki.</description>
    <language>pl-PL</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Biblioteka Promptów</title>
      <link>${baseUrl}</link>
    </image>
${posts?.map(post => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <dc:creator><![CDATA[${post.author}]]></dc:creator>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      <category><![CDATA[${post.category}]]></category>
${post.tags?.map((tag: string) => `      <category><![CDATA[${tag}]]></category>`).join('\n') || ''}
    </item>`).join('\n') || ''}
  </channel>
</rss>`

    return new Response(rssFeed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    console.error('Błąd podczas generowania RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}


