import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/panel'
  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next.startsWith('/') ? next : '/panel'}`)
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as 'signup' | 'email' | 'magiclink' | 'recovery' | 'invite',
      token_hash: tokenHash,
    })
    if (!error) {
      return NextResponse.redirect(`${origin}${next.startsWith('/') ? next : '/panel'}`)
    }
  }

  return NextResponse.redirect(`${origin}/logowanie?error=auth`)
}
