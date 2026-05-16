// Auth — pantalla de inicio de sesión / registro / invitado.
// Backed by Supabase Auth (email/password). A small synchronous session
// cache in localStorage ('aletheia.session') lets the React tree read the
// current user without awaiting; cloud-sync.js keeps it in step with the
// real Supabase session on load. Guest = local-only, read-only.

const STORAGE_USERS = "aletheia.users";
const STORAGE_SESSION = "aletheia.session";

function _displayNameFrom(name, email) {
  if (name && name.trim()) return name.trim();
  if (email) return email.split("@")[0];
  return "Usuario";
}

window.AuthAPI = {
  // Synchronous: reads the cached session written by login/register or
  // by cloud-sync.js after restoring the Supabase session on reload.
  current() {
    try { return JSON.parse(localStorage.getItem(STORAGE_SESSION)) || null; }
    catch (_) { return null; }
  },

  setSession(user) {
    if (user) {
      try {
        localStorage.setItem(STORAGE_SESSION, JSON.stringify(user));
      } catch (e) {
        if (e.name === "QuotaExceededError") {
          const drop = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith("aletheia.forum.thread.")) drop.push(k);
          }
          drop.forEach(k => localStorage.removeItem(k));
          localStorage.removeItem("aletheia.forum.seedv");
          try { localStorage.setItem(STORAGE_SESSION, JSON.stringify(user)); } catch (_) {}
        }
      }
    } else {
      localStorage.removeItem(STORAGE_SESSION);
    }
  },

  // Local "members since" cache (read by profile.jsx). No passwords.
  users() {
    try { return JSON.parse(localStorage.getItem(STORAGE_USERS)) || []; }
    catch (_) { return []; }
  },
  saveUsers(list) {
    try { localStorage.setItem(STORAGE_USERS, JSON.stringify(list)); } catch (_) {}
  },
  _rememberMember(name, email) {
    if (!email) return;
    const list = this.users();
    if (!list.some(x => x.email && x.email.toLowerCase() === email.toLowerCase())) {
      list.push({ name, email, createdAt: new Date().toISOString() });
      this.saveUsers(list);
    }
  },

  async login(email, password) {
    if (!window.sb) return { ok: false, error: "Servicio no disponible. Reintenta." };
    const { data, error } = await window.sb.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error || !data?.user) {
      return { ok: false, error: "Correo o contraseña incorrectos." };
    }
    const name = _displayNameFrom(
      data.user.user_metadata?.name, data.user.email
    );
    const session = { name, email: data.user.email, kind: "user", uid: data.user.id };
    this.setSession(session);
    this._rememberMember(name, data.user.email);
    return { ok: true, user: session };
  },

  async register(name, email, password) {
    if (name.trim().length < 2) return { ok: false, error: "Ingresa tu nombre." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Correo no válido." };
    if (password.length < 6) return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };
    if (!window.sb) return { ok: false, error: "Servicio no disponible. Reintenta." };

    const clean = email.trim();
    const { data, error } = await window.sb.auth.signUp({
      email: clean,
      password,
      options: { data: { name: name.trim() } },
    });
    if (error) {
      const msg = /already registered/i.test(error.message || "")
        ? "Ya existe una cuenta con ese correo."
        : (error.message || "No se pudo crear la cuenta.");
      return { ok: false, error: msg };
    }

    // If email confirmation is enabled, signUp returns no session — try a
    // direct sign-in so the demo flow continues without an inbox round-trip.
    let user = data?.session ? data.user : null;
    if (!user) {
      const r = await window.sb.auth.signInWithPassword({ email: clean, password });
      if (r.error || !r.data?.user) {
        return {
          ok: false,
          error: "Cuenta creada. Confirma tu correo para iniciar sesión.",
        };
      }
      user = r.data.user;
    }

    const session = { name: name.trim(), email: clean, kind: "user", uid: user.id };
    this.setSession(session);
    this._rememberMember(name.trim(), clean);
    return { ok: true, user: session };
  },

  asGuest() {
    const session = { name: "Invitado", email: null, kind: "guest" };
    this.setSession(session);
    return session;
  },

  async logout() {
    this.setSession(null);
    try { window.sb && await window.sb.auth.signOut(); } catch (_) {}
  },
};

function AuthScreen({ onAuth }) {
  const [tab, setTab] = React.useState("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const result = tab === "login"
        ? await window.AuthAPI.login(email, password)
        : await window.AuthAPI.register(name, email, password);
      if (!result.ok) { setError(result.error); return; }
      onAuth(result.user);
    } catch (err) {
      setError("Error de conexión. Reintenta.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = () => {
    const user = window.AuthAPI.asGuest();
    onAuth(user);
  };

  const AnimSplitText = window.AnimSplitText;

  return (
    <div className="auth-stage">
      {window.WorldMapBg && <window.WorldMapBg />}
      <div className="auth-hero">
        <div className="ah-brand">
          {AnimSplitText
            ? <AnimSplitText text="Aletheia" tag="div" className="ah-logo" splitType="chars" stagger={55} duration={0.8} animDelay={0.1} textAlign="left" from={{ opacity: 0, y: 18 }} to={{ opacity: 1, y: 0 }} />
            : <div className="ah-logo">Aletheia</div>
          }
          {AnimSplitText
            ? <AnimSplitText text="Índice ilustrativo · Periodismo de datos" tag="div" className="ah-tagline" splitType="words" stagger={60} duration={0.7} animDelay={0.55} textAlign="left" from={{ opacity: 0 }} to={{ opacity: 1 }} />
            : <div className="ah-tagline">Índice ilustrativo · Periodismo de datos</div>
          }
        </div>
        <div className="ah-headline">
          {AnimSplitText ? (
            <>
              <AnimSplitText text="La corrupción no es una cifra." tag="h2" splitType="words" stagger={65} duration={1} animDelay={0.9} textAlign="left" from={{ opacity: 0, y: 22 }} to={{ opacity: 1, y: 0 }} />
              <AnimSplitText text="Es una conversación que empieza aquí." tag="h2" className="ah-h2-sub" splitType="words" stagger={65} duration={1} animDelay={1.3} textAlign="left" from={{ opacity: 0, y: 22 }} to={{ opacity: 1, y: 0 }} />
              <AnimSplitText text="Explora el mapa interactivo de América con datos ilustrativos: rankings, comparativas, evolución temporal, fichas de país con presidente, gabinete y titulares de prensa. Pensado para investigar, contrastar y entender." tag="p" splitType="words" stagger={18} duration={0.8} animDelay={1.7} textAlign="left" from={{ opacity: 0, y: 10 }} to={{ opacity: 1, y: 0 }} />
            </>
          ) : (
            <>
              <h2>La corrupción no es una cifra. <span style={{ color: "var(--text-3)" }}>Es una conversación que empieza aquí.</span></h2>
              <p>Explora el mapa interactivo de América con datos ilustrativos: rankings, comparativas, evolución temporal, fichas de país con presidente, gabinete y titulares de prensa. Pensado para investigar, contrastar y entender.</p>
            </>
          )}
        </div>
        <div className="ah-stats">
          <div className="ah-stat">
            <div className="lb">Países</div>
            <div className="vl">29</div>
          </div>
          <div className="ah-stat">
            <div className="lb">Años</div>
            <div className="vl">10</div>
          </div>
          <div className="ah-stat">
            <div className="lb">Regiones</div>
            <div className="vl">4</div>
          </div>
        </div>
        <div className="ah-foot">© Aletheia · Datos ficticios con fines demostrativos</div>
      </div>

      <div className="auth-form">
        <div className="af-wrap">
          {AnimSplitText
            ? <AnimSplitText text="Acceso" tag="div" className="af-kicker" splitType="chars" stagger={45} duration={0.6} animDelay={0.2} textAlign="left" from={{ opacity: 0, y: 8 }} to={{ opacity: 1, y: 0 }} />
            : <div className="af-kicker">Acceso</div>
          }
          {AnimSplitText
            ? <AnimSplitText key={tab} text={tab === "login" ? "Bienvenido de vuelta." : "Crea tu cuenta."} tag="h1" className="af-title" splitType="words" stagger={75} duration={0.85} animDelay={0.05} textAlign="left" from={{ opacity: 0, y: 16 }} to={{ opacity: 1, y: 0 }} />
            : <h1 className="af-title">{tab === "login" ? "Bienvenido de vuelta." : "Crea tu cuenta."}</h1>
          }

          <div className="auth-tabs" role="tablist">
            <button className={tab === "login" ? "active" : ""} onClick={() => { setTab("login"); setError(""); }}>
              Iniciar sesión
            </button>
            <button className={tab === "register" ? "active" : ""} onClick={() => { setTab("register"); setError(""); }}>
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {tab === "register" && (
              <div className="auth-field">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}
            <div className="auth-field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder={tab === "register" ? "Mínimo 6 caracteres" : "•••••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={tab === "register" ? "new-password" : "current-password"}
                required
              />
            </div>

            {error && <div className="auth-error">⚠ {error}</div>}

            <div className="auth-row">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ accentColor: "var(--accent)" }}
                />
                Mantener sesión
              </label>
              {tab === "login" && (
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Recuperación no implementada en esta demo."); }}>
                  ¿Olvidaste la contraseña?
                </a>
              )}
            </div>

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting
                ? "Procesando…"
                : (tab === "login" ? "Ingresar" : "Crear cuenta")}
            </button>
          </form>

          <div className="auth-divider">o bien</div>

          <button className="auth-guest" onClick={handleGuest}>
            Continuar como invitado
          </button>

          <div className="auth-foot">
            <span className="mono">PROTOTIPO</span><br />
            Las credenciales se guardan localmente en este navegador. No envíes datos reales.
          </div>
        </div>
      </div>
    </div>
  );
}

window.AuthScreen = AuthScreen;
