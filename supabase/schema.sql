-- Krypton IELTS Practice: student profile and private practice history.
-- Run this script in the Supabase SQL editor for your project.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  target_band numeric(2,1) check (target_band is null or target_band between 0 and 9),
  test_type text not null default 'Academic' constraint profiles_test_type_check check (test_type in ('Academic', 'General Training')),
  daily_study_minutes integer not null default 60 constraint profiles_daily_study_minutes_check check (daily_study_minutes in (30, 60, 90, 120, 180)),
  exam_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module text not null check (module in ('listening', 'reading', 'writing', 'speaking')),
  activity_id text not null,
  title text not null,
  score integer check (score is null or score >= 0),
  total integer check (total is null or total > 0),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  mock_id text,
  answer_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint practice_score_within_total check (score is null or total is null or score <= total)
);

-- Add study-plan fields safely for existing student profiles.
alter table public.profiles add column if not exists test_type text not null default 'Academic';
alter table public.profiles add column if not exists daily_study_minutes integer not null default 60;
alter table public.profiles add column if not exists exam_date date;

do $
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_test_type_check' and conrelid = 'public.profiles'::regclass) then
    alter table public.profiles add constraint profiles_test_type_check check (test_type in ('Academic', 'General Training'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_daily_study_minutes_check' and conrelid = 'public.profiles'::regclass) then
    alter table public.profiles add constraint profiles_daily_study_minutes_check check (daily_study_minutes in (30, 60, 90, 120, 180));
  end if;
end $;

create index if not exists practice_sessions_user_created_idx
  on public.practice_sessions (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.practice_sessions enable row level security;

-- Remove project defaults, then grant only the operations the app needs.
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.practice_sessions from anon, authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, delete on table public.practice_sessions to authenticated;

drop policy if exists "Students can view their own profile" on public.profiles;
create policy "Students can view their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Students can create their own profile" on public.profiles;
create policy "Students can create their own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Students can update their own profile" on public.profiles;
create policy "Students can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Students can view their own practice" on public.practice_sessions;
create policy "Students can view their own practice"
  on public.practice_sessions for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Students can save their own practice" on public.practice_sessions;
create policy "Students can save their own practice"
  on public.practice_sessions for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Students can delete their own practice" on public.practice_sessions;
create policy "Students can delete their own practice"
  on public.practice_sessions for delete to authenticated
  using ((select auth.uid()) = user_id);

-- The signup trigger needs elevated access to create the new student's profile.
-- Keep its function in the unexposed private schema and revoke direct invocation.
create or replace function private.handle_new_krypton_student()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, target_band, test_type, daily_study_minutes, exam_date)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'target_band', '')::numeric, 7.0),
    case when new.raw_user_meta_data ->> 'test_type' = 'General Training' then 'General Training' else 'Academic' end,
    coalesce(nullif(new.raw_user_meta_data ->> 'daily_study_minutes', '')::integer, 60),
    nullif(new.raw_user_meta_data ->> 'exam_date', '')::date
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_krypton_student() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_krypton on auth.users;
create trigger on_auth_user_created_krypton
  after insert on auth.users
  for each row execute function private.handle_new_krypton_student();
