'use server'

import { createClient } from '@/lib/supabase/server'

function friendlyAuthError(message: string) {
  const raw = message.toLowerCase()
  if (raw.includes('email not confirmed')) {
    return 'Najpierw potwierdź email — sprawdź skrzynkę i folder spam.'
  }
  if (raw.includes('invalid login credentials')) {
    return 'Nieprawidłowy email lub hasło. Jeśli konto jest nowe — potwierdź najpierw maila.'
  }
  if (raw.includes('load failed') || raw.includes('failed to fetch') || raw.includes('network')) {
    return 'Nie udało się połączyć z kontem. Sprawdź internet i spróbuj jeszcze raz.'
  }
  return message
}

export async function loginWithPassword(email: string, password: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: friendlyAuthError(error.message) }
    return { success: true as const }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Nie udało się zalogować.'
    return { error: friendlyAuthError(message) }
  }
}

export async function signUpWithPassword(email: string, password: string, name: string, origin: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/panel`,
        data: { full_name: name },
      },
    })
    if (error) return { error: friendlyAuthError(error.message) }
    return { success: true as const }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Nie udało się założyć konta.'
    return { error: friendlyAuthError(message) }
  }
}

export async function sendMagicLink(email: string, origin: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/panel`,
      },
    })
    if (error) return { error: friendlyAuthError(error.message) }
    return { success: true as const }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Nie udało się wysłać linku.'
    return { error: friendlyAuthError(message) }
  }
}
