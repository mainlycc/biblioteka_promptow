import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST() {
  try {
    // Wymuś odświeżenie cache sitemap
    revalidatePath('/sitemap.xml')
    
    console.log('🔄 Cache sitemap został odświeżony')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache sitemap został odświeżony',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Błąd podczas odświeżania cache sitemap:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Błąd podczas odświeżania cache sitemap',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Użyj POST do odświeżenia cache sitemap',
    endpoint: '/api/revalidate-sitemap'
  })
}

