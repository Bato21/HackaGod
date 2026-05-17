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
                onClick={() => window.dispatchEvent(
                  new CustomEvent("aletheia:select-country", { detail: { iso3: seg.iso3 } })
                )}
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

function AletheiaChat({ selectedCountry }) {
  const { useState, useRef, useEffect } = React;

  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [error, setError]       = useState("");
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

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
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-header-avatar"><OwlLogo size={24} /></div>
              <div>
                <div className="chat-header-title">Aletheia</div>
                <div className="chat-header-sub">aquello que no está oculto</div>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Cerrar chat">
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
        </div>
      )}
    </>
  );
}

window.AletheiaChat = AletheiaChat;
