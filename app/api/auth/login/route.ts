import { NextResponse } from 'next/server'
import { loginWithPassword } from '@/app/actions/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Podaj email i hasło.' }, { status: 400 })
    }
    const result = await loginWithPassword(String(email), String(password))
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Nie udało się połączyć z kontem. Spróbuj ponownie.' },
      { status: 500 }
    )
  }
}
