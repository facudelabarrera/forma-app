-- ─── MIGRACIÓN: Tabla profiles + trigger + backfill ──────────────────────────
-- Ejecutar en Supabase Dashboard > SQL Editor > New query
-- Este script es seguro de ejecutar múltiples veces (usa IF NOT EXISTS y ON CONFLICT).

-- 1. Crear tabla profiles
create table if not exists profiles (
  user_id              uuid    references auth.users(id) on delete cascade primary key,
  onboarding_completed boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- 2. Habilitar RLS
alter table profiles enable row level security;

-- 3. Policy: cada usuario solo ve/edita su propio profile
do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'users own profile' and tablename = 'profiles'
  ) then
    create policy "users own profile"
      on profiles for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end;
$$;

-- 4. Trigger: auto-crear profile al registrarse
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

-- 5. Backfill: usuarios que ya tienen hábito activo => onboarding_completed = true
insert into profiles (user_id, onboarding_completed)
select distinct user_id, true
from habits
where is_active = true
on conflict (user_id) do update set onboarding_completed = true;
