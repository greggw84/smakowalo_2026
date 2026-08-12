import { NextResponse } from 'next/server'
import { sendMagicLink } from '@/app/actions/auth'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Podaj email.' }, { status: 400 })
    }
    const origin = new URL(request.url).origin
    const result = await sendMagicLink(String(email), origin)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Nie udało się wysłać linku. Spróbuj ponownie.' },
      { status: 500 }
    )
  }
}
