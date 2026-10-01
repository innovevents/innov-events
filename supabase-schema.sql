-- ============================================================
-- Schéma Supabase pour le blog Innov Events
-- À exécuter dans : Supabase → SQL Editor → New query → Run
-- ============================================================

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  cover_image text,
  content text not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Met à jour updated_at automatiquement à chaque modification
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists articles_set_updated_at on articles;
create trigger articles_set_updated_at
  before update on articles
  for each row execute function set_updated_at();

-- Sécurité au niveau des lignes (RLS)
alter table articles enable row level security;

-- Tout le monde peut LIRE les articles publiés (le site public : blog.html, article.html)
drop policy if exists "Lecture publique des articles publiés" on articles;
create policy "Lecture publique des articles publiés"
  on articles for select
  using (published = true);

-- Seul un compte connecté (vous, l'admin) peut tout lire/écrire (admin.html)
drop policy if exists "Accès complet aux comptes connectés" on articles;
create policy "Accès complet aux comptes connectés"
  on articles for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- Étapes suivantes (dans l'interface Supabase, pas ici) :
-- 1. Storage → New bucket → nom "articles" → cocher "Public bucket"
-- 2. Authentication → Users → Add user → créez votre compte admin
--    (l'e-mail et le mot de passe avec lesquels vous vous connecterez
--    sur la page admin.html du site)
-- ============================================================
