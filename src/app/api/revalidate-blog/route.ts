import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST() {
  try {
    // Wymuś odświeżenie cache strony bloga
    revalidatePath('/blog')
    
    console.log('🔄 Cache strony bloga został odświeżony')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache strony bloga został odświeżony',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Błąd podczas odświeżania cache:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Błąd podczas odświeżania cache',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Użyj POST do odświeżenia cache',
    endpoint: '/api/revalidate-blog'
  })
}
