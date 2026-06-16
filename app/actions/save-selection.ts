'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function saveUserSelection(data: {
  peopleCount: number;
  mealsPerWeek: number;
  dietaryPreferences: string[];
  allergens: string[];
  selectedRecipeIds: string[];
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated' };
  }

  const { error } = await supabase.from('user_selections').insert({
    user_id: user.id,
    people_count: data.peopleCount,
    meals_per_week: data.mealsPerWeek,
    dietary_preferences: data.dietaryPreferences,
    allergens: data.allergens,
    selected_recipe_ids: data.selectedRecipeIds,
    week_label: `Tydzień ${new Date().toISOString().slice(0, 10)}`,
  });

  if (error) {
    console.error('Error saving selection:', error);
    return { error: error.message };
  }

  // Po zapisaniu czyścimy localStorage po stronie klienta (zrobimy to w komponencie)
  return { success: true };
}
