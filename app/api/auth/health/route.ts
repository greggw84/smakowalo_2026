import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const hasKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  let host = ''
  try {
    host = url ? new URL(url).host.split('.')[0] : ''
  } catch {
    host = 'invalid'
  }
  return NextResponse.json({
    ok: Boolean(url && hasKey),
    host,
    hasKey,
  })
}
