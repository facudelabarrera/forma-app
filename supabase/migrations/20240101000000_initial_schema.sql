-- FORMA — Initial schema
-- Run this migration in the Supabase SQL editor or via the Supabase CLI.

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  onboarding_completed boolean not null default false,
  updated_at          timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, onboarding_completed)
  values (new.id, false)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── habits ──────────────────────────────────────────────────────────────────
create table if not exists public.habits (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  identity    text not null,
  name        text not null,
  ancla       text not null,
  started_at  date not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.habits enable row level security;

create policy "Users can read their own habits"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "Users can insert their own habits"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own habits"
  on public.habits for update
  using (auth.uid() = user_id);

-- ─── daily_entries ───────────────────────────────────────────────────────────
create table if not exists public.daily_entries (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  habit_id    uuid not null references public.habits(id) on delete cascade,
  date        date not null,
  state       text not null check (state in ('lo-hice', 'dia-dificil', 'hoy-no')),
  reflection  text,
  created_at  timestamptz not null default now(),

  unique (user_id, habit_id, date)
);

alter table public.daily_entries enable row level security;

create policy "Users can read their own entries"
  on public.daily_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on public.daily_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on public.daily_entries for update
  using (auth.uid() = user_id);

-- ─── weekly_reflections ──────────────────────────────────────────────────────
create table if not exists public.weekly_reflections (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  habit_id              uuid not null references public.habits(id) on delete cascade,
  week_number           integer not null,
  qualitative_response  text not null check (qualitative_response in ('si', 'a-medias', 'dificil')),
  free_reflection       text,
  completed_at          timestamptz not null default now(),

  unique (user_id, habit_id, week_number)
);

alter table public.weekly_reflections enable row level security;

create policy "Users can read their own reflections"
  on public.weekly_reflections for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reflections"
  on public.weekly_reflections for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reflections"
  on public.weekly_reflections for update
  using (auth.uid() = user_id);
