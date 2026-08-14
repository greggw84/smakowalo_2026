'use server';

import { createClient } from '@/lib/supabase/server';
import { persistAccount } from '@/lib/account';

export async function saveUserSelection(
  data: {
    peopleCount: number;
    mealsPerWeek: number;
    dietaryPreferences: string[];
    allergens: string[];
    selectedRecipeIds: string[];
  },
  status: 'pending' | 'confirmed' = 'pending'
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated' };
  }

  const result = await persistAccount(supabase, user, data, status);
  if (!result.success) {
    console.error('Error saving selection:', result.error);
    return { error: result.error || 'Nie udało się zapisać wyboru' };
  }

  return { success: true };
}
