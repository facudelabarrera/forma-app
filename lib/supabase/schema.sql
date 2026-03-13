-- ─── FORMA — Schema inicial ────────────────────────────────────────────────────
-- Ejecutar en Supabase > SQL Editor
-- Supabase gestiona la tabla auth.users automáticamente.

-- ─── Habits ─────────────────────────────────────────────────────────────────────
create table if not exists habits (
  id           uuid    default gen_random_uuid() primary key,
  user_id      uuid    references auth.users(id) on delete cascade not null,
  identity     text    not null,           -- "Soy alguien que..."
  name         text    not null,           -- Acción concreta del hábito
  ancla        text    not null,           -- Actividad ancla
  started_at   date    not null default current_date,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ─── Daily entries ───────────────────────────────────────────────────────────────
create table if not exists daily_entries (
  id           uuid    default gen_random_uuid() primary key,
  user_id      uuid    references auth.users(id) on delete cascade not null,
  habit_id     uuid    references habits(id) on delete cascade not null,
  date         date    not null,
  state        text    not null check (state in ('lo-hice', 'dia-dificil', 'hoy-no')),
  reflection   text,
  created_at   timestamptz not null default now(),
  unique (user_id, habit_id, date)
);

-- ─── Weekly reflections ──────────────────────────────────────────────────────────
create table if not exists weekly_reflections (
  id                   uuid    default gen_random_uuid() primary key,
  user_id              uuid    references auth.users(id) on delete cascade not null,
  habit_id             uuid    references habits(id) on delete cascade not null,
  week_number          integer not null,
  qualitative_response text    not null,   -- 'si' | 'a-medias' | 'dificil'
  free_reflection      text,
  completed_at         timestamptz not null default now(),
  unique (user_id, habit_id, week_number)
);

-- ─── Row Level Security ──────────────────────────────────────────────────────────
alter table habits             enable row level security;
alter table daily_entries      enable row level security;
alter table weekly_reflections enable row level security;

-- Cada usuario solo puede leer y escribir sus propios datos
create policy "users own habits"
  on habits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users own entries"
  on daily_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users own reflections"
  on weekly_reflections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
