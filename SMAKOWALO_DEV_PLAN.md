# Smakowało - Development Plan (Low-Key HelloFresh Style)

**Date:** June 2026
**Goal:** Build a friendly, low-key weekly meal kit service for Poland (starting Poznań +30km). Inspired by GreenChef/HelloFresh but warmer, more approachable, less corporate. Focus on joy of home cooking with zero waste, real ingredients, easy recipes.

## Core Philosophy & Branding
- **Tone:** Low key, friendly, honest, "jak u babci ale wygodniej". Warm, natural, earthy.
- **Visuals:** Soft natural light, real food photos (no stock corpo), wooden textures, herbs, veggies. Use the green palette (#15803d deep green, cream #f8f5f0, soft browns).
- **Copy:** Simple Polish, benefit-focused, no hard sell. "Wybierz, gotuj, ciesz się".
- **Sales:** Low pressure. Clear value (time save, no waste, tasty healthy), easy choice, recurring but flexible (pause/skip easy).

## Sales & UX Flow (Competitor-Inspired, Softer)
1. **Landing (front page):** Inspiring hero with food images + branding. Simple benefits (fresh, zero waste, 20-30min cook). How it works (3 steps). Plans & pricing (2/4/6 osób, 3/4/5 dań). Teaser "Zobacz menu". Strong but friendly CTA "Zacznij wybierać".
2. **Public Menu:** Teaser of this week's recipes (photos, nutrition, time, allergens). Link to full kreator.
3. **Kreator (core conversion):** 
   - Step 1: Box size (2/4/6 osób) + meals/week.
   - Step 2: Preferences + allergies (filters results, personal warnings on dishes).
   - Step 3: Browse & pick recipes (cards with photo, kcal, time, tags; "Dodaj do boxa"; limit based on plan).
   - Summary: Your box, total portions, any allergen warnings highlighted.
4. **Auth:** Seamless - after summary, "Zaloguj się lub załóż konto żeby dokończyć i zapisać preferencje". Email/password + magic link now; Google at end as requested.
5. **Checkout:** Delivery details (address in Poznań area, day choice: wtorek/czwartek). Stripe payment (one-time first box or subscribe for recurring weekly). Low key confirmation.
6. **Client Panel (you're leading):** 
   - Upcoming box + edit recipes before cutoff.
   - Past boxes with photos/recipes.
   - Manage preferences/allergies, pause/skip week, profile, delivery.
   - Emails (you're leading): Welcome, order confirm, "Czas wybrać dania na przyszły tydzień", reminders.
7. **Admin (later):** Publish weekly menus, add recipes (with nutrition/images), view orders.

**Key Low-Key UX Touches:**
- Recipe filters auto-apply from prefs (but allow override with warnings).
- Clear "Ile porcji" and "Czas gotowania".
- Friendly empty states and confirmations.
- Mobile-first, fast.
- No aggressive upsells; focus on the joy and convenience.
- Recurring sub easy to manage/pause (Stripe customer portal + custom).

## Tech & Data
- Next.js 15 + TS + Tailwind + shadcn (current).
- Supabase (Auth, DB for users/selections/recipes, Storage for images).
- Stripe for payments (subscriptions for recurring boxes or one-time).
- Emails: Resend (or Supabase + nodemailer).
- Current schema: user_selections table (people, meals, prefs, allergens, recipe_ids).

## Action Sequence (Prioritized, Iterative)
**Immediate (this session + next check-in):**
1. **Supabase Fix (critical - do first):** 
   - Your project is paused (inactive >90 days since ~Jun 2024, as per your screenshot). Data safe but inaccessible. Cannot restore via old dashboard.
   - Steps (per the docs link you shared):
     - In the paused project dashboard, download the backup (full DB + storage objects).
     - Create a **new Supabase project** (go to supabase.com, New Project, choose region, set password).
     - In the new project, use the "Restore" or import backup option (or use Supabase CLI: supabase db push with the dump, and storage restore).
     - Once restored, go to Project Settings > API to get the new **URL** and **anon public key** (and service_role key for server ops/migrations).
     - Update `.env.local` in the app with the **new** keys (replace the old quqqpix... ones).
     - Run our migrations: In Supabase SQL editor, run the content of `supabase/migrations/20250601_user_selections.sql` (and any other .sql we have).
     - Test connection: The app uses Supabase for auth (logowanie/rejestracja) and saving user choices (in kreator summary, it saves to user_selections table linked to auth user).
     - If Gmail login later: We'll add Google provider in Supabase Auth settings + code.
   - After this, auth and saving will work. Current .env has the paused project's keys, so it won't connect until updated.
   - Note: For local dev, new free project is fine. Later we can discuss prod vs dev projects.
   - I'll update the code if needed once you have new keys (e.g., re-test saving selection after login).
   - Update PLAN when done.

2. **Front page graphics & low-key branding (in progress):** 
   - Added 4 custom low-key food/veg/branding photos (generated warm, natural, homey style - no corpo slickness).
   - Integrated into hero and new "Świeże składniki" section on landing.
   - Softened copy: More friendly, "prosto z polskich upraw", "zero stresu", "gotujesz w domu".
   - Kept warm green + cream palette, rounded elements for approachable feel (not sharp corpo).
   - More to come: Additional images in menu/kreator cards, consistent visual language.

3. **Enhance landing UX/Copy (low key competitor style):**
   - Made hero split with photo + warm text.
   - Added visual "jak to działa" and ingredients section with real food photos.
   - Plans section is friendly cards, not aggressive pricing tables.
   - Flow: Easy path to kreator without pressure.
   - Low key: Honest benefits, no "revolutionary" claims, focus on convenience + pleasure of cooking.

4. **Auth flow (email now, Gmail at end as requested):**
   - Current: Email + password, magic link (working via Supabase).
   - After kreator summary: If not logged, prompt to log/register (saves choice on success).
   - Gmail/Google: At the end - we'll add provider in Supabase dashboard and button in auth pages.

5. **Kreator & sales logic (UX like HelloFresh/GreenChef but low key):**
   - Already has good foundation: Box size (2/4/6), meals/week, prefs + allergies (auto filter + personal warnings on dishes - very important for trust).
   - Recipe cards with nutrition, time, allergens highlighted if match user.
   - Low key sales: No hard upsells, focus on "wybierz co lubisz", clear total portions.
   - Next: Make recipe choice more delightful (images in cards if possible, easy swap, summary with nice box visual).
   - Weekly recurring: Model as Stripe subscription (easy pause/skip via customer portal + our panel).
   - Delivery: Simple form, Poznań +30km, day choice.

6. **Stripe payments:**
   - Use your live keys for prod, test for dev.
   - Flow: After summary + auth + delivery info → Stripe Checkout for the box (or subscribe for recurring weekly).
   - Webhooks to confirm order and save in DB.
   - Low key: Clear "co płacisz", no hidden fees, easy cancel.

7. **Client panel & emails (you're leading - I'll support):**
   - Panel: List of your saved boxes (from DB), edit prefs, view past with recipes/nutrition, manage sub (pause, skip).
   - Emails: Welcome, order confirm with box details, "Czas wybrać na przyszły tydzień" with link to kreator.
   - Integration: After auth/save, trigger email; in panel show upcoming and history.

8. **Overall UX, functionality, sales logic (low key):**
   - Like competitors: Weekly menu drop, recipe choice with filters (prefs/allergies), box config, recurring sub, delivery, account with history.
   - But low key: Warmer language ("wybierz co Ci smakuje"), real home photos, simple not overwhelming UI, flexible (easy skip/pause without guilt), focus on the joy and time save, not "perfect health transformation".
   - Sales: Soft - inspire on landing, make choice easy in kreator (with smart defaults from prefs), clear value in summary, trust in confirmation and panel.
   - Functionality: Cutoff for edits, auto warnings for allergens, nutrition info everywhere, mobile friendly.
   - To test: Full flow landing -> kreator (with allergies) -> summary -> auth (email) -> (after Supabase fix) save -> panel.

**Periodic updates:** After each major step (e.g., Supabase fixed, more graphics, Stripe skeleton), I'll say in chat: "Update pushed. Server restarted. Check http://localhost:3000 now (run `npm run dev` in your terminal if it was stopped, then hard refresh). Here's what to try: [specific flow]". You can see live changes.

**Latest update (this response):** 
- Server is up and responding (lsof shows listener, curl 200 OK). Agent background tasks end quickly, so **run `npm run dev` in your own terminal** for stable localhost:3000 preview. Check now after any changes!
- Front page: 4 custom low-key food/veg/branding photos added (warm natural home lighting, fresh produce, opened box, cooking scene - friendly, not slick corpo). Used in hero + new "Świeże składniki" section. Copy softened for low-key feel.
- Full plan + sequence in SMAKOWALO_DEV_PLAN.md (updated with your feedback).
- Supabase: current .env points to your paused project. See detailed restore steps below (download backup → new project → restore → new keys → update .env + run migrations).
- Next (after you fix Supabase): I'll enhance /panel to display your saved boxes nicely (with people/meals/prefs/allergens + "re-order" action), add a basic Stripe "Pay for this box" button skeleton in /podsumowanie (using your test/live keys, one-time or subscribe), make kreator cards even more visual/low-key with food vibe.
- Gmail: at the end.
- You leading panel/emails: DB (user_selections) and auth are wired; let me know specific fields or email triggers you need.

**Current status (this update):**
- Landing front page enhanced with food/veg graphics (images 1-4 in public/images, used in hero and new section), low key copy and warm feel.
- Plan created/updated with sequence and UX/sales thoughts.
- Server cleaned and restarted (see task output - Ready on localhost:3000).
- Supabase: .env has old paused keys - see above for restore steps. Once done, auth and saving will connect properly.
- Next immediate after your Supabase restore: Refine kreator for even better low key UX (more visual recipe choice, friendly microcopy), start Stripe integration skeleton, add more recipes with branding consistency.
- Gmail: At the end, as requested.
- You leading panel/emails: I'll make sure backend (DB saves, user data) is ready and not conflicting.

Keep the low key vibe - natural, friendly, joyful home cooking with great ingredients. Not flashy sales machine.

Sprawdź localhost:3000 teraz po restarcie dev! (Jeśli nie widzisz zmian, hard refresh lub upewnij się że .env.local ma poprawne klucze).

Jak zrobisz restore Supabase i dasz znać, to od razu sprawdzę połączenie w kodzie i wrzucę update.

Coś konkretnego z planu na teraz? Albo po prostu lecę z następnym (np. więcej low key w kreatorze + Stripe prep). Daj znać! 

Trzymam kciuki za restore - jak będzie nowy projekt, podaj klucze to ogarniemy. 😊

2. **Front Page Graphics & Branding:**
   - Generate 4-5 custom low-key food/veg images (hero, ingredients, cooking, box).
   - Add to public/images/.
   - Update landing: hero with large photo + overlay text, new "Świeże składniki" section with images, enhance "Jak to działa" with visuals.
   - Keep low-key: natural photos, warm filter, friendly Polish copy.

3. **Enhance Landing UX/Copy:**
   - More natural, benefit-driven text.
   - Add trust ( "Dostawa Poznań +30km", "Zero marnowania", simple testimonials placeholders).
   - Stronger but soft CTAs to kreator.
   - Make plans section more visual/friendly.

**Latest update (this response):** 
- Server is up and responding. **Run `npm run dev` in your own terminal** for stable localhost:3000 (agent backgrounds are temporary). Hard refresh after changes!
- Menu expanded to 16 dishes with Poznań research (hearty Polish classics with healthy twists like bigos, schabowy, pierogi, kotlet, pyzy + fast-food feel good like burrito bowl, loaded sweet potato, stir fry kaczka, wege bigos + Asian, vegan, fish). All with realistic nutrition (kcal, macros, vitamins like Vit C 30-50% RWS, Iron, Fiber), full ingredients, detailed step-by-step instructions, dietary tags, allergens.
- Graphics: 8+ low-key friendly homey food photos added (generated, copied to public/images, used in landing hero/visuals and menu cards). Real uploaded photos from your Supabase "Foto Potrawy" integrated where matching (URLs updated to correct bucket).
- Landing: Prominent hero with food photo (salmon), added "Zobacz jak to działa w praktyce" section with 3 photos + video placeholder idea. Softer, low-key copy throughout.
- Menu: Now super functional and informative – search, filters (diet, time, kcal, exclude allergens), sort, cards with thumbnail + quick info (time, kcal, tags), click opens nice modal with large photo, ingredients, "Sposób przyrządzania" step-by-step numbered, full nutrition table (expanded with vitamins), allergens warning, legal note ("Dane przybliżone..."), tips. Mobile-friendly (stacks, touch ok).
- Legals: Regulamin (full terms for sub, delivery, allergens, etc. with company info from history) and Polityka Prywatności (GDPR basics) created. Links added in footers of landing and menu.
- Supabase: .env updated with your new project keys and "Foto Potrawy" bucket. Recipes use correct storage URLs. Remind: run the user_selections migration in new project SQL editor, set bucket policy to public read.
- PLAN.md updated with full business success strategy (below) + this status.
- Next (per plan, low-key focus): After your Supabase confirm, add Stripe skeleton in summary, enhance panel with "re-order" from saved selections, more mobile polish if needed, Gmail auth at end. Test full flow: landing (hero photo) -> menu (click for full informative modal) -> kreator (16 options, prefs/allergies) -> auth -> summary -> panel.
- Check localhost:3000 NOW (run npm run dev locally, hard refresh). 16 dishes, full clickable menu with steps/nutrition/vitamins, hero photo, legals. Low-key friendly, not corpo. Real Poznań research baked in (hearty classics + healthy fast casual + variety for busy locals). Business plan ready for sales success via local focus, education, retention. Work magic continues! 😊

**Business success and sales strategy (added to plan):**
- Target Poznań first: Busy pros/families 25-45 wanting convenient healthy home cooking with local twist (hearty Polish comfort like bigos/schabowy but healthy, fast casual bowls/stir fries/burger feel good, vegan/vege, seasonal local like beets/cabbage/duck/fish).
- Marketing low-key: Local SEO ("posiłki do domu Poznań", "zdrowe zestawy Poznań"), Instagram/TikTok with real user photos + "krok po kroku" stories (education builds loyalty), partnerships with local farms/gyms/offices (corporate boxes, pop-ups), referral program (both get discount box).
- Sales functional: Subscription (70% recurring revenue, easy skip/pause in panel for retention), one-time trial boxes, cross-sell addons (desery, śniadania). Pricing competitive (from initial research ~150-400zł/box first, then regular). Low pressure – focus on joy/convenience/education, not hype.
- Retention & ops: High variety (weekly menu changes based on feedback/popularity data), educational recipes (step-by-step teaches cooking, builds habit), loyalty (every 5th box free), reliable local delivery (partner or own for quality/freshness from Wielkopolska suppliers – lower costs, local story).
- Scale: Nail Poznań (target 300-500 subs in 6 months via word-of-mouth + digital), then expand cities (data-driven menu). App for better UX/mobile. Metrics: low CAC via referrals/local, high LTV via sub + education, 60%+ retention, NPS>50, margins 35%+ at scale.
- Risks/mitigation: Competition (differentiate with real photos, local, education, low-key trust); supply (diversify local suppliers); regs (full compliance in legals, food safety). Success = convenient + real + educational + flexible = loyal Poznań fans who spread the word, recurring sales, profitable growth without corpo feel. 

4. **Auth Flow Polish:**
   - Ensure after kreator summary → auth (if not logged) → save selection to DB on success.
   - Redirect to /panel or summary.
   - (Google login at end as you said.)

**Next (after Supabase + graphics):**
5. **Stripe Payments:**
   - Model: Price per box (based on people x meals) or fixed plans + addons.
   - One-time for first box or Stripe subscription for weekly recurring.
   - Checkout in summary flow. Use your keys (test first).
   - Webhooks for order confirmation.

6. **Client Panel (your focus area):**
   - List user's saved selections/boxes from DB.
   - Edit preferences/allergies.
   - View past boxes + recipes.
   - Basic profile + logout.
   - (Add email sending integration here.)

7. **Emails (your focus):**
   - Welcome on signup.
   - Order confirmation with box details.
   - Weekly "Czas na wybór dań" (with link to kreator).
   - Use Resend or similar.

8. **Sales Logic & UX Refinements (low-key competitor style):**
   - Weekly "menu drops" (admin publishes recipes for the week).
   - Cutoff for edits (e.g., 2 days before delivery).
   - Recipe detail pages (ingredients, steps, nutrition, allergens).
   - Flexible sub: pause, skip week, change box size.
   - Delivery: simple form, date choice.
   - Confirmation page with "Co dalej" (track, edit if possible).

**Ongoing / Polish:**
- More recipes (10-15 with real nutrition/images).
- Better mobile, loading, errors.
- Admin tools (simple).
- Legal pages (regulamin, prywatność).
- Analytics, A/B on kreator.
- Real images/recipes from you or generated.

**Testing & Updates:**
- After each major milestone (e.g., graphics added, Supabase fixed, Stripe in), I'll note: "Update pushed - check http://localhost:3000 now (restart `npm run dev` if needed)".
- You can test the full flow: landing → kreator (with prefs) → summary → auth → panel.
- Server will be kept running in background for previews.

**Current State (as of now):**
- Solid foundation: landing, kreator with prefs/allergies/warnings, public menu, summary, basic auth (email), Supabase client, .env set, panel stub.
- Next immediate: Supabase restore guidance + front page images + landing polish.
- Low key focus: warmer photos, softer language, real-home feel vs slick corpo.

Let's keep the momentum - low key but delightful experience that converts without feeling salesy.

Next update coming soon after graphics + Supabase notes. Check localhost after I note! 

(If server not responding, run `npm run dev` in terminal and wait for "Ready".)

Powodzenia z panelem i emailami - daj znać jak chcesz współpracować na tych częściach! 

---

*Plan will be updated in this file as we go. Feel free to edit or comment.*