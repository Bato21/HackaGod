# Aletheia · Aquello que no está oculto

> Plataforma de inteligencia cívica global. Convierte datos fiscales,
> índices de transparencia y noticias de medios investigativos en un mapa
> interactivo mundial, rankings comparables, fichas de país con análisis IA,
> foros ciudadanos y señales de riesgo en tiempo real.

🌐 **Producción:**
- Frontend: [aletheia-xi.vercel.app](https://aletheia-xi.vercel.app)
- Backend API: [aletheia-qk3s.onrender.com](https://aletheia-qk3s.onrender.com)
- Base de datos: Supabase (`yiqxyfesywdswtcjaqeq`)

---

## 1. Contexto y misión

El acceso a información sobre corrupción institucional existe — el problema es que está fragmentado. Hay CPI de Transparency International, hay datos de gasto público de ministerios de hacienda, hay noticias de medios independientes, hay historiales de presidencias. Pero no hay una herramienta que lo cruce todo, lo contextualice históricamente y lo haga legible en 30 segundos para cualquier ciudadano, sin importar en qué país viva.

**Aletheia** responde a esa brecha. El nombre viene del griego ἀλήθεια — *aquello que no está oculto*. La plataforma cubre países de todo el mundo, con profundidad especial en América Latina donde la densidad de datos históricos y fuentes investigativas es mayor.

Preguntas que responde:

- ¿Cómo está mi país en transparencia comparado con el resto del mundo?
- ¿Quién gobernaba cuando el índice subió o cayó?
- ¿Qué señales de riesgo detectó el pipeline de inteligencia esta semana?
- ¿Por qué exactamente está mi país en ese nivel de corrupción percibida?
- ¿Qué piensan otros ciudadanos sobre los hechos?

La plataforma **no acusa, no condena, no atribuye responsabilidad personal**. Agrega fuentes públicas y verificadas, las cruza con análisis de IA y deja que el lector saque conclusiones con evidencia a mano.

---

## 2. Funcionalidades

### Mapa mundial interactivo + globo 3D

- **Mapa Leaflet 2D** coloreado por **Aletheia Score** (derivado del CPI de Transparency International: 100 = muy corrupto, 0 = transparente).
- **Globo ortográfico D3** arrastrable y rotable — vista alternativa para perspectiva global.
- Selector de año (2017–2025) que actualiza colores, ranking y análisis IA en tiempo real.
- **Triángulos de alerta (▲)** sobre países con señales activas, animados con ondas radar, color por intensidad (amarillo → naranja → rojo → crítico).
- Cobertura global: países de todos los continentes con datos disponibles de Transparency International.

### Ficha de país

- Población por año (2017–2025) con tendencia demográfica.
- Descripción geográfica y socioeconómica.
- Aletheia Score con histórico y posición en ranking mundial.
- Presidencia activa con aprobación, partido e ideología política.
- Gabinete ministerial con carteras y posición ideológica cuando hay datos.
- **🤖 Análisis Aletheia · IA** — generado por Claude Sonnet 4 vía OpenRouter. Explica *por qué* el país está en su estado actual: **✅ Lo bueno · ⚠️ Lo problemático · 📊 Lectura general**, citando cifras concretas y posición en el ranking. Cacheado 6 horas por `(iso3, year)`.

### Noticias e inteligencia de señales

- Rail con 3 categorías: **Corrupción · Política · Gobierno**.
- Datos reales de `news_events` en Supabase, clasificados por país con clasificador determinista (gazetteer + alias de organizaciones y ciudades).
- Señales de riesgo activas aparecen como ítem destacado en Corrupción, con nivel (`▲ RIESGO CRÍTICO (92%) — Captura institucional`).
- Click en triángulo del mapa abre modal con las 3 categorías y badge de nivel de riesgo.
- Resúmenes limpios: `risk-override.js` normaliza los dos formatos de `claude_summary` que llegan del pipeline (JSON con justificación + Markdown puro).

### Foro ciudadano

- Hilos públicos por país o globales, con alcance (`país / gobierno / tema`).
- Filtros por región, país, año y nivel de alerta.
- Creación de nuevo hilo con formulario modal.
- Actualizaciones en tiempo real vía Supabase Realtime (WebSocket).
- Sistema de likes con constraint UNIQUE en DB + trigger de sincronización.

### Chatbot IA "aletheIA"

- Búho flotante con drag, resize y dock.
- Modelo **Claude Haiku 4.5** vía OpenRouter.
- Acceso a CPI histórico, presidentes, gasto público y ranking regional.
- Las respuestas siguen el **año seleccionado** por el usuario y lo citan explícitamente.
- Detecta códigos ISO3 en respuestas y los convierte en links clickables sobre el mapa.

### Onboarding guiado

- WelcomeModal al primer login (registrado o invitado).
- Tour de **35 pasos en 9 secciones**: Bienvenida, Mapa, Panel, País, Opciones, Foro, Filtros, Crear hilo, Chat — con spotlights interactivos.
- Botón de Ayuda en topbar reabre el tour en cualquier momento.

---

## 3. Arquitectura técnica

### Stack

```
[React SPA (Vercel)] ←──HTTPS──→ [FastAPI (Render/Docker)] ←──asyncpg──→ [Supabase PostgreSQL 15]
        ↑                                    ↑
 Supabase Realtime                    OpenRouter gateway
 (WebSocket, foro)               ┌────────────┴─────────────────┐
                            Claude Haiku 4.5            Claude Sonnet 4
                              (chatbot)                (análisis país)
```

| Capa | Tecnología | Decisión de diseño |
|---|---|---|
| Frontend | React 18 + Babel standalone (CDN), Leaflet 1.9, D3 v7, GSAP | Sin build step; cualquier hosting estático sirve la app. `app.jsx` se transpila en el navegador. |
| Backend | FastAPI + uvicorn + httpx + SQLAlchemy asyncpg | Async-first, autodoc OpenAPI, healthcheck y CORS regex para preview deploys. |
| DB | Supabase PostgreSQL 15 + RLS + RPC `SECURITY DEFINER` | Datos vía funciones RPC con `GRANT EXECUTE TO anon` sin tocar GRANTs de tabla directamente. |
| Modelos IA | OpenRouter (gateway unificado) | Un proveedor para todas las llamadas. Cambias modelo con env var, sin redeploy de código. |
| Hosting frontend | Vercel | Push a `main` = deploy automático. Headers de seguridad en `vercel.json`. |
| Hosting backend | Render (free tier) | `fetchWithRetry` con backoff de 4s en frontend soporta cold starts de 30–50s. |
| Auth | Supabase Auth + modo invitado local | Invitados: read-only. RLS gobierna qué filas se transmiten. |
| Sync | `cloud-sync.js` + `*-override.js` síncronos + hooks `useXVersion()` | Caché localStorage hidratado en boot → fetch async → bump versión → React re-renderiza. |

### Esquema de base de datos (5 migraciones)

| Migración | Contenido |
|---|---|
| `001_schema_fixes.sql` | `countries` (22 filas, ISO codes + coordenadas), `presidents` (377 filas, 2017–presente), `public_expenditures` (~640k filas, pivot ancho→largo, 2017–2025) |
| `002_aletheia_core.sql` | `iea_scores`, `news_events`, `risk_signals`, `forum_threads`, `forum_posts` + 4 vistas analíticas |
| `003_mistral_dynamic.sql` | `country_profiles`, `fact_checks`, `investigation_runs`, `source_reputation`, `signal_health` (GIN indexes en jsonb), `pattern_links` |
| `004_functions_triggers.sql` | `fn_compute_iea()`, `fn_batch_compute_iea()`, `sp_populate_iea_scores()`, `fn_detect_expenditure_anomalies()`. Triggers: `updated_at` auto-update, signal_health auto-init, `fn_sync_post_likes()` |
| `005_frontend_community_layer.sql` | `user_profiles`, `country_follows`, `post_likes` (UNIQUE user×post), campos de deduplicación cliente en `forum_posts` |

### Cómputo del IEA Score (pure SQL, sin IA)

4 pilares ponderados:
- Disciplina fiscal: 30%
- Inversión social: 35%
- Transparencia de datos: 20%
- Estabilidad sectorial: 15%

Preferencia de escala: `pct_gdp` → fallback `millions` (nunca mezcla escalas en un mismo cómputo). Devuelve `jsonb` con `iea_score`, `pillar_scores`, `bic_score`, `bic_low`, `bic_high`, `bic_volatility`.

**BIC (Baseline Integrity Confidence):** banda ±3 (bajo riesgo), ±6 (medio), ±12 (alto). El investigador Mistral la ensancha según densidad de señales y severidad de riesgos.

**Decay de señales:** `signal_health.severity_decay = 0.1/día` sin refuerzo. Auto-resolución cuando severidad ≤ 1 y edad > 30 días.

---

## 4. Pipeline de inteligencia: Aletheia en Make.com

Este es el corazón del sistema de noticias en tiempo real. Make.com corre **cada hora**, iterando sobre **37 fuentes RSS de medios investigativos** a nivel mundial (con densidad mayor en LATAM). Por cada noticia, ejecuta tres llamadas a **Mistral vía OpenRouter** en secuencia:

```
RSS feed (37 fuentes) → Make.com (cadencia horaria)
        │
        ├─ Agente Detector  (Mistral)  → identifica país protagonista
        ├─ Clasificador     (Mistral)  → asigna risk_score + pattern_code
        └─ Sintetizador     (Mistral)  → genera reporte Markdown
                │
                ├─ text-embedding-3-small → vectores 1536 dimensiones
                │
                └─→ Supabase REST (service_role)
                        ├─ news_events        (embedding + entidades)
                        ├─ risk_signals       (clasificación + reporte)
                        ├─ forum_threads      (auto-generados, Realtime)
                        └─ signal_evidence    (señal ↔ artículo fuente)
```

**Por qué Make y no webhooks directos:**
Make provee retry logic, manejo de errores con backoff visual, y permite que miembros no técnicos del equipo modifiquen condiciones de trigger. Desacopla la detección de señales de la latencia de generación de insights.

**Limitación conocida:** el clasificador actual etiqueta algunos `news_events` y `risk_signals` con `country_id` incorrecto (frecuente fallo: todo → Chile). `etl_news_classify.py` reasigna `news_events` post-hoc con un clasificador determinista (gazetteer + alias de organizaciones criminales/ciudades, scoring por URL > alias > entities > topics > headline). Falta el equivalente para `risk_signals`.

**Búsqueda semántica:** los vectores de `text-embedding-3-small` (1536 dimensiones) persisten en `news_events.embedding` con índice vectorial en Supabase, habilitando búsqueda por similitud semántica — no solo por keyword.

---

## 5. Agentes IA (arquitectura completa)

### Activos (OpenRouter vía backend FastAPI)

| Endpoint | Modelo | Propósito |
|---|---|---|
| `POST /api/v1/chat` | `anthropic/claude-haiku-4-5` | Chatbot conversacional con contexto DB + año seleccionado |
| `POST /api/v1/country/analyze` | `anthropic/claude-sonnet-4` | Análisis estructurado (Lo bueno / Lo problemático / Lectura general), cacheado 6h |
| `POST /api/v1/briefings/generate` | mock | Placeholder pipeline multi-agente (Scout → Analyst → Pattern → Researcher → Validator → Writer) |

### Planificados (Mistral vía OpenRouter)

| Alias | Modelo | Caso de uso |
|---|---|---|
| MISTRAL_FAST | `mistralai/mistral-small` | Fact-Checker, investigación ligera |
| MISTRAL_BALANCED | `mistralai/mistral-nemo` | Insight Engine (salida multilingüe, español) |
| MISTRAL_POWERFUL | `mistralai/mistral-large` | Investigación profunda, análisis de patrones estructurales |

**Fact-Checker** — se activa en cada ingesta de artículo: verifica validez institucional, legislativa y estadística; cuenta artículos corroborantes en `news_events` (últimas 48h); emite `fact_checks` con `overall_confidence` y `verdict`; actualiza `source_reputation` con weighted average.

**Investigador Periódico:**

| Modo | Cadencia | Modelo | Acción |
|---|---|---|---|
| Light | Cada 6h | mistral-small | Pull GDELT → clasificar → fact-check → recalcular BIC |
| Deep | Cada 72h | mistral-large | Ventana 7 días → sintetizar → escribir `country_profiles` |
| Structural | Semanal | mistral-large | Análisis cross-country → escribir `pattern_links` |

**Insight Engine** — trigger: Make.com tras creación de señal o cambio en BIC. Modelo: mistral-nemo (salida en español). Output: `{ headline, context, significance, three_to_watch[], forum_title, alert_level }`. Auto-crea fila en `forum_threads`.

---

## 6. ETL Pipeline (Python)

| Script | Qué hace |
|---|---|
| `etl_load_excel.py` | Dataset base (`BASE_COMPLETA_CORREGIDA_CON_TODOS_LOS_DATOS.xlsx`) → `countries`, `presidents`, `public_expenditures`. 500 filas/batch, idempotente. |
| `etl_cpi.py` | CPI de Transparency International (2017–2025) → `cpi_scores`. Aletheia Score = 100 − CPI. |
| `etl_presidents.py` | Presidentes 2017–presente con partido, ideología y sistema político. |
| `etl_cabinet.py` | Gabinetes ministeriales con carteras y posición ideológica. |
| `etl_population.py` | Lee `PAISES_BASE_POBLACION_DESCRIPCION.xlsx`, mapea nombres EN→iso3, genera `frontend/population-data.js` estático. |
| `etl_milestones.py` | Hitos históricos por país y año. |
| `etl_news_classify.py` | Clasificador determinista: reasigna `country_id` de `news_events` mal etiquetados. Scoring: URL > alias > entities > topics > headline. Idempotente. |
| `etl_full_2026.py` | Refresh anual completo (todos los scripts + indicadores + metodologías). |

Fuente primaria: `BASE_COMPLETA_CORREGIDA_CON_TODOS_LOS_DATOS.xlsx` (~640k filas, 20+ países, 2017–2025). Todos los upserts usan `on_conflict` — seguros para re-ejecución.

---

## 7. Frontend (archivos clave)

```
frontend/
├── index.html              # Punto de entrada — carga React/Babel/Leaflet/D3/GSAP + scripts
├── app.jsx                 # Componente raíz: mapa, ficha, ranking, dashboard
├── chatbot.jsx             # Búho flotante alethIA (drag, resize, dock)
├── auth.jsx                # Modal login/registro + modo invitado
├── forum.jsx               # Foro: hilos, filtros, crear hilo, Realtime
├── profile.jsx             # Perfil de usuario (avatar, bio, banner)
├── world-map-bg.jsx        # Globo ortográfico D3 (fondo animado)
├── split-text.jsx          # Animaciones de texto con GSAP
├── CardNav.jsx / PillNav.jsx  # Componentes de navegación reutilizables
├── tweaks-panel.jsx        # Panel de ajustes de paleta y opciones de mapa
├── cloud-sync.js           # Hidratación async desde Supabase RPC
├── supabase-client.js      # Instancia compartida del cliente Supabase
├── events.js               # Bus de eventos custom para componentes desacoplados
├── data.js                 # Datasets estáticos (países, regiones, etc.)
├── world-data.js           # Datos geopolíticos globales
├── population-data.js      # Generado por etl_population.py
├── news-override.js        # Construye window.ALETHEIA_NEWS + COUNTRY_NEWS
├── risk-override.js        # Construye window.ALETHEIA_RISK + helpers de color/nivel
├── cpi-override.js         # Inyecta CPI real en window.ALETHEIA_CPI
├── presidents-override.js  # Datos de presidentes vía window.ALETHEIA_PRESIDENTS
├── cabinet-override.js     # Gabinetes ministeriales
├── indicators-override.js  # Indicadores económicos y de gobernanza
├── milestones-override.js  # Hitos históricos por país
└── methodology-data.js     # Explicación de metodología del IEA Score
```

### Patrón de integración Supabase → React

1. **RPC `SECURITY DEFINER`** bypasea RLS sin modificar GRANTs de tabla:
   ```sql
   CREATE OR REPLACE FUNCTION get_risk_signals()
   RETURNS TABLE (...) SECURITY DEFINER AS $$ ... $$;
   GRANT EXECUTE ON FUNCTION get_risk_signals() TO anon, authenticated;
   ```
2. **`*-override.js`** síncrono en `index.html` (después de `data.js`, antes de `app.jsx`). Lee `localStorage` del load previo → puebla `window.ALETHEIA_X`. Expone `window.applyXCache(rows)`.
3. **`cloud-sync.js`** ejecuta `sb.rpc("get_x")` async, llama `window.applyXCache(rows)`, persiste en `localStorage`, dispara evento `aletheia:x:loaded`.
4. **`useXVersion()` hook** (`useState` + listener) fuerza re-render cuando llega data nueva sin recargar la página.

### Mapa y visualización

- **Leaflet**: coropleta coloreada por Aletheia Score. 5 paletas: `editorial`, `riesgo`, `vivid`, `diverging`, `mono` (stops RGB en percentiles 0/25/50/75/100).
- **D3 v7**: globo ortográfico arrastrable con topología `countries-110m.json` (TopoJSON).
- **GSAP**: animaciones de triángulos de alerta y onboarding.

---

## 8. Variables de entorno

### Backend (`backend/.env`)
```bash
# Supabase
SUPABASE_URL=https://yiqxyfesywdswtcjaqeq.supabase.co
SUPABASE_KEY=sb_publishable_...
DATABASE_URL=postgresql+asyncpg://postgres.<ref>:<password>@aws-...pooler.supabase.com:6543/postgres

# OpenRouter — credenciales separadas por endpoint (billing y rotación independientes)
OPENROUTER_API_KEY=sk-or-v1-...           # /country/analyze
OPENROUTER_MODEL=anthropic/claude-sonnet-4
OPENROUTER_API_KEY_CHATBOT=sk-or-v1-...   # /chat
OPENROUTER_MODEL_CHATBOT=anthropic/claude-haiku-4-5

# CORS (más cualquier *.vercel.app vía regex)
CORS_ORIGINS=http://localhost:3000,http://localhost:5500
```

### Frontend
```html
<script>window.ALETHEIA_BACKEND_URL = "https://aletheia-qk3s.onrender.com";</script>
```

---

## 9. Cómo correr local

### Backend (FastAPI)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # completar con credenciales reales
uvicorn app.main:app --reload --port 8000
# Swagger UI → http://localhost:8000/docs
```

### Frontend (servidor estático)
```bash
cd frontend
# Editar index.html: window.ALETHEIA_BACKEND_URL = "http://localhost:8000"
python3 -m http.server 5500
# → http://localhost:5500
```

### Migraciones Supabase (en orden)
```
supabase/migrations/
├── 001_schema_fixes.sql
├── 002_aletheia_core.sql
├── 003_mistral_dynamic.sql
├── 004_functions_triggers.sql
└── 005_frontend_community_layer.sql
```
Ejecutar vía Supabase SQL Editor. Luego poblar:
```bash
cd backend && source .venv/bin/activate && set -a && source .env && set +a
python3 etl_load_excel.py
python3 etl_cpi.py
python3 etl_presidents.py
python3 etl_cabinet.py
python3 etl_population.py      # regenera frontend/population-data.js
python3 etl_news_classify.py   # idempotente — reasigna country_id mal etiquetados
```

---

## 10. Seguridad

| Capa | Medida |
|---|---|
| Vercel headers | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cache-Control: no-cache` en HTML/JS/CSS |
| Supabase | RLS en todas las tablas de plataforma. JWT tokens. Frontend nunca tiene service role key. |
| Auth | Modo invitado (`kind: "guest"`) en localStorage: UI enforces read-only, RLS enforces en DB. |
| Backend | CORS allowlist explícita + regex `*.vercel.app`. Docker con usuario no-root. Pydantic valida todo input antes de tocar DB. |
| API keys | Nunca van al frontend. Todas las llamadas a modelos pasan por el backend FastAPI. |
| Cron | `CRON_SECRET` header requerido en todos los endpoints de cron (planificado). |

---

## 11. Deploy

| Servicio | Branch | Build | Trigger |
|---|---|---|---|
| Vercel (frontend) | `main` (`frontend/`) | Estático, sin build step | Push a `main` |
| Render (backend) | `main` (`backend/`) | `pip install -r requirements.txt` + `uvicorn` | Push a `main` |
| Supabase | — | Migraciones SQL manuales | SQL Editor |

**Límite Vercel Hobby:** 100 deploys / 24h — consolidar cambios relacionados en un commit.

**Render free:** cold start 30–50s tras 15 min de inactividad. `fetchWithRetry` con backoff de 4s y mensaje "Despertando servidor…" absorbe la latencia.

---

## 12. Layout del repositorio

```
HackaGod/
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI factory + CORS + lifespan
│   │   ├── config.py                 # Settings (Pydantic BaseSettings)
│   │   ├── database.py               # Async SQLAlchemy engine + asyncpg
│   │   └── routers/
│   │       ├── chat.py               # POST /api/v1/chat
│   │       ├── country_analysis.py   # POST /api/v1/country/analyze
│   │       ├── countries.py          # GET /api/v1/countries, /compare
│   │       └── briefings.py          # POST /api/v1/briefings/generate (mock)
│   ├── etl_*.py                      # Scripts ETL (ver tabla §6)
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .env.example
│
├── frontend/
│   ├── index.html
│   ├── app.jsx, chatbot.jsx, auth.jsx, forum.jsx, profile.jsx
│   ├── world-map-bg.jsx, split-text.jsx, CardNav.jsx, PillNav.jsx, tweaks-panel.jsx
│   ├── *-override.js, cloud-sync.js, supabase-client.js, events.js
│   ├── data.js, world-data.js, population-data.js, methodology-data.js
│   └── vercel.json
│
├── supabase/
│   └── migrations/                   # SQL versionado (001–005)
│
├── nextjs/                           # Plan original Next.js (no activo)
├── Aletheia Plan integral.txt    # Plan estratégico inicial
├── bugs.md                           # Tracker de issues conocidos
└── readMe.md
```

---

## 13. Issues conocidos

Ver `bugs.md` para tracker completo.

- **Clasificación de país en pipeline Make:** etiqueta algunos `news_events` y `risk_signals` con `country_id` incorrecto. `etl_news_classify.py` corrige `news_events` post-hoc; falta equivalente para `risk_signals`.
- **Formatos sucios de `claude_summary`:** llegan en dos formatos (JSON anidado + Markdown puro). `risk-override.js` los normaliza en cliente.
- **Cold start Render:** 30–50s en plan free. Para producción → plan pago o Vercel Functions con Fluid Compute.
- **Babel standalone:** transpilación en navegador es cómoda para prototipo; en producción → compilar con Vite/esbuild para eliminar el overhead de ~300ms del primer render.

---

## 14. Resumen de tecnologías

| Tecnología | Estado | Rol |
|---|---|---|
| Supabase | Activo | PostgreSQL 15, Auth, Realtime WebSocket |
| FastAPI + uvicorn | Activo | REST API, lógica de negocio |
| Claude Haiku 4.5 (OpenRouter) | Activo | Chatbot `/api/v1/chat` |
| Claude Sonnet 4 (OpenRouter) | Activo | Análisis de país `/api/v1/country/analyze` |
| React 18 + Babel standalone | Activo | SPA frontend |
| Vercel | Activo | Hosting frontend, auto-deploy |
| Leaflet 1.9 | Activo | Mapa coroplético |
| D3 v7 | Activo | Globo ortográfico 3D |
| GSAP | Activo | Animaciones de alerta y onboarding |
| Docker / uvicorn | Activo | Containerización del backend |
| Python ETL (pandas, openpyxl) | Activo | Pipeline de ingesta de datos |
| Make.com + 37 RSS feeds | Activo | Ingesta horaria de noticias investigativas |
| Mistral vía OpenRouter | Activo (Make) | 3 agentes en pipeline: detector, clasificador, sintetizador |
| text-embedding-3-small | Activo (Make) | Vectores 1536d para búsqueda semántica |
| GDELT 2.0 | Planificado | Ingesta de noticias globales en tiempo real |
| Vercel Cron Jobs | Planificado | Ejecución programada de agentes investigadores |
| Mistral Fact-Checker | Planificado | Verificación automática de artículos |
| Mistral Investigator | Planificado | Análisis profundo periódico (6h/72h/semanal) |
| Mistral Insight Engine | Planificado | Generación automática de hilos de foro |
| OpenAI SDK | Instalado / sin usar | Cliente futuro compatible con OpenRouter |
| node-cron | Instalado / sin usar | Cron runner local para desarrollo |

---

## 15. Filosofía

**Aletheia** no es un detector de corrupción. Es un lector de contexto. La corrupción institucional no se prueba con un índice — se comprende cruzando décadas de gasto público, quién gobernaba, qué dijeron los medios independientes y cómo reaccionó la sociedad civil.

La plataforma cubre el mundo porque la captura institucional no tiene pasaporte. Los mismos patrones — sobrefacturación en obras públicas, nepotismo en contrataciones, debilitamiento de organismos de control — aparecen en democracias y autocracias, en países ricos y en desarrollo.

Cada cifra cita su fuente. Cada análisis IA especifica el año que cubre. Cada señal de riesgo es visible junto a las noticias relacionadas. La transparencia se mide por la facilidad con que alguien sin tiempo puede entender un país en 30 segundos.
