-- ═══════════════════════════════════════════════════════════════════════════════
-- MonacOut — RETROUVER SES AMIES PAR LE CARNET D'ADRESSES
-- À coller dans Supabase → SQL Editor → Run.  Projet xaxvknfieoyadllrbdfn.
--
-- Aucun numéro n'est stocké en clair. Le téléphone calcule une empreinte SHA-256
-- (src/lib/phone.js) et n'envoie que celle-ci.
--
-- ⚠️ POURQUOI UNE TABLE À PART ET PAS UNE COLONNE DE `profiles` :
-- le 23 sep 2026, `profiles` s'est révélée LISIBLE PAR TOUT LE MONDE avec la seule
-- clé publique, sans être connecté (62 lignes, invite_code compris). Une empreinte
-- de numéro posée là serait aspirable, et cassable par force brute — il n'existe
-- qu'une centaine de millions de numéros monégasques et français. On isole donc les
-- empreintes dans une table QUE PERSONNE NE PEUT LIRE, ni anonyme ni connecté :
-- elle n'a aucune policy, donc RLS refuse tout. On n'y touche que par les deux
-- fonctions ci-dessous, qui ne rendent jamais une empreinte.
-- ═══════════════════════════════════════════════════════════════════════════════

create table if not exists public.phone_links (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  phone_hash text not null unique,
  created_at timestamptz not null default now()
);

alter table public.phone_links enable row level security;
-- Volontairement AUCUNE policy : aucune lecture, aucune écriture par l'API.
revoke all on table public.phone_links from anon, authenticated;

-- ── 1. J'enregistre MON numéro (ou je le retire) ───────────────────────────────
create or replace function public.enregistrer_mon_numero(hash text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'connexion requise'; end if;

  -- Retirer son numéro : on passe null, la ligne disparaît. Doit rester possible
  -- à tout moment — c'est la contrepartie de l'avoir donné.
  if hash is null or hash = '' then
    delete from public.phone_links where user_id = auth.uid();
    return;
  end if;

  -- Une empreinte SHA-256, rien d'autre : 64 caractères hexadécimaux.
  if hash !~ '^[0-9a-f]{64}$' then raise exception 'empreinte invalide'; end if;

  insert into public.phone_links (user_id, phone_hash)
  values (auth.uid(), hash)
  on conflict (user_id) do update set phone_hash = excluded.phone_hash;
exception
  -- Le numéro est déjà revendiqué par un autre compte : on ne dit pas par qui.
  when unique_violation then raise exception 'ce numéro est déjà rattaché à un compte';
end;
$$;

-- ── 2. Est-ce que j'ai déjà donné mon numéro ? (oui/non, jamais l'empreinte) ────
create or replace function public.mon_numero_est_enregistre()
returns boolean
language sql security definer set search_path = public
as $$
  select exists (select 1 from public.phone_links where user_id = auth.uid())
$$;

-- ── 3. LE CROISEMENT ───────────────────────────────────────────────────────────
-- On soumet les empreintes de son carnet ; on reçoit les profils qui correspondent.
-- La fonction ne rend JAMAIS une empreinte, donc on ne peut pas s'en servir pour
-- reconstituer la table. Le plafond de 1 000 empêche d'y passer un dictionnaire.
create or replace function public.match_contacts(hashes text[])
returns table (id uuid, display_name text, avatar_url text)
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'connexion requise'; end if;
  if hashes is null
     or coalesce(array_length(hashes, 1), 0) = 0
     or array_length(hashes, 1) > 1000 then
    raise exception 'carnet vide ou trop grand';
  end if;

  return query
    select p.id, p.display_name, p.avatar_url
    from public.phone_links l
    join public.profiles p on p.id = l.user_id
    where l.phone_hash = any(hashes)
      and l.user_id <> auth.uid()
    limit 100;
end;
$$;

revoke all on function public.enregistrer_mon_numero(text)   from public, anon;
revoke all on function public.mon_numero_est_enregistre()    from public, anon;
revoke all on function public.match_contacts(text[])         from public, anon;
grant execute on function public.enregistrer_mon_numero(text) to authenticated;
grant execute on function public.mon_numero_est_enregistre()  to authenticated;
grant execute on function public.match_contacts(text[])       to authenticated;
