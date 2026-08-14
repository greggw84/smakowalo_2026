export interface SavedSelection {
  peopleCount: 2 | 4 | 6
  mealsPerWeek: 3 | 4 | 5
  selectedPreferences: string[]
  selectedAllergens: string[]
  selectedRecipeIds: string[]
  timestamp: number
}

const KEY = 'smakowalo_current_selection'

function cookieDomain() {
  if (typeof window === 'undefined') return ''
  return window.location.hostname.endsWith('smakowalo.pl') ? '; Domain=.smakowalo.pl' : ''
}

function readCookie(name: string) {
  if (typeof document === 'undefined') return null
  const parts = document.cookie.split('; ')
  const row = parts.find((p) => p.startsWith(`${name}=`))
  return row ? row.slice(name.length + 1) : null
}

function parseSelection(raw: string): SavedSelection | null {
  for (const candidate of [raw, (() => {
    try {
      return decodeURIComponent(raw)
    } catch {
      return null
    }
  })()]) {
    if (!candidate) continue
    try {
      const parsed = JSON.parse(candidate) as SavedSelection
      if (parsed && Array.isArray(parsed.selectedRecipeIds)) {
        return parsed
      }
    } catch {
      // try next encoding
    }
  }
  return null
}

function safeGet(storage: Storage) {
  try {
    return storage.getItem(KEY)
  } catch {
    return null
  }
}

function safeSet(storage: Storage, value: string) {
  try {
    storage.setItem(KEY, value)
  } catch {
    // private mode / quota — cookie is the fallback
  }
}

function safeRemove(storage: Storage) {
  try {
    storage.removeItem(KEY)
  } catch {
    // ignore
  }
}

export function loadSelection(): SavedSelection | null {
  if (typeof window === 'undefined') return null

  const sources = [safeGet(localStorage), safeGet(sessionStorage), readCookie(KEY)]

  for (const raw of sources) {
    if (!raw) continue
    const parsed = parseSelection(raw)
    if (parsed) return parsed
  }
  return null
}

export function saveSelection(selection: SavedSelection) {
  if (typeof window === 'undefined') return
  const raw = JSON.stringify(selection)
  safeSet(localStorage, raw)
  safeSet(sessionStorage, raw)
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${KEY}=${encodeURIComponent(raw)}; Path=/; Max-Age=604800; SameSite=Lax${secure}${cookieDomain()}`
}

export function clearSelection() {
  if (typeof window === 'undefined') return
  safeRemove(localStorage)
  safeRemove(sessionStorage)
  document.cookie = `${KEY}=; Path=/; Max-Age=0${cookieDomain()}`
}
