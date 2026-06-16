-- Tabela do zapisywania wyborów użytkownika z kreatora
CREATE TABLE IF NOT EXISTS public.user_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Plan
  people_count INTEGER NOT NULL CHECK (people_count IN (2,4,6)),
  meals_per_week INTEGER NOT NULL CHECK (meals_per_week IN (3,4,5)),

  -- Preferencje i alergie
  dietary_preferences TEXT[] NOT NULL DEFAULT '{}',
  allergens TEXT[] NOT NULL DEFAULT '{}',

  -- Wybrane dania
  selected_recipe_ids TEXT[] NOT NULL DEFAULT '{}',

  -- Metadane
  week_label TEXT,                    -- np. "Tydzień 23 • 2-8 czerwca 2025"
  status TEXT DEFAULT 'pending',      -- pending / confirmed / cancelled
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_user_selections_user_id ON public.user_selections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_selections_created_at ON public.user_selections(created_at DESC);

-- RLS Policies
ALTER TABLE public.user_selections ENABLE ROW LEVEL SECURITY;

-- Użytkownik widzi tylko swoje wybory
CREATE POLICY "Users can view their own selections"
  ON public.user_selections FOR SELECT
  USING (auth.uid() = user_id);

-- Użytkownik może tworzyć swoje wybory
CREATE POLICY "Users can insert their own selections"
  ON public.user_selections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Użytkownik może aktualizować swoje wybory
CREATE POLICY "Users can update their own selections"
  ON public.user_selections FOR UPDATE
  USING (auth.uid() = user_id);

-- Funkcja do automatycznego aktualizowania updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_selections_updated_at
  BEFORE UPDATE ON public.user_selections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
