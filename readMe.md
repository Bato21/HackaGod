# Aletheia · Aquello que no está oculto

> Plataforma de inteligencia cívica para América Latina. Convierte datos
> fiscales, índices de transparencia y noticias en un mapa interactivo,
> rankings comparables, fichas de país con análisis IA, foros de
> ciudadanos y señales de riesgo en tiempo real.

🌐 **Producción:**
- Frontend: [aletheia-xi.vercel.app](https://aletheia-xi.vercel.app) (también `aletheia-dusky-nine.vercel.app`)
- Backend API: [aletheia-qk3s.onrender.com](https://aletheia-qk3s.onrender.com)
- Base de datos: Supabase (`yiqxyfesywdswtcjaqeq`)

---

## 1. Contexto

América Latina convive con una paradoja: hay datos públicos, hay
noticias, hay rankings — pero están dispersos, sin contexto histórico
y sin herramientas que los ciudadanos puedan leer rápido. El **CPI de
Transparency International** mide percepción de corrupción y el dato
está, pero entender *por qué* un país está donde está requiere cruzar
gasto público, presidencias, gabinetes, escándalos y señales emergentes.

**Aletheia** ("aquello que no está oculto", griego) responde a:

- ¿Cómo está mi país en transparencia comparado con el resto de LATAM?
- ¿Quién gobernaba cuando el índice subió o cayó?
- ¿Qué señales de riesgo recientes detectó la base de datos?
- ¿Por qué exactamente está mi país en ese nivel?
- ¿Qué piensan otros ciudadanos sobre los hechos?

La aplicación no pretende atribuir responsabilidad personal — agrega
fuentes públicas y deja que el lector saque conclusiones con evidencia
a mano.

---

## 2. Qué hace

### Mapa interactivo + globo 3D
- Mapa Leaflet 2D coloreado por **Aletheia Score** (escala invertida:
  100 = muy corrupto, 0 = transparente — derivada del CPI de TI).
- Vista alterna **globo ortográfico D3** arrastrable y rotable.
- Selector de año (2017 → 2025) que actualiza colores, ranking y
  análisis IA en vivo.
- Triángulos de alerta (▲) sobre países con señales activas, animados
  con ondas radar, color por intensidad (amarillo → naranjo → rojo).

### Ficha de país
- Población por año (2017-2025) + tendencia.
- Descripción geográfica y socioeconómica (traducida a español).
- Score Aletheia con histórico y comparación con líderes regionales.
- Presidencia con aprobación y partido.
- Gabinete con carteras y posición ideológica (cuando hay datos).
- **🤖 Análisis Aletheia · IA** — un análisis estructurado generado por
  Claude Sonnet 4 (vía OpenRouter) que explica *por qué* el país está
  en su estado actual: **✅ Lo bueno · ⚠️ Lo problemático · 📊 Lectura general**,
  citando cifras concretas y posición en el ranking regional.

### Noticias del país
- Rail con 3 categorías: **Corrupción · Política · Gobierno**.
- Datos reales de `news_events` (Supabase) clasificados por país y
  categoría con un clasificador determinista (gazetteer + alias).
- Señales de riesgo activas aparecen como primer item en Corrupción,
  resaltadas con color y nivel (`▲ RIESGO CRÍTICO (92%) — Captura institucional`).
- Click en triángulo del mapa abre un modal centrado con las 3
  categorías y un badge del nivel de riesgo.

### Foro
- Hilos públicos por país o globales.
- Filtros por región/país/año + creación de nuevo hilo.
- Tour onboarding interactivo guía paso a paso todas las funciones.

### Chatbot IA "alethIA"
- Búho flotante (drag, resize, dock).
- Modelo **Claude Haiku 4.5** vía OpenRouter (configurable).
- Tiene acceso a CPI histórico, presidentes, gasto público, ranking
  regional — *no* a datos de usuarios.
- Las respuestas siguen el **año seleccionado** por el usuario en el
  dashboard y citan el año explícitamente en cada respuesta.

### Onboarding
- WelcomeModal al primer login (registrado o invitado).
- Tour guiado de **35 pasos en 9 secciones** — Bienvenida, Mapa,
  Panel, País, Opciones, Foro, Filtros, Crear hilo, Chat — con
  spotlights interactivos y modal final.
- Botón de Ayuda en el topbar reabre el tour en cualquier momento.

---

## 3. Cómo se hizo

### Stack real (no es Next.js — es Vanilla React + Babel standalone)

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | React 18 + Babel standalone (CDN), Leaflet 1.9, D3 v7, GSAP | Cero build step; cualquier hosting estático sirve la app. `app.jsx` se sirve directo, Babel compila en el navegador. |
| Backend | FastAPI + uvicorn + httpx + SQLAlchemy asyncpg | Async-first, autodoc OpenAPI gratis, healthcheck y CORS regex para deploys preview. |
| DB | Supabase Postgres 16 + RLS + RPC `SECURITY DEFINER` | Datos públicos vía funciones RPC con `GRANT EXECUTE TO anon`, sin tocar GRANTs de tabla. |
| Modelos IA | OpenRouter (gateway) | Un solo proveedor para todas las llamadas. Cambias modelo con env var, sin redeploy de código. |
| · Chatbot | `anthropic/claude-haiku-4-5` | Conversacional, barato, multilingüe. |
| · Análisis país | `anthropic/claude-sonnet-4` | Razonamiento más fuerte para síntesis estructurada. |
| Hosting frontend | Vercel | Push a `main` = deploy automático. |
| Hosting backend | Render | Cold start ~30-50s en plan free; fetchWithRetry en frontend soporta esto. |
| Mapa base | OpenStreetMap (Leaflet) + topología `geo-low.json` (D3) | Sin API keys. |
| Auth | Supabase Auth + modo invitado local | Invitados ven todo en modo lectura. |
| Sync de datos | `cloud-sync.js` + `*-override.js` síncronos + `useXVersion()` hooks | Patrón: caché localStorage hidratado en boot → fetch async → bump versión → React re-renderiza. |

### Pipeline de datos

```
Excel/CSV oficiales                    Pipeline externo (Make.com + Mistral)
       │                                            │
       ▼                                            ▼
backend/etl_*.py  ──────────► Supabase ◄────── news_events / risk_signals
       │                          │
       │                          ▼
       │                  RPC SECURITY DEFINER (get_cpi_scores, get_news, get_risk_signals, …)
       │                          │
       │                          ▼
       │                  cloud-sync.js (fetch al boot)
       │                          │
       │                          ▼
       └─► frontend/*-override.js (caché + window.ALETHEIA_*)
                                  │
                                  ▼
                          React (useXVersion bump)
                                  │
                                  ▼
                       Mapa / Ficha / Chat / Foro
```

### ETL scripts (`backend/`)

| Script | Qué hace |
|---|---|
| `etl_load_excel.py` | Carga el dataset base (`BASE_COMPLETA_CORREGIDA_CON_TODOS_LOS_DATOS.xlsx`) en `countries`, `presidents`, `public_expenditures`. |
| `etl_cpi.py` | Importa CPI de Transparency International (2017-2025) → `cpi_scores`. Calcula Aletheia Score = 100 - CPI. |
| `etl_full_2026.py` | Refresh anual con datos 2026 (cuando estén disponibles). |
| `etl_presidents.py` | Presidentes 2017-presente con partido, ideología y sistema político. |
| `etl_cabinet.py` | Gabinetes ministeriales con carteras coloreadas por ideología. |
| `etl_population.py` | Lee `PAISES_BASE_POBLACION_DESCRIPCION.xlsx`, mapea nombres EN→iso3, traduce subregión/capital al español, genera `frontend/population-data.js` estático. |
| `etl_milestones.py` | Hitos históricos por país y año. |
| `etl_news_classify.py` | **Clasificador determinista** que reasigna `country_id` de `news_events` cuando el pipeline externo los marca mal (gazetteer desde `countries` + alias de orgs criminales/ciudades, scoring URL > alias > entities > topics > headline). |

### Endpoints del backend (`/api/v1/`)

| Endpoint | Modelo | Propósito |
|---|---|---|
| `POST /chat` | `claude-haiku-4-5` | Chatbot conversacional con contexto DB + año seleccionado. |
| `POST /country/analyze` | `claude-sonnet-4` | Análisis estructurado "Lo bueno / Lo problemático / Lectura general" de un país, cacheado 6h por `(iso3, year)`. |
| `POST /briefings/generate` | mock | Placeholder del pipeline multi-agente (Scout → Analyst → Pattern → Researcher → Validator → Writer). |
| `GET /countries`, `GET /countries/compare` | — | Datos de país y comparación 2 a 2. |
| `GET /health` | — | Liveness probe. |

### Capa frontend (archivos clave)

```
frontend/
├── index.html              # Punto de entrada — carga React/Babel/Leaflet/D3 + scripts
├── app.jsx                 # Componente principal (mapa, ficha, foro, dashboard) — v=62
├── chatbot.jsx             # Búho flotante alethIA — v=15
├── forum.jsx               # Foro con filtros + crear hilo
├── data.js                 # Datasets estáticos (países base, regiones, etc.)
├── cloud-sync.js           # Hidratación async desde Supabase (RPC calls)
├── population-data.js      # Generado por etl_population.py (estático)
├── news-override.js        # Construye window.ALETHEIA_NEWS + COUNTRY_NEWS
├── risk-override.js        # Construye window.ALETHEIA_RISK + helpers de color
├── cpi-override.js         # Inyecta CPI real en window.ALETHEIA_CPI
├── milestones-override.js  # Hitos históricos
└── events.js               # Bus de eventos custom para componentes desacoplados
```

### Patrón de integración Supabase → React

1. **RPC `SECURITY DEFINER`** en Postgres bypasea RLS sin tocar GRANTs:
   ```sql
   CREATE OR REPLACE FUNCTION get_risk_signals()
   RETURNS TABLE (...) SECURITY DEFINER AS $$ ... $$;
   GRANT EXECUTE ON FUNCTION get_risk_signals() TO anon, authenticated;
   ```
2. **`*-override.js`** síncrono en `index.html` *después* de `data.js`,
   *antes* de `app.jsx`. Lee `localStorage` del load previo → puebla
   `window.ALETHEIA_X`. Expone `window.applyXCache(rows)`.
3. **`cloud-sync.js`** hace `sb.rpc("get_x")` async, llama
   `window.applyXCache(rows)`, guarda en localStorage, dispara evento
   `aletheia:x:loaded`.
4. **`useXVersion()`** hook (`useState` + listener) fuerza re-render
   cuando llega data nueva. Patrón replicable para cualquier tabla.

### Seguridad y CORS

- API keys (OpenRouter, Supabase service role, DB password) **nunca**
  van al frontend — todas las llamadas a modelos pasan por backend.
- Supabase publishable key es safe-by-design (anon, restringida por RLS).
- CORS permite explícitamente `localhost:3000`, `localhost:5500` y
  cualquier `https://*.vercel.app` (regex) para soportar preview deploys.

---

## 4. Variables de entorno

### Backend (`backend/.env`)
```bash
# Supabase
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_KEY=sb_publishable_...
DATABASE_URL=postgresql+asyncpg://postgres.<ref>:<password>@aws-...pooler.supabase.com:5432/postgres

# OpenRouter — un par de credenciales por endpoint (rotación + billing separados)
OPENROUTER_API_KEY=sk-or-v1-...                       # /country/analyze
OPENROUTER_MODEL=anthropic/claude-sonnet-4
OPENROUTER_API_KEY_CHATBOT=sk-or-v1-...               # /chat
OPENROUTER_MODEL_CHATBOT=anthropic/claude-haiku-4-5

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5500
# CORS_ORIGIN_REGEX se aplica además de la lista; default cubre *.vercel.app
```

### Frontend
La URL del backend se inyecta en `index.html`:
```html
<script>window.ALETHEIA_BACKEND_URL = "https://aletheia-qk3s.onrender.com";</script>
```

---

## 5. Cómo correr local

### Backend (FastAPI)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # llena con tus credenciales
uvicorn app.main:app --reload --port 8000
# http://localhost:8000/docs → Swagger UI
```

### Frontend (cualquier static server)
```bash
cd frontend
# Edita index.html: window.ALETHEIA_BACKEND_URL = "http://localhost:8000"
python3 -m http.server 5500
# http://localhost:5500
```

### Aplicar migraciones Supabase
```
supabase/migrations/
├── 001_schema_fixes.sql
├── 002_aletheia_core.sql
├── 003_mistral_dynamic.sql
└── 004_functions_triggers.sql
```
Correr en orden vía Supabase SQL Editor. Después poblar tablas:
```bash
cd backend && source .venv/bin/activate && set -a && source .env && set +a
python3 etl_load_excel.py
python3 etl_cpi.py
python3 etl_presidents.py
python3 etl_cabinet.py
python3 etl_population.py     # regenera frontend/population-data.js
python3 etl_news_classify.py  # idempotente, reasigna country_id mal etiquetados
```

---

## 6. Deploy

| Servicio | Repo / Branch | Build | Trigger |
|---|---|---|---|
| Vercel (frontend) | `main` (carpeta `frontend/`) | Estático, sin build | Push a `main` |
| Render (backend) | `main` (carpeta `backend/`) | `pip install -r requirements.txt` + `uvicorn` | Push a `main` |
| Supabase | — | Migraciones SQL manuales | SQL Editor |

**Hobby tier de Vercel** limita a 100 deploys / 24h — batchear cambios
relacionados en un solo commit para no quemar el cap.

**Render free** duerme tras 15 min de inactividad → primer request
toma 30-50s. El frontend tiene `fetchWithRetry` con backoff de 4s y
mensajes "Despertando servidor…" para suavizar la UX.

---

## 7. Layout del repo

```
HackaGod/
├── backend/
│   ├── app/
│   │   ├── main.py                       # FastAPI factory + CORS + lifespan
│   │   ├── config.py                     # Settings (Pydantic)
│   │   ├── database.py                   # Async engine + dispose
│   │   ├── routers/
│   │   │   ├── chat.py                   # POST /chat
│   │   │   ├── country_analysis.py       # POST /country/analyze
│   │   │   ├── countries.py              # GET /countries, /compare
│   │   │   └── briefings.py              # POST /briefings/generate (mock)
│   │   └── models.py                     # Pydantic schemas
│   ├── etl_*.py                          # ETL scripts (ver tabla)
│   ├── requirements.txt
│   ├── Dockerfile + docker-compose.yml
│   └── .env.example
│
├── frontend/
│   ├── index.html
│   ├── app.jsx, chatbot.jsx, forum.jsx
│   ├── *-override.js, cloud-sync.js
│   ├── data.js, population-data.js
│   ├── events.js
│   └── (sin build step — todo se sirve directo)
│
├── supabase/migrations/                  # SQL versionado
│
├── nextjs/                               # Plan original Next.js (abandonado)
├── AletheiaPath Plan integral.txt        # Plan estratégico inicial
├── bugs.md                               # Tracker de issues conocidos
└── readMe.md                             # (este archivo)
```

---

## 8. Issues abiertos y limitaciones

Ver `bugs.md` para tracker completo. Algunos importantes:

- **Pipeline externo (Make.com + Mistral)** etiqueta `news_events` y
  `risk_signals` con `country_id` incorrecto (todo → Chile). Hay un
  clasificador determinista (`etl_news_classify.py`) que reasigna
  news_events post-hoc; falta el equivalente para `risk_signals`.
- `risk_signals.claude_summary` viene en dos formatos sucios (JSON
  con justificación + markdown). `risk-override.js` los limpia en
  cliente.
- Plan free Render = cold start 30-50s. Para producción real → mover a
  plan pago o Vercel Functions con Fluid Compute.
- Frontend usa Babel standalone (cómodo para hackathon, lento en
  primer load). Producción real → precompilar con Vite/esbuild.

---

## 9. Créditos y filosofía

**Aletheia** (ἀλήθεια) = *aquello que no está oculto*. La app no
acusa, no condena, no atribuye responsabilidad individual. Solo
muestra los datos públicos en un formato legible, deja que el lector
los compare, y le da herramientas para discutir con otros ciudadanos.

Cada cifra cita su fuente. Cada análisis IA dice qué año cubre. Cada
señal de riesgo es visible junto a las noticias relacionadas. La
transparencia se mide por la facilidad con que alguien sin tiempo
puede entender un país en 30 segundos.

---

## 10. Stack resumido (TL;DR)

```
React 18 + Babel standalone + Leaflet + D3
    ↓ HTTPS
FastAPI (uvicorn + httpx + asyncpg)
    ↓ Postgres pooler
Supabase (RLS + RPC SECURITY DEFINER)
    ↓ OpenRouter gateway
Anthropic Claude Haiku 4.5 (chat) + Sonnet 4 (analysis)
```
