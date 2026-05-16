// Auth — pantalla de inicio de sesión / registro / invitado.
// Es un prototipo: las credenciales se guardan en localStorage en TEXTO PLANO.
// Para producción, esto debe ir contra un backend real con hash + sesión.

const STORAGE_USERS = "alethia.users";
const STORAGE_SESSION = "alethia.session";

window.AuthAPI = {
  current() {
    try { return JSON.parse(localStorage.getItem(STORAGE_SESSION)) || null; }
    catch (_) { return null; }
  },
  setSession(user) {
    if (user) localStorage.setItem(STORAGE_SESSION, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_SESSION);
  },
  users() {
    try { return JSON.parse(localStorage.getItem(STORAGE_USERS)) || []; }
    catch (_) { return []; }
  },
  saveUsers(list) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(list));
  },
  login(email, password) {
    const u = this.users().find(x => x.email.toLowerCase() === email.toLowerCase());
    if (!u) return { ok: false, error: "No existe una cuenta con ese correo." };
    if (u.password !== password) return { ok: false, error: "Contraseña incorrecta." };
    const session = { name: u.name, email: u.email, kind: "user" };
    this.setSession(session);
    return { ok: true, user: session };
  },
  register(name, email, password) {
    if (name.trim().length < 2) return { ok: false, error: "Ingresa tu nombre." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Correo no válido." };
    if (password.length < 6) return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };
    const list = this.users();
    if (list.some(x => x.email.toLowerCase() === email.toLowerCase()))
      return { ok: false, error: "Ya existe una cuenta con ese correo." };
    list.push({ name: name.trim(), email: email.trim(), password, createdAt: new Date().toISOString() });
    this.saveUsers(list);
    const session = { name: name.trim(), email: email.trim(), kind: "user" };
    this.setSession(session);
    return { ok: true, user: session };
  },
  asGuest() {
    const session = { name: "Invitado", email: null, kind: "guest" };
    this.setSession(session);
    return session;
  },
  logout() { this.setSession(null); },
};

function AuthScreen({ onAuth }) {
  const [tab, setTab] = React.useState("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [remember, setRemember] = React.useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    let result;
    if (tab === "login") {
      result = window.AuthAPI.login(email, password);
    } else {
      result = window.AuthAPI.register(name, email, password);
    }
    if (!result.ok) { setError(result.error); return; }
    onAuth(result.user);
  };

  const handleGuest = () => {
    const user = window.AuthAPI.asGuest();
    onAuth(user);
  };

  return (
    <div className="auth-stage">
      <div className="auth-hero">
        <div className="ah-brand">
          <div className="ah-logo">Alethia</div>
          <div className="ah-tagline">Índice ilustrativo · Periodismo de datos</div>
        </div>
        <div className="ah-headline">
          <h2>La corrupción no es una cifra. <span style={{ color: "var(--text-3)" }}>Es una conversación que empieza aquí.</span></h2>
          <p>
            Explora el mapa interactivo de América con datos ilustrativos: rankings,
            comparativas, evolución temporal, fichas de país con presidente, gabinete y
            titulares de prensa. Pensado para investigar, contrastar y entender.
          </p>
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
        <div className="ah-foot">© Alethia · Datos ficticios con fines demostrativos</div>
      </div>

      <div className="auth-form">
        <div className="af-wrap">
          <div className="af-kicker">Acceso</div>
          <h1 className="af-title">
            {tab === "login" ? "Bienvenido de vuelta." : "Crea tu cuenta."}
          </h1>

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

            <button type="submit" className="auth-submit">
              {tab === "login" ? "Ingresar" : "Crear cuenta"}
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
