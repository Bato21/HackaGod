// chatbot.jsx — Panel de chat flotante Aletheia
// Llama al backend FastAPI en /api/v1/chat (Claude + datos CPI de Supabase).
// Montado como componente global window.AletheiaChat.

const BACKEND_URL = (window.ALETHEIA_BACKEND_URL || "http://localhost:8000") + "/api/v1/chat";

const SUGGESTIONS = [
  "¿Cuál es el país más corrupto de América Latina?",
  "¿Cómo ha evolucionado la corrupción en México desde 2017?",
  "¿Qué diferencia hay entre Chile y Venezuela en índice CPI?",
  "¿Qué factores explican la corrupción en Centroamérica?",
];

// Curated iso3→name map for known countries the bot mentions
const _ISO_LABEL = (() => {
  const m = {};
  (window.COUNTRIES || []).forEach(c => { m[c.iso3] = c.name; });
  return m;
})();

// name(lowercase) → iso3, para detectar países por nombre en el texto
const _NAME_TO_ISO = (() => {
  const m = {};
  (window.COUNTRIES || []).forEach(c => {
    if (c.name) m[c.name.toLowerCase()] = c.iso3;
  });
  // alias frecuentes que el bot usa
  Object.assign(m, {
    "estados unidos": "USA", "eeuu": "USA", "méxico": "MEX", "mexico": "MEX",
    "brasil": "BRA", "perú": "PER", "peru": "PER", "panamá": "PAN", "panama": "PAN",
    "haití": "HTI", "haiti": "HTI", "república dominicana": "DOM",
    "sudán del sur": "SSD", "sudan del sur": "SSD", "corea del norte": "PRK",
    "corea del sur": "KOR", "reino unido": "GBR", "nueva zelanda": "NZL",
  });
  return m;
})();

// Regex único y seguro: (XXX) o nombres de países conocidos. Sin zero-width.
const _LINK_RE = (() => {
  const names = Object.keys(_NAME_TO_ISO)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const namePart = names.length ? `|(${names.join("|")})` : "";
  try {
    return new RegExp(`\\(([A-Z]{3})\\)${namePart}`, "gi");
  } catch (_) {
    return /\(([A-Z]{3})\)/g; // fallback solo ISO3
  }
})();

function parseResponseWithLinks(text) {
  const segments = [];
  const re = new RegExp(_LINK_RE.source, _LINK_RE.flags);
  let last = 0, match, guard = 0;
  while ((match = re.exec(text)) !== null && guard++ < 500) {
    if (match[0].length === 0) { re.lastIndex++; continue; } // anti-loop
    if (match.index > last) {
      segments.push({ type: "text", value: text.slice(last, match.index) });
    }
    let iso3, label;
    if (match[1]) {                       // (XXX)
      iso3 = match[1].toUpperCase();
      label = `(${iso3})`;
    } else {                              // nombre de país
      const word = match[0];
      iso3 = _NAME_TO_ISO[word.toLowerCase()];
      label = word;
    }
    if (iso3) {
      segments.push({ type: "link", iso3, label, name: _ISO_LABEL[iso3] || label });
    } else {
      segments.push({ type: "text", value: match[0] });
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) segments.push({ type: "text", value: text.slice(last) });
  return segments;
}

function MarkdownText({ text }) {
  try {
    const segments = parseResponseWithLinks(text);
    const renderMd = (t) => {
      const html = t
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br/>");
      return React.createElement("span", { dangerouslySetInnerHTML: { __html: html } });
    };
    return (
      <div className="chat-md">
        <p>
          {segments.map((seg, i) =>
            seg.type === "link" ? (
              <span
                key={i}
                className="chat-country-link"
                title={`Ver ${seg.name} en el mapa`}
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("aletheia:select-country", { detail: { iso3: seg.iso3 } })
                  );
                  // Dock al lateral izquierdo (sobre el news panel) para que
                  // el usuario pueda comparar el chat con la ficha del país.
                  window.dispatchEvent(
                    new CustomEvent("aletheia:chat:dock", { detail: { iso3: seg.iso3 } })
                  );
                }}
              >
                {seg.label}
              </span>
            ) : (
              <React.Fragment key={i}>{renderMd(seg.value)}</React.Fragment>
            )
          )}
        </p>
      </div>
    );
  } catch (_) {
    // Fallback: render plain text if parsing fails — never break the parent app
    return <div className="chat-md"><p>{text}</p></div>;
  }
}

// Owl SVG — matches the Aletheia brand logo in the topbar
function OwlLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
      <path d="M16 4 L22 6 L26 12 L26 22 L20 27 L12 27 L6 22 L6 12 L10 6 Z" stroke="#e6b840" strokeWidth="1.2" fill="rgba(230,184,64,0.08)"/>
      <circle cx="12" cy="13" r="3.5" stroke="#e6b840" strokeWidth="1.1" fill="rgba(230,184,64,0.10)"/>
      <circle cx="12" cy="13" r="1.7" fill="#e6b840" opacity="0.95"/>
      <circle cx="12" cy="13" r="0.8" fill="#0e0c13"/>
      <circle cx="20" cy="13" r="3.5" stroke="#e6b840" strokeWidth="1.1" fill="rgba(230,184,64,0.10)"/>
      <circle cx="20" cy="13" r="1.7" fill="#e6b840" opacity="0.95"/>
      <circle cx="20" cy="13" r="0.8" fill="#0e0c13"/>
      <path d="M14.5 15.5 L16 18 L17.5 15.5" stroke="#e6b840" strokeWidth="1" strokeLinejoin="round" fill="rgba(230,184,64,0.35)"/>
      <path d="M11 5.5 L9 2.5 M21 5.5 L23 2.5" stroke="#e6b840" strokeWidth="1" strokeLinecap="round"/>
      <path d="M6 16 L3.5 13.5 L6 20 M26 16 L28.5 13.5 L26 20" stroke="#e6b840" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 27 L10 30 M16 27 L16 30 M20 27 L22 30" stroke="#e6b840" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  );
}

function ChatMessage({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`chat-msg ${isUser ? "chat-msg-user" : "chat-msg-bot"}`}>
      {!isUser && (
        <div className="chat-avatar"><OwlLogo size={18} /></div>
      )}
      <div className="chat-bubble">
        {isUser ? msg.content : <MarkdownText text={msg.content} />}
        {msg.sources && msg.sources.length > 0 && (
          <div className="chat-sources">
            {msg.sources.map((s, i) => (
              <span key={i} className="chat-source-tag">{s}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// TODO: quitar antes de prod. Mock para previsualizar UI cuando Groq rate-limita.
// Cambia a `false` para usar el backend real.
const USE_MOCK_CONVERSATION = true;

const MOCK_MESSAGES = [
  { role: "user", content: "¿Cuál es el país más corrupto de América Latina?" },
  {
    role: "assistant",
    content:
      "El país más corrupto de América Latina según el CPI 2025 es Venezuela, con un Aletheia score de **90.00/100**. " +
      "Le siguen Nicaragua y Haití en la región, también con scores muy altos.\n\n" +
      "En contraste, Uruguay y Chile son los más transparentes del continente: " +
      "Uruguay obtuvo 24/100 y Chile 33/100 (2025).\n\n" +
      "[Fuente: CPI TI vía Aletheia DB]",
    sources: ["CPI TI — ranking mundial vía Aletheia DB"],
  },
  { role: "user", content: "¿Y cómo ha cambiado México?" },
  {
    role: "assistant",
    content:
      "México pasó de un Aletheia score de **70/100** en 2017 a **74/100** en 2025 — un *retroceso* de 4 puntos en transparencia.\n\n" +
      "Comparado con Brasil (que mejoró ligeramente) y Colombia (estable), México muestra la peor tendencia entre las grandes economías latinoamericanas.",
    sources: ["CPI TI 2017-2025", "Serie histórica Aletheia DB"],
  },
];

function AletheiaChat({ selectedCountry }) {
  const { useState, useRef, useEffect } = React;

  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState(USE_MOCK_CONVERSATION ? MOCK_MESSAGES : []);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [error, setError]       = useState("");
  // Position: null = use default CSS anchor (bottom-right). Once user drags, becomes {x,y}.
  const [pos, setPos] = useState(null);
  // Docked = chat se posiciona en el panel izquierdo, encima del news panel.
  // Se activa cuando el usuario clickea un hyperlink de país dentro del chat.
  const [docked, setDocked] = useState(false);
  // Solo relevante en docked: qué pestaña mostrar.
  const [leftTab, setLeftTab] = useState("chat"); // "chat" | "news"
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const panelRef  = useRef(null);
  const dragRef   = useRef(null); // {offsetX, offsetY}

  // Drag via pointer events — captura pointer al header para que el drag
  // siga funcionando aunque el mouse salga del panel. Clamp deja al menos
  // 40px del header visible en cualquier borde para poder recuperarlo.
  const onHeaderPointerDown = (e) => {
    if (e.target.closest("button")) return; // close button no debe arrastrar
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      w: rect.width,
      h: rect.height,
      pointerId: e.pointerId,
    };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    e.preventDefault();
  };

  const onHeaderPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const x = e.clientX - d.offsetX;
    const y = e.clientY - d.offsetY;
    const SAFE = 40; // pixeles del header que siempre quedan en pantalla
    const minX = -d.w + SAFE;
    const maxX = window.innerWidth - SAFE;
    const minY = 0;
    const maxY = window.innerHeight - SAFE;
    setPos({
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    });
  };

  const onHeaderPointerUp = (e) => {
    const d = dragRef.current;
    if (d && d.pointerId === e.pointerId) {
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
      dragRef.current = null;
    }
  };

  // Resize custom via pointer events (la nativa CSS `resize: both` queda
  // tapada por el botón enviar). Min 320×420, max 95vw×95vh.
  const resizeRef = useRef(null); // {startX, startY, startW, startH, pointerId}
  const [size, setSize] = useState(null); // {w, h} | null = CSS default

  const onResizePointerDown = (e) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: rect.width,
      startH: rect.height,
      pointerId: e.pointerId,
    };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    e.preventDefault();
    e.stopPropagation();
  };

  const onResizePointerMove = (e) => {
    const r = resizeRef.current;
    if (!r || r.pointerId !== e.pointerId) return;
    const dw = e.clientX - r.startX;
    const dh = e.clientY - r.startY;
    const minW = 320, minH = 420;
    const maxW = window.innerWidth  * 0.95;
    const maxH = window.innerHeight * 0.95;
    setSize({
      w: Math.max(minW, Math.min(maxW, r.startW + dw)),
      h: Math.max(minH, Math.min(maxH, r.startH + dh)),
    });
  };

  const onResizePointerUp = (e) => {
    const r = resizeRef.current;
    if (r && r.pointerId === e.pointerId) {
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
      resizeRef.current = null;
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  // Disparado desde el header ("Pregunta a Aletheia" al lado del navbar)
  useEffect(() => {
    const toggle = () => setOpen(o => !o);
    window.addEventListener("aletheia:chat:toggle", toggle);
    return () => window.removeEventListener("aletheia:chat:toggle", toggle);
  }, []);

  // Cuando el usuario clickea un país desde el chat → dock al lateral izquierdo.
  useEffect(() => {
    const onDock = () => {
      setDocked(true);
      setLeftTab("chat");
      setOpen(true);
      // Reset estado flotante: si el panel venía arrastrado/resized, esos
      // valores ya no aplican y deben limpiarse para que el CSS docked rija.
      setPos(null);
      setSize(null);
    };
    window.addEventListener("aletheia:chat:dock", onDock);
    return () => window.removeEventListener("aletheia:chat:dock", onDock);
  }, []);

  // Marca body con clase cuando el chat dockeado está en pestaña Aletheia.
  // Esto oculta el news-focus vía CSS para que no haya doble render visual.
  useEffect(() => {
    const cls = "chat-docked-aletheia";
    if (open && docked && leftTab === "chat") {
      document.body.classList.add(cls);
    } else {
      document.body.classList.remove(cls);
    }
    return () => document.body.classList.remove(cls);
  }, [open, docked, leftTab]);

  // Al abrir por primera vez: ancla en top/left (no bottom/right) para que el
  // resize nativo (CSS resize: both) crezca hacia abajo-derecha, no hacia arriba.
  useEffect(() => {
    if (!open || pos) return;
    requestAnimationFrame(() => {
      const rect = panelRef.current?.getBoundingClientRect();
      if (rect) setPos({ x: rect.left, y: rect.top });
    });
  }, [open, pos]);

  // Fetch con retry para sobrevivir cold start del backend (Render free duerme tras 15min).
  // Reintenta en network error / 404 / 502 / 503 / 504 hasta MAX_RETRIES (~60s total).
  const fetchWithRetry = async (body) => {
    const MAX_RETRIES = 8;
    const RETRY_DELAY = 4000; // 4s entre intentos
    const TIMEOUT_PER_TRY = 60000; // 60s por intento (cold start típico 30-50s)
    const TRANSIENT_STATUS = new Set([404, 502, 503, 504]);

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      if (attempt === 1) setLoadingStatus("Despertando servidor… (~30s)");
      if (attempt >= 3) setLoadingStatus("Aún despertando, paciencia…");

      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT_PER_TRY);

      try {
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: ctrl.signal,
        });
        clearTimeout(timer);

        if (TRANSIENT_STATUS.has(res.status) && attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, RETRY_DELAY));
          continue;
        }
        return res;
      } catch (e) {
        clearTimeout(timer);
        // network error o abort → reintenta
        if (attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, RETRY_DELAY));
          continue;
        }
        throw e;
      }
    }
    throw new Error("El servidor no responde. Intenta de nuevo en un momento.");
  };

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setError("");

    const userMsg = { role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setLoadingStatus("");

    // MOCK MODE: respuesta fake con hyperlinks para probar UI sin backend.
    if (USE_MOCK_CONVERSATION) {
      setTimeout(() => {
        const fakeReply = {
          role: "assistant",
          content:
            `Sobre "${msg}": un análisis breve menciona países como Venezuela, ` +
            `Argentina, Chile y México. Estos son los más relevantes según los ` +
            `datos CPI disponibles.\n\n[Respuesta simulada — Groq rate-limited]`,
          sources: ["MOCK · UI preview"],
        };
        setMessages(prev => [...prev, fakeReply]);
        setLoading(false);
      }, 700);
      return;
    }

    try {
      const history = messages.slice(-10).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

      const iso3 = selectedCountry?.iso3 || null;

      const res = await fetchWithRetry({ message: msg, country_iso3: iso3, history });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Error ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.response, sources: data.context_used },
      ]);
    } catch (e) {
      setError(e.message || "Error de conexión. ¿Está corriendo el backend?");
    } finally {
      setLoading(false);
      setLoadingStatus("");
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* Trigger en el header (window.dispatchEvent aletheia:chat:toggle) */}

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className={`chat-panel${docked ? " chat-panel--docked" : ""}${docked && leftTab === "news" ? " chat-panel--hidden" : ""}`}
          style={!docked ? {
            ...(pos  ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" } : {}),
            ...(size ? { width: size.w, height: size.h } : {}),
          } : undefined}
        >
          {/* Tab toggle visible solo en modo docked */}
          {docked && (
            <div className="chat-tabs">
              <button
                className={`chat-tab${leftTab === "chat" ? " active" : ""}`}
                onClick={() => setLeftTab("chat")}
              >
                <OwlLogo size={14} />
                <span>Aletheia</span>
              </button>
              <button
                className={`chat-tab${leftTab === "news" ? " active" : ""}`}
                onClick={() => setLeftTab("news")}
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="12" height="10" rx="1"/>
                  <path d="M5 6 L11 6 M5 8.5 L11 8.5 M5 11 L9 11"/>
                </svg>
                <span>Noticias</span>
              </button>
              <button
                className="chat-undock"
                onClick={() => { setDocked(false); setLeftTab("chat"); }}
                title="Desacoplar (volver a flotante)"
                aria-label="Desacoplar chat"
              >
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3 L13 3 L13 7"/>
                  <path d="M13 3 L7 9"/>
                  <path d="M11 13 L1 13 L1 3 L5 3"/>
                </svg>
              </button>
            </div>
          )}

          <div
            className="chat-header"
            onPointerDown={docked ? undefined : onHeaderPointerDown}
            onPointerMove={docked ? undefined : onHeaderPointerMove}
            onPointerUp={docked ? undefined : onHeaderPointerUp}
            onPointerCancel={docked ? undefined : onHeaderPointerUp}
            style={docked ? { cursor: "default" } : undefined}
          >
            <div className="chat-header-left">
              <div className="chat-header-avatar"><OwlLogo size={24} /></div>
              <div>
                <div className="chat-header-title">Aletheia</div>
                <div className="chat-header-sub">aquello que no está oculto</div>
              </div>
            </div>
            <button className="chat-close" onClick={() => { setOpen(false); setDocked(false); }} aria-label="Cerrar chat">
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 3 L11 11 M11 3 L3 11"/>
              </svg>
            </button>
          </div>

          <div className="chat-body">
            {isEmpty && (
              <div className="chat-empty">
                <div className="chat-empty-icon"><OwlLogo size={48} /></div>
                <div className="chat-empty-title">¿En qué puedo ayudarte?</div>
                <div className="chat-empty-sub">
                  Pregunta sobre corrupción, datos CPI o gobernanza en América Latina.
                  {selectedCountry && (
                    <span> Tengo datos de <strong>{selectedCountry.name}</strong> en contexto.</span>
                  )}
                </div>
                <div className="chat-suggestions">
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} className="chat-suggestion" onClick={() => sendMessage(s)}>
                      <span className="chat-suggestion-arrow">→</span>
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => <ChatMessage key={i} msg={m} />)}
            {loading && (
              <div className="chat-msg chat-msg-bot">
                <div className="chat-avatar"><OwlLogo size={18} /></div>
                <div className="chat-bubble chat-thinking">
                  <span/><span/><span/>
                  {loadingStatus && (
                    <div className="chat-thinking-status">{loadingStatus}</div>
                  )}
                </div>
              </div>
            )}
            {error && (
              <div className="chat-error">{error}</div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-footer">
            {messages.length > 0 && (
              <button className="chat-clear" onClick={() => { setMessages([]); setError(""); }}>
                Nueva conversación
              </button>
            )}
            <div className="chat-input-row">
              <textarea
                ref={inputRef}
                className="chat-input"
                placeholder={selectedCountry
                  ? `Pregunta sobre ${selectedCountry.name}…`
                  : "Pregunta sobre política y corrupción…"}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                disabled={loading}
              />
              <button
                className="chat-send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                title="Enviar (Enter)"
                aria-label="Enviar mensaje"
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8 L13 8 M9 4 L13 8 L9 12"/>
                </svg>
              </button>
            </div>
            <div className="chat-disclaimer">
              CPI Transparencia Internacional · 2017–2025 · Solo fines informativos
            </div>
          </div>
          {!docked && (
            <div
              className="chat-resize-grip"
              aria-label="Redimensionar"
              role="separator"
              onPointerDown={onResizePointerDown}
              onPointerMove={onResizePointerMove}
              onPointerUp={onResizePointerUp}
              onPointerCancel={onResizePointerUp}
            />
          )}
        </div>
      )}
    </>
  );
}

window.AletheiaChat = AletheiaChat;
