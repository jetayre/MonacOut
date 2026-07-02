-- MonacOut — Supabase schema
-- Run this in your Supabase project: SQL Editor → New query → paste → Run

-- Profiles (one row per authenticated user)
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  invite_code   text unique default lower(substring(gen_random_uuid()::text, 1, 6)),
  created_at    timestamptz default now()
);

-- Friendships
create table if not exists public.friendships (
  id            uuid primary key default gen_random_uuid(),
  requester_id  uuid not null references public.profiles(id) on delete cascade,
  addressee_id  uuid not null references public.profiles(id) on delete cascade,
  status        text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at    timestamptz default now(),
  unique (requester_id, addressee_id)
);

-- Participations ("J'y vais" on an event)
create table if not exists public.participations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  event_id   integer not null,
  incognito  boolean not null default false,
  created_at timestamptz default now(),
  unique (user_id, event_id)
);

-- Visibility (user_id allows visible_to_id to see their participations)
create table if not exists public.visibility (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  visible_to_id  uuid not null references public.profiles(id) on delete cascade,
  created_at     timestamptz default now(),
  unique (user_id, visible_to_id)
);

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.profiles     enable row level security;
alter table public.friendships  enable row level security;
alter table public.participations enable row level security;
alter table public.visibility   enable row level security;

-- Profiles: anyone can read, only owner can write
create policy "profiles: public read" on public.profiles for select using (true);
create policy "profiles: owner write" on public.profiles for all using (auth.uid() = id);

-- Friendships: parties involved can read; requester can insert; either party can delete
create policy "friendships: parties read" on public.friendships for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);
create policy "friendships: requester insert" on public.friendships for insert
  with check (auth.uid() = requester_id);
create policy "friendships: addressee update" on public.friendships for update
  using (auth.uid() = addressee_id);
create policy "friendships: parties delete" on public.friendships for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- Participations: owner + friends (via visibility) can read; owner writes
create policy "participations: owner read" on public.participations for select
  using (auth.uid() = user_id);
create policy "participations: friends read" on public.participations for select
  using (
    incognito = false
    and exists (
      select 1 from public.visibility v
      where v.user_id = participations.user_id
        and v.visible_to_id = auth.uid()
    )
  );
create policy "participations: owner write" on public.participations for all
  using (auth.uid() = user_id);

-- Visibility: owner reads/writes their own rows
create policy "visibility: owner all" on public.visibility for all
  using (auth.uid() = user_id);
create policy "visibility: target read" on public.visibility for select
  using (auth.uid() = visible_to_id);
