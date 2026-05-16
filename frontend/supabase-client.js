// supabase-client.js — single Supabase JS client for the whole app.
// Loaded as a plain <script> AFTER the supabase-js UMD CDN bundle and
// BEFORE data.js, so window.sb exists before any API module runs.
//
// The publishable key is public by design: security is enforced by
// Postgres Row Level Security (see supabase/migrations/005_*.sql),
// never by hiding this key.

(function () {
  var SUPABASE_URL = "https://yiqxyfesywdswtcjaqeq.supabase.co";
  var SUPABASE_KEY = "sb_publishable_7opBFWWoZFJ66qOinh1eFg_aWQd1er_";

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("[supabase] UMD bundle not loaded — cloud sync disabled.");
    window.sb = null;
    return;
  }

  window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "aletheia.sb.auth",
    },
  });
})();
