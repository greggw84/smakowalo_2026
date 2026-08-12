import { NextResponse } from 'next/server'
import { signUpWithPassword } from '@/app/actions/auth'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Podaj email i hasło.' }, { status: 400 })
    }
    const origin = new URL(request.url).origin
    const result = await signUpWithPassword(String(email), String(password), String(name || ''), origin)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Nie udało się założyć konta. Spróbuj ponownie.' },
      { status: 500 }
    )
  }
}
