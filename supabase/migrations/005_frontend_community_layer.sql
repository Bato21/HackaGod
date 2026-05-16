-- ============================================================
-- AletheiaPath V2 — Migration 005: Frontend community layer
-- ============================================================
-- Rewritten against the LIVE database schema (verified via MCP),
-- NOT the repo migrations 001-004 (which were never applied here).
--
-- Live reality this migration targets:
--   * forum posts live in `forum_posts` (NOT `forum_replies`)
--   * thread counter is `forum_threads.post_count` (NOT `reply_count`)
--   * profiles live in `user_profiles` (NOT `profiles`); it already
--     has display_name/bio/avatar_url + an updated_at trigger
--   * `trg_post_inserted` already bumps post_count + last_activity on
--     INSERT — so this migration does NOT touch post counting
--   * forum_threads/forum_posts already have full RLS policies
--
-- Idempotent: safe to re-run.
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- FORUM_THREADS — frontend metadata (client dedup + geo + taxonomy)
-- author_id already exists (FK → user_profiles.id); left untouched.
-- ════════════════════════════════════════════════════════════

ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS client_id    text;
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS iso3         text;
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS country_name text;
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS region       text;
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS scope        text DEFAULT 'tema';
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS subtype      text;
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS subtitle     text;
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS year         int;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forum_threads_client_id_key') THEN
    ALTER TABLE forum_threads ADD CONSTRAINT forum_threads_client_id_key UNIQUE (client_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_forum_threads_client_id ON forum_threads(client_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_iso3      ON forum_threads(iso3);


-- ════════════════════════════════════════════════════════════
-- FORUM_POSTS — client dedup, client-side nesting, denormalized
-- author label (for guest/system posts with no user_profiles row),
-- and a like counter kept in sync by trigger below.
-- author_id already exists (FK → user_profiles.id); left untouched.
-- ════════════════════════════════════════════════════════════

ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS client_id        text;
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS parent_client_id text;
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS likes            int  NOT NULL DEFAULT 0;
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS author_name      text;
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS author_handle    text;
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS author_accent    text;
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS author_kind      text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'forum_posts_client_id_key') THEN
    ALTER TABLE forum_posts ADD CONSTRAINT forum_posts_client_id_key UNIQUE (client_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_forum_posts_client_id ON forum_posts(client_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_parent    ON forum_posts(parent_client_id);


-- ════════════════════════════════════════════════════════════
-- USER_PROFILES — add the only field the frontend profile needs
-- that does not already exist. (display_name/bio/avatar_url and
-- the updated_at trigger are already present.)
-- ════════════════════════════════════════════════════════════

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS banner text;


-- ════════════════════════════════════════════════════════════
-- COUNTRY_FOLLOWS — map "star/follow a country" (StarAPI)
-- user_id → user_profiles.id (== auth.uid()).
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS country_follows (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  iso3          text        NOT NULL,
  country_name  text,
  region        text,
  created_at    timestamptz DEFAULT now(),
  UNIQUE(user_id, iso3)
);
CREATE INDEX IF NOT EXISTS idx_country_follows_user ON country_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_country_follows_iso3 ON country_follows(iso3);


-- ════════════════════════════════════════════════════════════
-- POST_LIKES — likes on forum_posts (NOT forum_replies)
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS post_likes (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     uuid        NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at  timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON post_likes(user_id);


-- ════════════════════════════════════════════════════════════
-- TRIGGER — keep forum_posts.likes in sync with post_likes
-- (post_count/last_activity are already handled by the existing
-- trg_post_inserted → update_thread_on_post(); not touched here.)
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.fn_sync_post_likes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_post uuid;
BEGIN
  v_post := COALESCE(NEW.post_id, OLD.post_id);
  UPDATE forum_posts
  SET likes = (SELECT COUNT(*) FROM post_likes WHERE post_id = v_post)
  WHERE id = v_post;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_post_likes ON post_likes;
CREATE TRIGGER trg_sync_post_likes
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION public.fn_sync_post_likes();


-- ════════════════════════════════════════════════════════════
-- TRIGGER — auto-create a user_profiles row on signup
-- (no such trigger exists on auth.users; username is NOT NULL
-- UNIQUE so we derive a collision-safe handle from email + uid.)
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.fn_create_user_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_base   text;
  v_handle text;
BEGIN
  v_base := lower(regexp_replace(split_part(COALESCE(NEW.email, ''), '@', 1),
                                 '[^a-z0-9_]', '', 'g'));
  IF v_base = '' THEN
    v_base := 'user';
  END IF;
  v_handle := v_base || '_' || substr(replace(NEW.id::text, '-', ''), 1, 6);

  INSERT INTO public.user_profiles (id, username, display_name)
  VALUES (
    NEW.id,
    v_handle,
    COALESCE(NEW.raw_user_meta_data->>'name',
             NEW.raw_user_meta_data->>'display_name',
             split_part(COALESCE(NEW.email, v_handle), '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_user_profile ON auth.users;
CREATE TRIGGER trg_create_user_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.fn_create_user_profile();


-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- forum_threads/forum_posts already have full policy sets.
-- user_profiles only had public SELECT — add self-write so the
-- profile editor (banner/bio/avatar) works.
-- ════════════════════════════════════════════════════════════

ALTER TABLE country_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes      ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- user_profiles: self insert/update
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'self_insert_user_profiles' AND tablename = 'user_profiles') THEN
    CREATE POLICY self_insert_user_profiles ON user_profiles
      FOR INSERT WITH CHECK (id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'self_update_user_profiles' AND tablename = 'user_profiles') THEN
    CREATE POLICY self_update_user_profiles ON user_profiles
      FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());
  END IF;

  -- country_follows: owner-scoped
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'self_read_follows' AND tablename = 'country_follows') THEN
    CREATE POLICY self_read_follows ON country_follows
      FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'self_insert_follows' AND tablename = 'country_follows') THEN
    CREATE POLICY self_insert_follows ON country_follows
      FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'self_delete_follows' AND tablename = 'country_follows') THEN
    CREATE POLICY self_delete_follows ON country_follows
      FOR DELETE USING (user_id = auth.uid());
  END IF;

  -- post_likes: public read, owner-scoped write
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_read_likes' AND tablename = 'post_likes') THEN
    CREATE POLICY public_read_likes ON post_likes
      FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'self_insert_likes' AND tablename = 'post_likes') THEN
    CREATE POLICY self_insert_likes ON post_likes
      FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'self_delete_likes' AND tablename = 'post_likes') THEN
    CREATE POLICY self_delete_likes ON post_likes
      FOR DELETE USING (user_id = auth.uid());
  END IF;
END $$;
