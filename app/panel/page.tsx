'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import { User } from '@supabase/supabase-js';
import { dietaryOptions, allAllergens } from '@/lib/data/recipes';
import { DietaryPreference, Allergen } from '@/lib/types';
import { toast } from 'sonner';
import { AlertTriangle, Pause, Play, Repeat, CalendarX, Save, Plus } from 'lucide-react';

interface Selection {
  id: string;
  people_count: number;
  meals_per_week: number;
  dietary_preferences: string[];
  allergens: string[];
  selected_recipe_ids: string[];
  week_label: string | null;
  status: string;
  created_at: string;
  updated_at?: string;
}

export default function PanelKlienta() {
  const [user, setUser] = useState<User | null>(null);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  // Current profile = latest selection (acts as live subscription profile)
  const currentProfile = selections.length > 0 ? selections[0] : null;

  // Editable state for preferences & plan (synced from currentProfile)
  const [editPeople, setEditPeople] = useState<2 | 4 | 6>(2);
  const [editMeals, setEditMeals] = useState<3 | 4 | 5>(3);
  const [editPrefs, setEditPrefs] = useState<DietaryPreference[]>(['none']);
  const [editAllergens, setEditAllergens] = useState<Allergen[]>([]);

  // Sync edit state when selections load
  useEffect(() => {
    if (currentProfile) {
      setEditPeople(currentProfile.people_count as 2 | 4 | 6);
      setEditMeals(currentProfile.meals_per_week as 3 | 4 | 5);
      setEditPrefs((currentProfile.dietary_preferences?.length ? currentProfile.dietary_preferences : ['none']) as DietaryPreference[]);
      setEditAllergens((currentProfile.allergens || []) as Allergen[]);
    }
  }, [currentProfile?.id]); // re-sync when new latest profile

  const isPaused = currentProfile?.status === 'paused';
  const isCancelled = currentProfile?.status === 'cancelled';

  // Load data
  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data, error } = await supabase
        .from('user_selections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSelections(data as Selection[]);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // ===== EDIT PREFERENCES / PLAN =====
  const togglePref = (pref: DietaryPreference) => {
    if (pref === 'none') {
      setEditPrefs(['none']);
    } else {
      setEditPrefs(prev => {
        const withoutNone = prev.filter(p => p !== 'none');
        if (withoutNone.includes(pref)) {
          const filtered = withoutNone.filter(p => p !== pref);
          return filtered.length === 0 ? ['none'] : filtered;
        } else {
          return [...withoutNone, pref];
        }
      });
    }
  };

  const toggleAllergen = (allergen: Allergen) => {
    setEditAllergens(prev =>
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  const saveProfileChanges = async () => {
    if (!currentProfile || !user) return;
    setSaving(true);

    const { error } = await supabase
      .from('user_selections')
      .update({
        people_count: editPeople,
        meals_per_week: editMeals,
        dietary_preferences: editPrefs,
        allergens: editAllergens,
      })
      .eq('id', currentProfile.id)
      .eq('user_id', user.id);

    if (error) {
      toast.error('Nie udało się zapisać zmian: ' + error.message);
    } else {
      toast.success('Preferencje i plan zostały zaktualizowane. Będą używane w przyszłych boxach.');
      await loadData();
    }
    setSaving(false);
  };

  // ===== SUBSCRIPTION MANAGEMENT (pause / resume / cancel) =====
  const updateSubscriptionStatus = async (newStatus: string, successMsg: string) => {
    if (!currentProfile || !user) {
      toast.error('Brak aktywnego profilu subskrypcji. Zrób pierwszy wybór w kreatorze.');
      return;
    }
    setSaving(true);

    const { error } = await supabase
      .from('user_selections')
      .update({ status: newStatus })
      .eq('id', currentProfile.id)
      .eq('user_id', user.id);

    if (error) {
      toast.error('Błąd: ' + error.message);
    } else {
      toast.success(successMsg);
      await loadData();
    }
    setSaving(false);
  };

  const pauseSubscription = () => updateSubscriptionStatus('paused', 'Subskrypcja wstrzymana. Nie będziesz otrzymywać kolejnych boxów.');
  const resumeSubscription = () => updateSubscriptionStatus('active', 'Subskrypcja wznowiona. Kolejne dostawy według Twojego profilu.');
  const cancelSubscription = () => {
    if (!confirm('Na pewno chcesz całkowicie anulować subskrypcję?')) return;
    updateSubscriptionStatus('cancelled', 'Subskrypcja anulowana. Dziękujemy za bycie z nami.');
  };

  // ===== POMIJANIE TYGODNI (Skip weeks) =====
  function getUpcomingDeliveries(count = 4): { label: string; date: Date }[] {
    const upcoming: { label: string; date: Date }[] = [];
    let d = new Date();
    while (upcoming.length < count) {
      d = new Date(d.getTime() + 24 * 60 * 60 * 1000);
      const day = d.getDay(); // 2=Tue, 4=Thu
      if (day === 2 || day === 4) {
        const weekday = day === 2 ? 'Wtorek' : 'Czwartek';
        const dateStr = d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
        upcoming.push({
          label: `${weekday}, ${dateStr}`,
          date: d,
        });
      }
    }
    return upcoming;
  }

  const upcoming = getUpcomingDeliveries(4);

  // Map existing week_labels for quick lookup
  const weekMap = new Map<string, Selection>();
  selections.forEach(s => {
    if (s.week_label) weekMap.set(s.week_label, s);
  });

  const skipWeek = async (label: string) => {
    if (!currentProfile || !user) {
      toast.error('Najpierw ustaw swój profil w kreatorze.');
      return;
    }
    if (weekMap.has(label)) {
      toast.info('Ten tydzień jest już oznaczony lub zamówiony.');
      return;
    }
    setSaving(true);

    const { error } = await supabase.from('user_selections').insert({
      user_id: user.id,
      people_count: currentProfile.people_count,
      meals_per_week: currentProfile.meals_per_week,
      dietary_preferences: currentProfile.dietary_preferences,
      allergens: currentProfile.allergens,
      selected_recipe_ids: [],
      week_label: label,
      status: 'skipped',
    });

    if (error) {
      toast.error('Nie udało się pominąć tygodnia: ' + error.message);
    } else {
      toast.success(`Pominięto: ${label}. Nie przyjdzie dostawa.`);
      await loadData();
    }
    setSaving(false);
  };

  // ===== ZAMÓWIENIA / POWTÓRKI (Re-order + create this week) =====
  const createOrderThisWeek = async (source?: Selection) => {
    if (!user) return;
    const base = source || currentProfile;
    if (!base) {
      toast.error('Brak profilu do zamówienia. Idź do kreatora.');
      return;
    }
    setSaving(true);

    const weekLabel = `Tydzień ${new Date().toISOString().slice(0, 10)}`;

    const { error } = await supabase.from('user_selections').insert({
      user_id: user.id,
      people_count: base.people_count,
      meals_per_week: base.meals_per_week,
      dietary_preferences: base.dietary_preferences,
      allergens: base.allergens,
      selected_recipe_ids: source ? base.selected_recipe_ids : [], // if reordering, copy recipes; else empty (user will choose)
      week_label: weekLabel,
      status: 'pending',
    });

    if (error) {
      toast.error('Błąd przy tworzeniu zamówienia: ' + error.message);
    } else {
      toast.success('Zamówienie na ten tydzień utworzone! Przejdź do menu lub podsumowania jeśli chcesz doprecyzować dania.');
      await loadData();
    }
    setSaving(false);
  };

  const repeatBox = (sel: Selection) => {
    createOrderThisWeek(sel);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0]">
        <p>Ładowanie panelu...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0]">
        <div className="text-center">
          <p className="mb-4">Nie jesteś zalogowany.</p>
          <Link href="/logowanie" className="text-[#15803d] underline">Zaloguj się</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><Logo width={100} height={26} /></Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#6b7280]">{user.email}</span>
            <button onClick={handleLogout} className="px-4 py-1.5 rounded-xl border border-[#e8dcc8] hover:bg-white">Wyloguj</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-[#14532d]">
              Witaj{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-[#4b5563] mt-1">Zarządzaj swoim boxem, preferencjami i subskrypcją.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Link href="/wybierz-menu" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#15803d] text-white rounded-2xl text-sm font-medium hover:bg-[#166534]">
              <Plus className="w-4 h-4" /> Nowy box w kreatorze
            </Link>
            <Link href="/menu" className="inline-flex items-center px-5 py-2.5 border border-[#15803d] text-[#15803d] rounded-2xl text-sm hover:bg-[#f1e9df]">
              Menu tygodnia
            </Link>
          </div>
        </div>

        {/* Subscription status banner */}
        {currentProfile && (isPaused || isCancelled) && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-3xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            <div>
              {isPaused && 'Twoja subskrypcja jest obecnie wstrzymana.'}
              {isCancelled && 'Subskrypcja została anulowana.'}
              {' '}Możesz wznowić w każdej chwili.
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-6">
          {/* AKTUALNY PROFIL + EDYCJA PREFERENCJI */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e8dcc8] p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-xl text-[#14532d]">Twoje aktualne ustawienia</h2>
                <p className="text-sm text-[#6b7280]">To jest Twój profil — będzie używany przy kolejnych boxach i ostrzeżeniach alergenowych.</p>
              </div>
              {currentProfile && (
                <div className="text-xs px-3 py-1 rounded-full bg-[#f1e9df] text-[#14532d]">
                  {currentProfile.people_count} os. • {currentProfile.meals_per_week} dań
                </div>
              )}
            </div>

            {!currentProfile ? (
              <div className="py-8 text-center text-[#6b7280]">
                Nie masz jeszcze profilu. <Link href="/wybierz-menu" className="text-[#15803d] underline">Zrób pierwszy wybór</Link>, żeby aktywować subskrypcję.
              </div>
            ) : (
              <>
                {/* Plan size quick edit */}
                <div className="mb-5">
                  <div className="text-sm font-medium text-[#374151] mb-2">Rozmiar boxa</div>
                  <div className="flex gap-2">
                    {[2,4,6].map(n => (
                      <button key={n} onClick={() => setEditPeople(n as any)}
                        className={`flex-1 py-2.5 rounded-2xl border text-sm font-medium transition ${editPeople === n ? 'bg-[#15803d] text-white border-[#15803d]' : 'border-[#e8dcc8] hover:border-[#15803d]'}`}>
                        {n} osoby
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[3,4,5].map(n => (
                      <button key={n} onClick={() => setEditMeals(n as any)}
                        className={`flex-1 py-2 rounded-2xl border text-sm transition ${editMeals === n ? 'bg-[#15803d] text-white border-[#15803d]' : 'border-[#e8dcc8]'}`}>
                        {n} dań / tydzień
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferencje */}
                <div className="mb-5">
                  <div className="text-sm font-medium text-[#374151] mb-2">Preferencje dietetyczne</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {dietaryOptions.map(opt => (
                      <button key={opt.value} onClick={() => togglePref(opt.value)}
                        className={`p-3 text-sm rounded-2xl border text-left transition ${editPrefs.includes(opt.value) ? 'border-[#15803d] bg-[#f1e9df] text-[#14532d]' : 'border-[#e8dcc8]'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alergeny */}
                <div className="mb-5">
                  <div className="text-sm font-medium text-[#374151] mb-2">Alergeny / nietolerancje (będziemy ostrzegać)</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allAllergens.map(item => (
                      <button key={item.value} onClick={() => toggleAllergen(item.value)}
                        className={`p-3 text-sm rounded-2xl border text-left flex items-center gap-2 transition ${editAllergens.includes(item.value) ? 'border-red-500 bg-red-50 text-red-700' : 'border-[#e8dcc8]'}`}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                  {editAllergens.length > 0 && (
                    <div className="mt-2 text-xs text-red-600">Zaznaczone: {editAllergens.join(', ')}</div>
                  )}
                </div>

                <button
                  onClick={saveProfileChanges}
                  disabled={saving}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-[#15803d] hover:bg-[#166534] disabled:bg-gray-300 text-white font-medium py-3 rounded-2xl"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Zapisywanie...' : 'Zapisz zmiany w profilu'}
                </button>
                <p className="text-[11px] text-[#6b7280] mt-2 text-center">Zmiany zapiszą się na Twoim koncie i będą obowiązywać przy kolejnych zamówieniach.</p>
              </>
            )}
          </div>

          {/* ZARZĄDZANIE SUBSKRYPCJĄ + SZYBKIE AKCJE */}
          <div className="lg:col-span-5 space-y-6">
            {/* Status + Pause/Resume/Cancel */}
            <div className="bg-white rounded-3xl border border-[#e8dcc8] p-6">
              <h3 className="font-semibold text-lg mb-4 text-[#14532d]">Zarządzanie subskrypcją</h3>

              <div className="mb-4 text-sm">
                Status: <span className={`font-medium ${isPaused ? 'text-amber-600' : isCancelled ? 'text-red-600' : 'text-[#15803d]'}`}>
                  {currentProfile ? (isPaused ? 'Wstrzymana' : isCancelled ? 'Anulowana' : 'Aktywna') : 'Brak profilu'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {!isPaused && !isCancelled && currentProfile && (
                  <button onClick={pauseSubscription} disabled={saving} className="flex items-center justify-center gap-2 py-3 border border-[#e8dcc8] rounded-2xl hover:bg-[#f8f5f0] text-sm">
                    <Pause className="w-4 h-4" /> Wstrzymaj subskrypcję (pomiń wszystkie kolejne)
                  </button>
                )}
                {(isPaused || isCancelled) && currentProfile && (
                  <button onClick={resumeSubscription} disabled={saving} className="flex items-center justify-center gap-2 py-3 bg-[#15803d] text-white rounded-2xl text-sm">
                    <Play className="w-4 h-4" /> Wznów subskrypcję
                  </button>
                )}
                {currentProfile && !isCancelled && (
                  <button onClick={cancelSubscription} disabled={saving} className="flex items-center justify-center gap-2 py-3 border border-red-200 text-red-600 rounded-2xl hover:bg-red-50 text-sm">
                    Anuluj subskrypcję całkowicie
                  </button>
                )}
              </div>

              <div className="mt-4 text-[11px] text-[#6b7280]">
                Pauza i pomijanie tygodni są darmowe i bezkarne. Wznawiaj kiedy chcesz.
              </div>
            </div>

            {/* Quick create this week */}
            <div className="bg-white rounded-3xl border border-[#e8dcc8] p-6">
              <h3 className="font-semibold mb-3">Szybkie zamówienie</h3>
              <button
                onClick={() => createOrderThisWeek()}
                disabled={saving || !currentProfile}
                className="w-full py-3 bg-[#14532d] text-white rounded-2xl text-sm font-medium disabled:bg-gray-300"
              >
                Zamów box na ten tydzień z aktualnego profilu
              </button>
              <p className="text-xs text-[#6b7280] mt-2">Użyje Twoich preferencji i alergii. Dania możesz doprecyzować później.</p>
            </div>
          </div>
        </div>

        {/* POMIJANIE TYGODNI — pełna sekcja */}
        <div className="mt-6 bg-white rounded-3xl border border-[#e8dcc8] p-7">
          <div className="flex items-center gap-2 mb-4">
            <CalendarX className="w-5 h-5 text-[#15803d]" />
            <h2 className="font-semibold text-xl text-[#14532d]">Pomijanie tygodni</h2>
          </div>
          <p className="text-sm text-[#4b5563] mb-4">Wybierz konkretne tygodnie, w których nie chcesz dostawy. Zero stresu.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcoming.map((u, idx) => {
              const existing = weekMap.get(u.label);
              const isSkipped = existing?.status === 'skipped';
              const hasOrder = existing && existing.status !== 'skipped' && existing.selected_recipe_ids?.length > 0;

              return (
                <div key={idx} className="border border-[#e8dcc8] rounded-2xl p-4">
                  <div className="font-medium text-sm mb-1">{u.label}</div>
                  {isSkipped && <div className="text-xs text-amber-600 mb-2">Pominięty</div>}
                  {hasOrder && <div className="text-xs text-[#15803d] mb-2">Zamówiony</div>}
                  {!isSkipped && !hasOrder && <div className="text-xs text-[#6b7280] mb-2">Zaplanowany</div>}

                  {!isSkipped && !hasOrder && (
                    <button
                      onClick={() => skipWeek(u.label)}
                      disabled={saving}
                      className="w-full text-xs py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Pomiń ten tydzień
                    </button>
                  )}
                  {isSkipped && (
                    <div className="text-[11px] text-[#6b7280]">Dostawa nie przyjdzie.</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* HISTORIA + POWTÓRKI */}
        <div className="mt-6 bg-white rounded-3xl border border-[#e8dcc8] p-7">
          <h3 className="font-semibold text-lg mb-4 text-[#14532d]">Historia i powtórki</h3>

          {selections.length === 0 ? (
            <div className="text-center py-6 text-[#6b7280]">Brak historii. Zacznij od kreatora.</div>
          ) : (
            <div className="space-y-3">
              {selections.map((sel) => {
                const isSkip = sel.status === 'skipped';
                return (
                  <div key={sel.id} className={`border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${isSkip ? 'border-amber-200 bg-amber-50/40' : 'border-[#e8dcc8]'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">
                        {sel.people_count} osoby • {sel.meals_per_week} dań
                        {sel.week_label && ` • ${sel.week_label}`}
                      </div>
                      <div className="text-xs text-[#6b7280] mt-0.5">
                        {new Date(sel.created_at).toLocaleDateString('pl-PL')} 
                        {sel.selected_recipe_ids?.length > 0 && ` • ${sel.selected_recipe_ids.length} dań`}
                        {sel.allergens?.length > 0 && ` • Alergeny: ${sel.allergens.join(', ')}`}
                      </div>
                      {isSkip && <div className="text-xs text-amber-600 mt-1">Pominięty tydzień</div>}
                    </div>

                    <div className="flex gap-2">
                      {!isSkip && sel.selected_recipe_ids?.length > 0 && (
                        <button
                          onClick={() => repeatBox(sel)}
                          disabled={saving}
                          className="flex items-center gap-1 text-sm px-4 py-2 rounded-2xl border border-[#15803d] text-[#15803d] hover:bg-[#f1e9df]"
                        >
                          <Repeat className="w-3.5 h-3.5" /> Powtórz ten box
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-[#6b7280]">
          Pełne zarządzanie subskrypcją działa (edycja profilu, pauza, pomijanie tygodni, powtórki). 
          Zmiany są zapisywane w Twoim koncie Supabase i widoczne natychmiast.
        </div>
      </div>
    </div>
  );
}
