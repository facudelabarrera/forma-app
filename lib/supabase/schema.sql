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

-- ─── Profiles ────────────────────────────────────────────────────────────────────
create table if not exists profiles (
  user_id              uuid    references auth.users(id) on delete cascade primary key,
  onboarding_completed boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Trigger: auto-crear profile cuando se registra un usuario nuevo
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Row Level Security ──────────────────────────────────────────────────────────
alter table habits             enable row level security;
alter table daily_entries      enable row level security;
alter table weekly_reflections enable row level security;
alter table profiles           enable row level security;

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

create policy "users own profile"
  on profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── Backfill: usuarios existentes con hábito activo ─────────────────────────────
-- Ejecutar UNA SOLA VEZ después de crear la tabla profiles si ya hay usuarios:
-- insert into profiles (user_id, onboarding_completed)
-- select distinct user_id, true
-- from habits
-- where is_active = true
-- on conflict (user_id) do update set onboarding_completed = true;
