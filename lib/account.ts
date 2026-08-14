import { sampleRecipes } from '@/lib/data/recipes'
import type { SavedSelection } from '@/lib/selection-storage'

export type AccountStatus =
  | 'pending'
  | 'confirmed'
  | 'paused'
  | 'cancelled'
  | 'skipped'
  | 'active'
  | string

export interface AccountSelection {
  id: string
  source: 'selection' | 'order' | 'subscription' | 'local'
  people_count: number
  meals_per_week: number
  dietary_preferences: string[]
  allergens: string[]
  selected_recipe_ids: string[]
  dish_names: string[]
  week_label: string | null
  status: AccountStatus
  payment_status?: string | null
  order_number?: string | null
  created_at: string
}

type AnyClient = {
  from: (table: string) => any
}

export function firstBoxPrice(people: number) {
  if (people === 2) return 119
  if (people === 4) return 229
  return 319
}

export function recipeTitle(id: string) {
  return sampleRecipes.find((r) => r.id === id)?.title || id
}

export function isMissingRelation(error: { code?: string; message?: string } | null) {
  if (!error) return false
  const msg = `${error.code || ''} ${error.message || ''}`.toLowerCase()
  return (
    error.code === '42P01' ||
    error.code === 'PGRST205' ||
    msg.includes('does not exist') ||
    msg.includes('schema cache')
  )
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean)
    } catch {
      return value.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
}

function num(value: unknown, fallback: number) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function planFromUnknown(raw: unknown): {
  people_count: number
  meals_per_week: number
  dietary_preferences: string[]
  allergens: string[]
  selected_recipe_ids: string[]
  dish_names: string[]
} {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const selected = asStringArray(
    obj.selected_recipe_ids || obj.selectedRecipeIds || obj.selected_meals || obj.meals
  )
  const looksLikeIds = selected.every((s) => s.startsWith('rec_') || /^[0-9]+$/.test(s))
  return {
    people_count: num(obj.people_count ?? obj.peopleCount ?? obj.people ?? obj.number_of_people, 2),
    meals_per_week: num(
      obj.meals_per_week ?? obj.mealsPerWeek ?? obj.days ?? obj.number_of_days,
      selected.length || 3
    ),
    dietary_preferences: asStringArray(
      obj.dietary_preferences ?? obj.selectedPreferences ?? obj.diets ?? obj.selected_diets
    ),
    allergens: asStringArray(obj.allergens ?? obj.selectedAllergens ?? obj.allergies ?? obj.selected_allergies),
    selected_recipe_ids: looksLikeIds ? selected : [],
    dish_names: looksLikeIds ? selected.map(recipeTitle) : selected,
  }
}

function parseMaybeJson(value: unknown) {
  if (!value) return null
  if (typeof value === 'object') return value
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  }
  return null
}

export function weekLabelForToday() {
  return `Tydzień ${new Date().toISOString().slice(0, 10)}`
}

export function toSavedSelection(row: AccountSelection): SavedSelection {
  return {
    peopleCount: (row.people_count === 4 || row.people_count === 6 ? row.people_count : 2) as 2 | 4 | 6,
    mealsPerWeek: (row.meals_per_week === 4 || row.meals_per_week === 5 ? row.meals_per_week : 3) as 3 | 4 | 5,
    selectedPreferences: row.dietary_preferences,
    selectedAllergens: row.allergens,
    selectedRecipeIds: row.selected_recipe_ids,
    timestamp: Date.parse(row.created_at) || Date.now(),
  }
}

function mapSelectionRow(row: Record<string, any>): AccountSelection {
  const ids = asStringArray(row.selected_recipe_ids)
  return {
    id: String(row.id),
    source: 'selection',
    people_count: num(row.people_count, 2),
    meals_per_week: num(row.meals_per_week, ids.length || 3),
    dietary_preferences: asStringArray(row.dietary_preferences),
    allergens: asStringArray(row.allergens),
    selected_recipe_ids: ids,
    dish_names: ids.map(recipeTitle),
    week_label: row.week_label || null,
    status: row.status || 'pending',
    created_at: row.created_at,
  }
}

function mapOrderRow(row: Record<string, any>, items: Record<string, any>[]): AccountSelection {
  const embedded = parseMaybeJson(row.order_items)
  const notes = parseMaybeJson(row.notes)
  const firstItem = items[0] || {}
  const fromItem = planFromUnknown(firstItem.meal_plan_details || firstItem)
  const fromNotes = planFromUnknown(notes)
  const fromEmbedded = Array.isArray(embedded) ? planFromUnknown(embedded[0]) : planFromUnknown(embedded)

  const dishFromItems = items.flatMap((item) => {
    const meals = asStringArray(item.selected_meals)
    if (meals.length) return meals
    return item.product_name ? [String(item.product_name)] : []
  })

  const plan = {
    people_count: fromNotes.people_count || fromItem.people_count || fromEmbedded.people_count,
    meals_per_week: fromNotes.meals_per_week || fromItem.meals_per_week || fromEmbedded.meals_per_week,
    dietary_preferences:
      fromNotes.dietary_preferences.length
        ? fromNotes.dietary_preferences
        : fromItem.dietary_preferences.length
          ? fromItem.dietary_preferences
          : asStringArray(firstItem.dietary_preferences),
    allergens: fromNotes.allergens.length ? fromNotes.allergens : fromItem.allergens,
    selected_recipe_ids:
      fromNotes.selected_recipe_ids.length
        ? fromNotes.selected_recipe_ids
        : fromItem.selected_recipe_ids.length
          ? fromItem.selected_recipe_ids
          : fromEmbedded.selected_recipe_ids,
    dish_names: fromNotes.dish_names.length
      ? fromNotes.dish_names
      : fromItem.dish_names.length
        ? fromItem.dish_names
        : dishFromItems,
  }

  if (!plan.dish_names.length && plan.selected_recipe_ids.length) {
    plan.dish_names = plan.selected_recipe_ids.map(recipeTitle)
  }

  const payment = row.payment_status || null
  let status = row.status || 'pending'
  if (payment === 'pending' && status === 'confirmed') status = 'pending'

  return {
    id: `order-${row.id}`,
    source: 'order',
    people_count: plan.people_count,
    meals_per_week: plan.meals_per_week,
    dietary_preferences: plan.dietary_preferences,
    allergens: plan.allergens,
    selected_recipe_ids: plan.selected_recipe_ids,
    dish_names: plan.dish_names,
    week_label: row.order_number || (row.delivery_date ? `Dostawa ${row.delivery_date}` : null),
    status,
    payment_status: payment,
    order_number: row.order_number || null,
    created_at: row.created_at,
  }
}

function mapSubscriptionRow(row: Record<string, any>): AccountSelection {
  const plan = planFromUnknown({
    ...((parseMaybeJson(row.meal_plan_config) as Record<string, unknown>) || {}),
    people: row.people,
    days: row.days,
    diets: row.diets,
    allergies: row.allergies,
    selected_meals: row.selected_meals,
  })
  return {
    id: `sub-${row.id}`,
    source: 'subscription',
    people_count: plan.people_count,
    meals_per_week: plan.meals_per_week,
    dietary_preferences: plan.dietary_preferences,
    allergens: plan.allergens,
    selected_recipe_ids: plan.selected_recipe_ids,
    dish_names: plan.dish_names.length ? plan.dish_names : plan.selected_recipe_ids.map(recipeTitle),
    week_label: row.next_delivery_date ? `Subskrypcja • ${row.next_delivery_date}` : 'Subskrypcja',
    status: row.status || 'active',
    created_at: row.created_at,
  }
}

export function mergeAccountRows(rows: AccountSelection[]): AccountSelection[] {
  const seen = new Set<string>()
  const out: AccountSelection[] = []
  const sorted = [...rows].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  for (const row of sorted) {
    const key = [
      row.source === 'local' ? 'local' : 'db',
      row.people_count,
      row.meals_per_week,
      [...row.selected_recipe_ids].sort().join(','),
      (row.week_label || '').slice(0, 18),
      row.created_at.slice(0, 10),
    ].join('|')
    if (seen.has(key)) continue
    seen.add(key)
    out.push(row)
  }
  return out
}

export async function loadAccountHistory(
  supabase: AnyClient,
  user: { id: string; email?: string | null }
): Promise<AccountSelection[]> {
  const rows: AccountSelection[] = []

  const { data: selections, error: selErr } = await supabase
    .from('user_selections')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (!selErr && selections) {
    rows.push(...(selections as Record<string, any>[]).map(mapSelectionRow))
  }

  const { data: orders, error: orderErr } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const orderRows = !orderErr && orders ? (orders as Record<string, any>[]) : []
  const orderIds = orderRows.map((o) => o.id).filter((id) => id != null)
  let itemsByOrder = new Map<number, Record<string, any>[]>()

  if (orderIds.length) {
    const { data: items, error: itemErr } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds)
    if (!itemErr && items) {
      itemsByOrder = new Map<number, Record<string, any>[]>()
      for (const item of items as Record<string, any>[]) {
        const list = itemsByOrder.get(item.order_id) || []
        list.push(item)
        itemsByOrder.set(item.order_id, list)
      }
    }
  }

  for (const order of orderRows) {
    rows.push(mapOrderRow(order, itemsByOrder.get(order.id) || []))
  }

  const { data: subs, error: subErr } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (!subErr && subs) {
    rows.push(...(subs as Record<string, any>[]).map(mapSubscriptionRow))
  }

  return mergeAccountRows(rows)
}

export async function persistAccount(
  supabase: AnyClient,
  user: { id: string; email?: string | null; user_metadata?: Record<string, any> },
  selection: {
    peopleCount: number
    mealsPerWeek: number
    dietaryPreferences: string[]
    allergens: string[]
    selectedRecipeIds: string[]
  },
  status: 'pending' | 'confirmed' = 'pending'
): Promise<{ success: boolean; error?: string }> {
  const week_label = weekLabelForToday()
  const dish_names = selection.selectedRecipeIds.map(recipeTitle)
  const planPayload = {
    people_count: selection.peopleCount,
    meals_per_week: selection.mealsPerWeek,
    dietary_preferences: selection.dietaryPreferences,
    allergens: selection.allergens,
    selected_recipe_ids: selection.selectedRecipeIds,
    dish_names,
    week_label,
  }
  const errors: string[] = []

  const selectionRow = {
    user_id: user.id,
    people_count: selection.peopleCount,
    meals_per_week: selection.mealsPerWeek,
    dietary_preferences: selection.dietaryPreferences,
    allergens: selection.allergens,
    selected_recipe_ids: selection.selectedRecipeIds,
    week_label,
    status,
  }

  const { data: existingSel } = await supabase
    .from('user_selections')
    .select('id,status')
    .eq('user_id', user.id)
    .eq('week_label', week_label)
    .order('created_at', { ascending: false })
    .limit(1)

  let selectionOk = false
  if (existingSel?.[0]?.id) {
    const { error } = await supabase
      .from('user_selections')
      .update({ ...selectionRow, status: status === 'confirmed' ? 'confirmed' : existingSel[0].status === 'confirmed' ? 'confirmed' : status })
      .eq('id', existingSel[0].id)
      .eq('user_id', user.id)
    selectionOk = !error
    if (error && !isMissingRelation(error)) errors.push(error.message)
  } else {
    const { error } = await supabase.from('user_selections').insert(selectionRow)
    selectionOk = !error
    if (error && !isMissingRelation(error)) errors.push(error.message)
  }

  const box = firstBoxPrice(selection.peopleCount)
  const delivery = 19
  const total = box + delivery
  const customerName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    (user.email ? user.email.split('@')[0] : 'Klient')

  const orderAttempts = [
    {
      user_id: user.id,
      order_number: `SMK-${Date.now()}`,
      status: status === 'confirmed' ? 'confirmed' : 'pending',
      total_amount: total,
      subtotal: box,
      currency: 'PLN',
      payment_status: status === 'confirmed' ? 'paid' : 'pending',
      payment_method: status === 'confirmed' ? 'manual' : null,
      delivery_address: {
        name: customerName,
        street: '',
        city: '',
        postal_code: '',
        phone: '',
      },
      notes: JSON.stringify(planPayload),
    },
    {
      user_id: user.id,
      status: status === 'confirmed' ? 'confirmed' : 'pending',
      total_amount: total,
      currency: 'PLN',
      payment_status: status === 'confirmed' ? 'paid' : 'pending',
      notes: JSON.stringify(planPayload),
    },
  ]

  let orderId: number | null = null
  let orderOk = false

  const { data: existingOrders } = await supabase
    .from('orders')
    .select('id,status,payment_status,notes,created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(8)

  const existingOrder = (existingOrders as Record<string, any>[] | null)?.find((row) => {
    const notes = parseMaybeJson(row.notes) as Record<string, unknown> | null
    const ids = asStringArray(notes?.selected_recipe_ids)
    return (
      row.created_at?.slice(0, 10) === new Date().toISOString().slice(0, 10) &&
      ids.join(',') === selection.selectedRecipeIds.join(',')
    )
  })

  if (existingOrder?.id) {
    const { error } = await supabase
      .from('orders')
      .update({
        status: status === 'confirmed' ? 'confirmed' : existingOrder.status,
        payment_status: status === 'confirmed' ? 'paid' : existingOrder.payment_status,
        notes: JSON.stringify(planPayload),
      })
      .eq('id', existingOrder.id)
    if (!error) {
      orderOk = true
      orderId = existingOrder.id
    } else if (!isMissingRelation(error)) {
      errors.push(error.message)
    }
  } else {
    for (const payload of orderAttempts) {
      const { data, error } = await supabase.from('orders').insert(payload).select('id').single()
      if (!error && data?.id) {
        orderOk = true
        orderId = data.id
        break
      }
      if (error && !isMissingRelation(error) && !/column|null value|schema cache|could not find/i.test(error.message)) {
        errors.push(error.message)
        break
      }
    }
  }

  if (orderId) {
    const itemAttempts = [
      {
        order_id: orderId,
        quantity: 1,
        unit_price: box,
        total_price: box,
        selected_meals: dish_names,
      },
      {
        order_id: orderId,
        quantity: 1,
        selected_meals: dish_names,
      },
    ]
    for (const item of itemAttempts) {
      const { error } = await supabase.from('order_items').insert(item)
      if (!error || isMissingRelation(error)) break
      if (!/column|null value|schema cache|duplicate|already exists/i.test(error.message)) {
        errors.push(error.message)
        break
      }
    }
  }

  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  if (existingSub?.[0]?.id) {
    await supabase
      .from('subscriptions')
      .update({
        status: status === 'confirmed' ? 'active' : 'incomplete',
        people: selection.peopleCount,
        days: selection.mealsPerWeek,
        meal_plan_config: planPayload,
        diets: selection.dietaryPreferences,
        allergies: selection.allergens,
        selected_meals: dish_names,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingSub[0].id)
  }

  if (selectionOk || orderOk) return { success: true }
  return { success: false, error: errors[0] || 'Nie udało się zapisać zamówienia w bazie.' }
}

export function statusLabel(row: AccountSelection) {
  if (row.status === 'skipped') return 'Pominięty tydzień'
  if (row.status === 'paused') return 'Wstrzymane'
  if (row.status === 'cancelled') return 'Anulowane'
  if (row.payment_status === 'pending' || row.status === 'pending') return 'Do opłacenia'
  if (row.payment_status === 'paid' || row.status === 'confirmed') return 'Potwierdzone'
  if (row.status === 'delivered') return 'Dostarczone'
  if (row.status === 'shipped' || row.status === 'preparing') return 'W realizacji'
  if (row.status === 'active' || row.status === 'incomplete') return 'Profil subskrypcji'
  return row.status || 'Zapisane'
}
