-- ═══════════════════════════════════════════════════════════════════════════════
-- MonacOut — FERMER LA TABLE `profiles`
-- À coller dans Supabase → SQL Editor → Run.  Projet xaxvknfieoyadllrbdfn.
--
-- 🚨 CE QUI A ÉTÉ CONSTATÉ LE 23 SEPTEMBRE 2026
-- Avec la seule clé publique — celle qui est dans le bundle JavaScript livré à tous
-- les navigateurs — et SANS être connecté :
--     curl "$URL/rest/v1/profiles?select=*" -H "apikey: $ANON"
-- rend les 62 profils en entier : prénom, photo, centres d'intérêt, date, et le
-- `invite_code`. Or ce code est exactement ce que `addFriendByCode` demande pour
-- créer une amitié : n'importe qui pouvait donc énumérer tout le monde et demander
-- l'amitié de chacune. `friendships`, `participations` et `visibility` étaient bien
-- protégées ; `profiles` ne l'était pas.
--
-- ⚠️ CE SCRIPT CASSE LES ANCIENNES VERSIONS DE L'APP. Les bundles qui lisent encore
-- `profiles` en direct perdront l'ajout par code. NE LE PASSER QU'APRÈS avoir publié
-- l'OTA correspondant et vérifié son adoption (`version_interface` dans PostHog).
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── 1. Les fonctions de remplacement, D'ABORD ─────────────────────────────────
-- Elles doivent exister AVANT que les politiques ne se referment, sinon l'app n'a
-- plus aucun chemin pour lire un profil par son code.

-- Le prénom de qui invite, pour la carte « Fiona t'invite ». Appelable sans compte :
-- la personne invitée n'en a pas encore, c'est tout l'objet de la carte.
-- On ne rend QUE le prénom — ni identifiant, ni photo, ni code.
create or replace function public.prenom_par_code(code text)
returns text
language sql security definer set search_path = public stable
as $$
  select p.display_name from public.profiles p
  where p.invite_code = lower(btrim(code))
    and length(btrim(code)) between 4 and 32
  limit 1
$$;

-- Le profil visé par un code, pour créer l'amitié. Connexion obligatoire.
create or replace function public.profil_par_code(code text)
returns table (id uuid, display_name text)
language sql security definer set search_path = public stable
as $$
  select p.id, p.display_name from public.profiles p
  where auth.uid() is not null
    and p.invite_code = lower(btrim(code))
    and length(btrim(code)) between 4 and 32
  limit 1
$$;

-- Le contrôle du CI (scripts/check-invitations.mjs). Il n'a jamais eu besoin des
-- noms : il compte. On ne rend donc que des nombres — aucune donnée personnelle.
-- Sans cette fonction, le garde-fou posé après le bug du 7 août tomberait EN
-- SILENCE : le script attrape l'erreur et affiche « contrôle ignoré ».
create or replace function public.controle_codes()
returns table (total bigint, invalides bigint, doublons bigint)
language sql security definer set search_path = public stable
as $$
  select
    (select count(*) from public.profiles),
    (select count(*) from public.profiles where coalesce(invite_code, '') !~ '^[a-z0-9]{4,}$'),
    (select count(*) from (
        select invite_code from public.profiles
        where invite_code is not null
        group by invite_code having count(*) > 1) d)
$$;

grant execute on function public.prenom_par_code(text) to anon, authenticated;
grant execute on function public.profil_par_code(text)  to authenticated;
grant execute on function public.controle_codes()       to anon, authenticated;
revoke execute on function public.profil_par_code(text) from anon;

-- ── 2. Fermer la table ────────────────────────────────────────────────────────
-- On repart de zéro sur les politiques : on ne connaît pas les noms de celles qui
-- existent (impossible à lire avec la clé publique), et il ne doit rien rester de
-- permissif derrière. Les quatre politiques recréées ci-dessous couvrent
-- EXACTEMENT les sept usages de l'app, recensés un par un :
--   useAuth.loadProfile ........ ma ligne            → select_self
--   useAuth.saveProfile (upsert) ma ligne            → insert_self + update_self
--   useSocial.load ............. mes amies/demandes  → select_liens
--   useSocial.addFriendByCode .. par code            → profil_par_code()
--   App.jsx ×2 (carte invitation) par code, anonyme  → prenom_par_code()
--   check-invitations.mjs ...... comptes             → controle_codes()
alter table public.profiles enable row level security;

do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'public' and tablename = 'profiles'
  loop
    execute format('drop policy %I on public.profiles', p.policyname);
  end loop;
end $$;

create policy profiles_select_self on public.profiles
  for select to authenticated
  using (id = auth.uid());

-- Les profils des personnes avec qui j'ai un lien — amitié acceptée OU demande en
-- cours, dans les deux sens. Sans « demande en cours », l'écran Amies n'afficherait
-- pas le prénom de celle qui vient de m'ajouter.
create policy profiles_select_liens on public.profiles
  for select to authenticated
  using (exists (
    select 1 from public.friendships f
    where (f.requester_id = auth.uid() and f.addressee_id = profiles.id)
       or (f.addressee_id = auth.uid() and f.requester_id = profiles.id)
  ));

create policy profiles_insert_self on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- ── 3. Vérification, à lire dans la sortie ────────────────────────────────────
-- Doit afficher les 4 politiques ci-dessus, et RIEN d'autre.
select policyname, cmd, roles from pg_policies
where schemaname = 'public' and tablename = 'profiles' order by policyname;

-- ⚠️ CE QUI RESTE OUVERT, ET C'EST ASSUMÉ : `prenom_par_code` répond à qui veut,
-- sans compte. Un code fait 6 caractères, soit ~17 millions de possibilités : on
-- passe d'« aspirer les 62 d'un coup » à « deviner un code à la fois, derrière la
-- limitation de débit de Supabase ». C'est le prix à payer pour que la carte
-- « Fiona t'invite » continue de s'afficher à quelqu'un qui n'a pas encore de compte.
