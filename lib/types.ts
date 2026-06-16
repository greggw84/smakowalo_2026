// ============================================
// SMAKOWAŁO - Typy danych
// ============================================

export type DietaryPreference =
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'keto'
  | 'high-protein'
  | 'low-calorie'
  | 'gluten-free';

export type Allergen =
  | 'orzechy'
  | 'mleko'
  | 'jaja'
  | 'gluten'
  | 'ryby'
  | 'owoce morza'
  | 'seler'
  | 'gorczyca'
  | 'sezam'
  | 'soja'
  | 'łubin'
  | 'sierść'
  | 'dwutlenek siarki';

export interface Nutrition {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber?: number;
  vitaminC?: string;
  iron?: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  difficulty: 'Łatwe' | 'Średnie' | 'Trudne';
  servings: number;
  dietaryTags: DietaryPreference[];
  allergens: Allergen[];
  nutrition: Nutrition;
  ingredients: string[];
  instructions: string[];
}

// Preferencje użytkownika
export interface UserPreferences {
  dietaryPreferences: DietaryPreference[];
  allergens: Allergen[];
  peopleCount: 2 | 4 | 6;
  mealsPerWeek: 3 | 4 | 5;
  deliveryDay: 'tuesday' | 'thursday';
}

// Zapisany wybór użytkownika w bazie
export interface UserSelection {
  id: string;
  user_id: string;
  people_count: number;
  meals_per_week: number;
  dietary_preferences: DietaryPreference[];
  allergens: Allergen[];
  selected_recipe_ids: string[];
  created_at: string;
  week_label?: string;
}
