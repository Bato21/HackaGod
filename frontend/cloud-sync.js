// cloud-sync.js — background bridge between the synchronous localStorage
// APIs (AuthAPI/ForumAPI/StarAPI/ProfileAPI) and Supabase.
//
// Strategy: localStorage stays the immediate, synchronous source the React
// tree reads. On load we (1) restore the Supabase session into the session
// cache and (2) hydrate localStorage from Supabase. Every local write is
// also mirrored to Supabase in the background. Eventual consistency; a
// single guarded reload per tab makes the freshly-hydrated data visible to
// the already-mounted React app. Guests are read-only (no mirrors).
//
// Loaded LAST (after app.jsx) so all window.* APIs exist.

(function () {
  "use strict";

  var sb = window.sb;
  if (!sb) {
    console.warn("[cloud-sync] window.sb missing — running offline (localStorage only).");
    return;
  }

  var BOOT_FLAG = "aletheia.sb.boot";

  // ── helpers ────────────────────────────────────────────────────────
  function currentUser() {
    try {
      var c = window.AuthAPI && window.AuthAPI.current();
      return c && c.kind === "user" ? c : null;
    } catch (_) { return null; }
  }

  async function getUid() {
    var c = currentUser();
    if (c && c.uid) return c.uid;
    try {
      var r = await sb.auth.getUser();
      return r && r.data && r.data.user ? r.data.user.id : null;
    } catch (_) { return null; }
  }

  function ms(t) {
    if (t == null) return Date.now();
    var n = typeof t === "number" ? t : Date.parse(t);
    return isNaN(n) ? Date.now() : n;
  }

  function lsGet(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v == null ? fallback : v;
    } catch (_) { return fallback; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (_) {}
  }

  // ── 1. Session restore ─────────────────────────────────────────────
  // Returns true if the session cache changed (warrants a reload so the
  // React Root re-reads AuthAPI.current()).
  async function syncSession() {
    var session = null;
    try {
      var r = await sb.auth.getSession();
      session = r && r.data ? r.data.session : null;
    } catch (_) { return false; }

    var cache = window.AuthAPI.current();

    if (session && session.user) {
      var u = session.user;
      var name = (u.user_metadata && u.user_metadata.name) ||
                 (u.email ? u.email.split("@")[0] : "Usuario");
      if (!cache || cache.kind !== "user" || cache.email !== u.email) {
        window.AuthAPI.setSession({ name: name, email: u.email, kind: "user", uid: u.id });
        window.AuthAPI._rememberMember(name, u.email);
        return true;
      }
      // keep uid fresh without forcing a reload
      if (cache && !cache.uid) {
        window.AuthAPI.setSession({ name: cache.name, email: cache.email, kind: "user", uid: u.id });
      }
      return false;
    }

    // No Supabase session: drop a stale logged-in cache (guest is kept).
    if (cache && cache.kind === "user") {
      window.AuthAPI.setSession(null);
      return true;
    }
    return false;
  }

  // ── 2a. Profile hydrate ────────────────────────────────────────────
  async function hydrateProfile(uid, email) {
    if (!uid || !email) return false;
    try {
      var r = await sb.from("user_profiles")
        .select("bio, avatar_url, banner").eq("id", uid).maybeSingle();
      if (r.error || !r.data) return false;
      var key = "aletheia.profile." + email;
      var cur = lsGet(key, {});
      var next = {
        bio: r.data.bio || cur.bio || "",
        avatar: r.data.avatar_url || cur.avatar || null,
        banner: r.data.banner || cur.banner || undefined,
        score: cur.score != null ? cur.score : 10,
      };
      lsSet(key, next);
      return JSON.stringify(cur) !== JSON.stringify(next);
    } catch (_) { return false; }
  }

  // ── 2b. Stars hydrate ──────────────────────────────────────────────
  async function hydrateStars(uid, email) {
    if (!uid || !email) return false;
    try {
      var r = await sb.from("country_follows")
        .select("iso3, country_name, region, created_at").eq("user_id", uid);
      if (r.error || !r.data) return false;
      var map = {};
      r.data.forEach(function (row) {
        map[row.iso3] = {
          iso3: row.iso3,
          name: row.country_name || row.iso3,
          region: row.region || "",
          starredAt: ms(row.created_at),
        };
      });
      var key = "aletheia.stars." + email;
      var cur = lsGet(key, {});
      lsSet(key, map);
      return JSON.stringify(cur) !== JSON.stringify(map);
    } catch (_) { return false; }
  }

  // ── 2c. Forum hydrate (public read; works for guests too) ──────────
  async function hydrateForum() {
    try {
      var th = await sb.from("forum_threads")
        .select("id, client_id, title, subtitle, iso3, country_name, region, scope, subtype, year")
        .not("client_id", "is", null).limit(2000);
      if (th.error || !th.data || !th.data.length) return false;

      var clientByUuid = {};
      var userThreads = lsGet("aletheia.forum.user_threads", []);
      var utIds = {};
      userThreads.forEach(function (t) { utIds[t.id] = true; });
      var changed = false;

      th.data.forEach(function (row) {
        clientByUuid[row.id] = row.client_id;
        // Re-materialize user-created threads into the local index.
        if (String(row.client_id).indexOf("user-") === 0 && !utIds[row.client_id]) {
          userThreads.push({
            id: row.client_id,
            iso3: row.iso3,
            country: row.country_name,
            region: row.region,
            scope: row.scope || "tema",
            subtype: row.subtype || "news",
            title: row.title,
            subtitle: row.subtitle || "",
            year: row.year != null ? row.year : null,
            userCreated: true,
            createdAt: Date.now(),
          });
          utIds[row.client_id] = true;
          changed = true;
        }
      });
      if (changed) lsSet("aletheia.forum.user_threads", userThreads);

      var po = await sb.from("forum_posts")
        .select("client_id, parent_client_id, thread_id, body, author_name, author_handle, author_accent, author_kind, likes, created_at")
        .not("client_id", "is", null).limit(5000);
      if (po.error || !po.data) return changed;

      var byThread = {};
      po.data.forEach(function (p) {
        var cid = clientByUuid[p.thread_id];
        if (!cid) return;
        (byThread[cid] = byThread[cid] || []).push(p);
      });

      Object.keys(byThread).forEach(function (cid) {
        var key = "aletheia.forum.thread." + cid;
        var posts = lsGet(key, []);
        if (!Array.isArray(posts)) posts = [];
        var have = {};
        posts.forEach(function (p) { have[p.id] = true; });
        byThread[cid].forEach(function (p) {
          if (have[p.client_id]) return;
          posts.push({
            id: p.client_id,
            parentId: p.parent_client_id || null,
            user: p.author_name || "Usuario",
            handle: p.author_handle || "@usuario",
            accent: p.author_accent || "#facc15",
            kind: p.author_kind || "user",
            text: p.body || "",
            ts: ms(p.created_at),
            likes: p.likes || 0,
          });
          changed = true;
        });
        posts.sort(function (a, b) { return a.ts - b.ts; });
        lsSet(key, posts);
      });

      return changed;
    } catch (_) { return false; }
  }

  // ── 3. Write mirrors (best-effort, never throw) ────────────────────
  async function dbThreadIdByClient(clientId) {
    var r = await sb.from("forum_threads").select("id").eq("client_id", clientId).maybeSingle();
    return r && r.data ? r.data.id : null;
  }

  async function ensureThreadRow(clientId) {
    var existing = await dbThreadIdByClient(clientId);
    if (existing) return existing;
    // Pull metadata from the (already opened) local thread.
    var meta = null;
    try {
      var bundle = window.ForumAPI.getThread(clientId);
      meta = bundle && bundle.thread ? bundle.thread : null;
    } catch (_) {}
    var uid = await getUid();
    var payload = {
      client_id: clientId,
      title: (meta && meta.title) || clientId,
      subtitle: (meta && meta.subtitle) || null,
      iso3: meta && meta.iso3 || null,
      country_name: meta && meta.country || null,
      region: meta && meta.region || null,
      scope: (meta && meta.scope) || "tema",
      subtype: (meta && meta.subtype) || null,
      year: meta && meta.year != null ? meta.year : null,
      author_id: uid,
      body: (meta && meta.subtitle) || "",
    };
    var ins = await sb.from("forum_threads")
      .upsert(payload, { onConflict: "client_id" }).select("id").maybeSingle();
    return ins && ins.data ? ins.data.id : null;
  }

  async function mirrorCreateThread(thread) {
    if (!currentUser()) return;
    try { await ensureThreadRow(thread.id); }
    catch (e) { console.warn("[cloud-sync] createThread mirror failed", e); }
  }

  async function mirrorAddPost(threadId, post) {
    var u = currentUser();
    if (!u) return; // guests are read-only
    try {
      var dbThreadId = await ensureThreadRow(threadId);
      if (!dbThreadId) return;
      var uid = await getUid();
      await sb.from("forum_posts").insert({
        client_id: post.id,
        parent_client_id: post.parentId || null,
        thread_id: dbThreadId,
        body: post.text,
        author_id: uid,
        author_name: post.user,
        author_handle: post.handle,
        author_accent: post.accent,
        author_kind: post.kind || "user",
      });
    } catch (e) { console.warn("[cloud-sync] addPost mirror failed", e); }
  }

  async function mirrorLike(postId, delta) {
    var u = currentUser();
    if (!u) return;
    if (String(postId).indexOf("u-") !== 0) return; // only persisted user posts
    try {
      var pr = await sb.from("forum_posts").select("id").eq("client_id", postId).maybeSingle();
      if (!pr.data) return;
      var uid = await getUid();
      if (delta > 0) {
        await sb.from("post_likes")
          .upsert({ post_id: pr.data.id, user_id: uid }, { onConflict: "user_id,post_id" });
      } else {
        await sb.from("post_likes").delete()
          .eq("post_id", pr.data.id).eq("user_id", uid);
      }
    } catch (e) { console.warn("[cloud-sync] like mirror failed", e); }
  }

  async function mirrorStarToggle(prevKeys, country) {
    var u = currentUser();
    if (!u) return;
    try {
      var uid = await getUid();
      var iso = country.iso3;
      var wasStarred = prevKeys.indexOf(iso) !== -1;
      if (!wasStarred) {
        await sb.from("country_follows").upsert({
          user_id: uid, iso3: iso,
          country_name: country.name, region: country.region,
        }, { onConflict: "user_id,iso3" });
      } else {
        await sb.from("country_follows").delete()
          .eq("user_id", uid).eq("iso3", iso);
      }
    } catch (e) { console.warn("[cloud-sync] star mirror failed", e); }
  }

  async function mirrorProfileSave(email, data) {
    var u = currentUser();
    if (!u) return;
    try {
      var uid = await getUid();
      if (!uid) return;
      await sb.from("user_profiles").update({
        bio: data.bio || null,
        avatar_url: data.avatar || null,
        banner: data.banner || null,
      }).eq("id", uid);
    } catch (e) { console.warn("[cloud-sync] profile mirror failed", e); }
  }

  // ── attach mirrors (idempotent) ────────────────────────────────────
  function attachMirrors() {
    if (window.__aletheiaMirrors) return;
    window.__aletheiaMirrors = true;

    if (window.ForumAPI) {
      var _add = window.ForumAPI.addPost.bind(window.ForumAPI);
      window.ForumAPI.addPost = function (threadId, user, text, parentId) {
        var post = _add(threadId, user, text, parentId);
        if (post) mirrorAddPost(threadId, post);
        return post;
      };
      var _create = window.ForumAPI.createThread.bind(window.ForumAPI);
      window.ForumAPI.createThread = function (spec) {
        var thread = _create(spec);
        if (thread) mirrorCreateThread(thread);
        return thread;
      };
      var _like = window.ForumAPI.like.bind(window.ForumAPI);
      window.ForumAPI.like = function (threadId, postId, delta) {
        _like(threadId, postId, delta);
        mirrorLike(postId, delta == null ? 1 : delta);
      };
    }

    if (window.StarAPI) {
      var _toggle = window.StarAPI.toggle.bind(window.StarAPI);
      window.StarAPI.toggle = function (email, country) {
        var prevKeys = Object.keys(window.StarAPI.get(email) || {});
        var res = _toggle(email, country);
        mirrorStarToggle(prevKeys, country);
        return res;
      };
    }

    if (window.ProfileAPI) {
      var _save = window.ProfileAPI.save.bind(window.ProfileAPI);
      window.ProfileAPI.save = function (email, data) {
        _save(email, data);
        mirrorProfileSave(email, data);
      };
    }
  }

  // ── boot ───────────────────────────────────────────────────────────
  async function hydrateAll() {
    var u = currentUser();
    var uid = u ? await getUid() : null;
    var email = u ? u.email : null;
    var results = await Promise.all([
      hydrateForum(),
      uid ? hydrateProfile(uid, email) : Promise.resolve(false),
      uid ? hydrateStars(uid, email) : Promise.resolve(false),
    ]);
    return results.some(Boolean);
  }

  async function boot() {
    attachMirrors();
    var booted = sessionStorage.getItem(BOOT_FLAG) === "1";

    if (booted) {
      // Already reloaded once this tab session: silently refresh the
      // local cache; UI picks it up on next navigation/interaction.
      try { await syncSession(); await hydrateAll(); } catch (_) {}
      return;
    }

    sessionStorage.setItem(BOOT_FLAG, "1");
    var sessChanged = false, pulled = false;
    try { sessChanged = await syncSession(); } catch (_) {}
    try { pulled = await hydrateAll(); } catch (_) {}

    // One reload so the mounted React app re-reads fresh localStorage.
    if (sessChanged || pulled) {
      try { location.reload(); } catch (_) {}
    }

    // Keep the session cache in step with future auth changes.
    sb.auth.onAuthStateChange(function (_evt, _session) {
      syncSession().catch(function () {});
    });
  }

  boot();
})();
