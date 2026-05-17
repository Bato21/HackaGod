(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/(app)/metodologia/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MetodologiaPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const SECTIONS = [
    {
        id: 'que-es',
        label: '¿Qué es Aletheia?'
    },
    {
        id: 'iea',
        label: 'El Índice Estructural (IEA)'
    },
    {
        id: 'bic',
        label: 'La Banda de Incertidumbre Cívica'
    },
    {
        id: 'pilares',
        label: 'Los 5 Pilares'
    },
    {
        id: 'tipologias',
        label: 'Tipologías de Corrupción'
    },
    {
        id: 'fuentes',
        label: 'Fuentes de Datos'
    },
    {
        id: 'agentes',
        label: 'Agentes de IA'
    },
    {
        id: 'limitaciones',
        label: 'Limitaciones'
    },
    {
        id: 'participar',
        label: 'Cómo Participar'
    }
];
const PILLAR_DATA = [
    {
        id: 'fiscal',
        name: 'Disciplina Fiscal',
        weight: '25%',
        desc: 'Mide la transparencia, consistencia y trazabilidad del gasto público. Incluye indicadores de adjudicación directa, deuda no auditada y transferencias sin rendición.'
    },
    {
        id: 'social',
        name: 'Inversión Social',
        weight: '20%',
        desc: 'Evalúa la coherencia entre el gasto social declarado y los indicadores objetivos de bienestar. Detecta discrepancias estadísticas y desvíos.'
    },
    {
        id: 'transparency',
        name: 'Transparencia Institucional',
        weight: '30%',
        desc: 'Analiza el acceso a información pública, la existencia de auditorías independientes y la calidad de los reportes gubernamentales.'
    },
    {
        id: 'stability',
        name: 'Estabilidad Sectorial',
        weight: '15%',
        desc: 'Mide la rotación no programada de funcionarios clave, renuncia de cargos reguladores y patrones de discontinuidad institucional.'
    },
    {
        id: 'judicial',
        name: 'Independencia Judicial',
        weight: '10%',
        desc: 'Índice compuesto de imparcialidad del sistema judicial en casos de corrupción pública, basado en tipologías documentadas.'
    }
];
function H2({ id, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
        id: id,
        style: {
            fontFamily: 'var(--serif)',
            fontSize: 28,
            fontWeight: 900,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            margin: '40px 0 16px',
            scrollMarginTop: 80
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/(app)/metodologia/page.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = H2;
function P({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        style: {
            fontFamily: 'var(--sans)',
            fontSize: 14,
            color: 'var(--text-2)',
            lineHeight: 1.72,
            margin: '0 0 16px'
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/(app)/metodologia/page.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c1 = P;
function Disclaimer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: 'rgba(250,204,21,0.06)',
            border: '1px solid rgba(250,204,21,0.2)',
            borderRadius: 10,
            padding: '14px 18px',
            marginBottom: 20
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        color: '#facc15',
                        fontSize: 16,
                        flexShrink: 0,
                        marginTop: 2
                    },
                    children: "⚠"
                }, void 0, false, {
                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontFamily: 'var(--mono)',
                                fontSize: 8.5,
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: '#facc15',
                                display: 'block',
                                marginBottom: 4
                            },
                            children: "DATOS ILUSTRATIVOS"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontFamily: 'var(--sans)',
                                fontSize: 12.5,
                                color: 'var(--text-3)',
                                lineHeight: 1.55,
                                margin: 0
                            },
                            children: [
                                "Todos los índices, puntuaciones, titulares y cifras en esta plataforma son ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    style: {
                                        color: 'var(--text-2)'
                                    },
                                    children: "ejemplos generados con plantillas determinísticas"
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                    lineNumber: 62,
                                    columnNumber: 88
                                }, this),
                                " para demostrar el formato y la interoperabilidad del sistema. No corresponden a hechos reales. La metodología descrita a continuación refleja cómo funcionaría el sistema con datos reales."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(app)/metodologia/page.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(app)/metodologia/page.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_c2 = Disclaimer;
function MetodologiaPage() {
    _s();
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('que-es');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MetodologiaPage.useEffect": ()=>{
            function handler() {
                for (const s of [
                    ...SECTIONS
                ].reverse()){
                    const el = document.getElementById(s.id);
                    if (el && el.getBoundingClientRect().top < 120) {
                        setActiveSection(s.id);
                        break;
                    }
                }
            }
            window.addEventListener('scroll', handler, {
                passive: true
            });
            return ({
                "MetodologiaPage.useEffect": ()=>window.removeEventListener('scroll', handler)
            })["MetodologiaPage.useEffect"];
        }
    }["MetodologiaPage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        transition: {
            duration: 0.3
        },
        style: {
            display: 'flex',
            height: '100%',
            overflow: 'hidden',
            background: 'var(--bg)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 220,
                    flexShrink: 0,
                    background: 'var(--bg-2)',
                    borderRight: '1px solid var(--line-2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    padding: '24px 0'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: 'var(--mono)',
                            fontSize: 7.5,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: 'var(--text-4)',
                            padding: '0 16px 12px'
                        },
                        children: "Contenido"
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/metodologia/page.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            overflowY: 'auto'
                        },
                        children: SECTIONS.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: `#${s.id}`,
                                onClick: (e)=>{
                                    e.preventDefault();
                                    document.getElementById(s.id)?.scrollIntoView({
                                        behavior: 'smooth'
                                    });
                                },
                                style: {
                                    display: 'block',
                                    padding: '7px 16px',
                                    fontFamily: 'var(--sans)',
                                    fontSize: 12.5,
                                    color: activeSection === s.id ? 'var(--accent)' : 'var(--text-3)',
                                    textDecoration: 'none',
                                    borderLeft: `2px solid ${activeSection === s.id ? 'var(--accent)' : 'transparent'}`,
                                    background: activeSection === s.id ? 'rgba(56,189,248,0.04)' : 'transparent',
                                    transition: 'all .15s'
                                },
                                onMouseEnter: (e)=>{
                                    if (activeSection !== s.id) e.currentTarget.style.color = 'var(--text-2)';
                                },
                                onMouseLeave: (e)=>{
                                    if (activeSection !== s.id) e.currentTarget.style.color = 'var(--text-3)';
                                },
                                children: s.label
                            }, s.id, false, {
                                fileName: "[project]/app/(app)/metodologia/page.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/metodologia/page.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/metodologia/page.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflowY: 'auto',
                    padding: '40px 60px 80px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        maxWidth: 720
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: 32
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontFamily: 'var(--mono)',
                                        fontSize: 8,
                                        letterSpacing: '0.18em',
                                        textTransform: 'uppercase',
                                        color: 'var(--accent)',
                                        marginBottom: 8
                                    },
                                    children: "METODOLOGÍA · ALETHEIA"
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                    lineNumber: 137,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    style: {
                                        fontFamily: 'var(--serif)',
                                        fontSize: 44,
                                        fontWeight: 900,
                                        color: 'var(--text)',
                                        letterSpacing: '-0.03em',
                                        lineHeight: 1.1,
                                        margin: '0 0 16px'
                                    },
                                    children: [
                                        "Cómo funciona",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 145,
                                            columnNumber: 28
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                            style: {
                                                fontStyle: 'italic',
                                                color: 'var(--accent)'
                                            },
                                            children: "el índice"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 146,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                    lineNumber: 140,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(P, {
                                    children: "Aletheia es una plataforma de análisis de integridad institucional para América Latina y el Caribe. Esta página documenta el sistema de índices, los agentes de inteligencia artificial involucrados, y las limitaciones importantes que deben considerarse al interpretar los resultados."
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Disclaimer, {}, void 0, false, {
                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(H2, {
                            id: "que-es",
                            children: "¿Qué es Aletheia?"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(P, {
                            children: "Aletheia es un sistema de monitoreo de corrupción estructural diseñado para 29 países de América Latina y el Caribe, con datos ilustrativos que cubren el período 2015–2024. Combina análisis estadístico, fuentes de datos públicas y agentes de inteligencia artificial para construir un índice compuesto de integridad institucional."
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(P, {
                            children: "La plataforma está concebida como un punto de partida para la investigación periodística, académica y ciudadana. El foro integrado permite que la comunidad de usuarios aporte contexto, señale anomalías y construya narrativas colectivas alrededor de los datos."
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(P, {
                            children: "El nombre proviene del concepto griego de verdad no-velada: aquello que se desvela o descubre. Una metáfora apropiada para la transparencia que la plataforma intenta facilitar."
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 155,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(H2, {
                            id: "iea",
                            children: "El Índice Estructural (IEA)"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(P, {
                            children: 'El Índice Estructural de Anomalías (IEA) es la medida principal de Aletheia. Varía entre 0 y 100, donde valores más bajos indican menor corrupción estimada y valores más altos indican mayor corrupción estructural. Esta escala invertida —respecto a otros índices de integridad que puntúan "más alto = más limpio"— fue adoptada para facilitar la lectura visual en el mapa coroplético.'
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(P, {
                            children: "El IEA es un índice compuesto calculado a partir de cinco pilares, cada uno con una ponderación diferente. Los valores son re-normalizados anualmente para mantener la comparabilidad inter-temporal, usando como ancla los países con datos más estables."
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: 'var(--bg-2)',
                                border: '1px solid var(--line-2)',
                                borderRadius: 10,
                                padding: '16px 20px',
                                marginBottom: 20
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontFamily: 'var(--mono)',
                                        fontSize: 7.5,
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        color: 'var(--text-3)',
                                        marginBottom: 12
                                    },
                                    children: "FÓRMULA SIMPLIFICADA"
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                    lineNumber: 165,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontFamily: 'var(--mono)',
                                        fontSize: 13,
                                        color: 'var(--accent)',
                                        letterSpacing: '0.02em'
                                    },
                                    children: [
                                        "IEA = Σ (pilar",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sub", {
                                            style: {
                                                fontSize: 9
                                            },
                                            children: "i"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 169,
                                            columnNumber: 29
                                        }, this),
                                        " × peso",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sub", {
                                            style: {
                                                fontSize: 9
                                            },
                                            children: "i"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 169,
                                            columnNumber: 72
                                        }, this),
                                        ") + BIC",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sub", {
                                            style: {
                                                fontSize: 9
                                            },
                                            children: "adj"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 169,
                                            columnNumber: 115
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                    lineNumber: 168,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontFamily: 'var(--sans)',
                                        fontSize: 11.5,
                                        color: 'var(--text-3)',
                                        marginTop: 8,
                                        lineHeight: 1.5
                                    },
                                    children: [
                                        "Donde BIC",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sub", {
                                            children: "adj"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 172,
                                            columnNumber: 24
                                        }, this),
                                        " es el ajuste por la Banda de Incertidumbre Cívica, que amplía o contrae el valor central según la volatilidad histórica del país."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                    lineNumber: 171,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 161,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(H2, {
                            id: "bic",
                            children: "La Banda de Incertidumbre Cívica (BIC)"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 176,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(P, {
                            children: "La BIC es un intervalo de confianza metodológico que rodea al valor puntual del IEA. Refleja el grado de incertidumbre en la estimación, causado por datos faltantes, inconsistencias en fuentes o alta volatilidad histórica de un país."
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(P, {
                            children: "Un país con BIC estrecha tiene datos más consistentes y el valor central es más confiable. Un país con BIC amplia (por ejemplo, Venezuela con BIC 80–94) indica que la puntuación real podría variar significativamente."
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 178,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(P, {
                            children: "La BIC se calcula mediante bootstrap estadístico sobre las series de datos de cada pilar, con 1.000 iteraciones por país por año. El intervalo reportado es el percentil 10–90."
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(H2, {
                            id: "pilares",
                            children: "Los 5 Pilares"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 181,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                                marginBottom: 20
                            },
                            children: PILLAR_DATA.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: 'var(--bg-2)',
                                        border: '1px solid var(--line-2)',
                                        borderRadius: 10,
                                        padding: '14px 18px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginBottom: 6
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontFamily: 'var(--sans)',
                                                        fontSize: 13.5,
                                                        fontWeight: 600,
                                                        color: 'var(--text)'
                                                    },
                                                    children: p.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                                    lineNumber: 189,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontFamily: 'var(--mono)',
                                                        fontSize: 9.5,
                                                        fontWeight: 700,
                                                        color: 'var(--accent)',
                                                        background: 'rgba(6,182,212,0.1)',
                                                        border: '1px solid rgba(6,182,212,0.2)',
                                                        padding: '2px 8px',
                                                        borderRadius: 4
                                                    },
                                                    children: p.weight
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                                    lineNumber: 190,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 188,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontFamily: 'var(--sans)',
                                                fontSize: 12.5,
                                                color: 'var(--text-3)',
                                                lineHeight: 1.55,
                                                margin: 0
                                            },
                                            children: p.desc
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 196,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, p.id, true, {
                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                    lineNumber: 184,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 182,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(H2, {
                            id: "tipologias",
                            children: "Tipologías de Corrupción"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 201,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(P, {
                            children: "Aletheia clasifica los patrones de riesgo detectados en siete tipologías principales, inspiradas en la taxonomía del International Anti-Corruption Resource Center (IACRC):"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 202,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 10,
                                marginBottom: 20
                            },
                            children: [
                                {
                                    name: 'Contratación directa',
                                    icon: '📋'
                                },
                                {
                                    name: 'Transferencias irregulares',
                                    icon: '💸'
                                },
                                {
                                    name: 'Captura estatal',
                                    icon: '🏛'
                                },
                                {
                                    name: 'Opacidad financiera',
                                    icon: '🔒'
                                },
                                {
                                    name: 'Colapso institucional',
                                    icon: '🏚'
                                },
                                {
                                    name: 'Empresa pública',
                                    icon: '🏭'
                                },
                                {
                                    name: 'Desvío gasto social',
                                    icon: '📉'
                                }
                            ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: 'var(--bg-2)',
                                        border: '1px solid var(--line-2)',
                                        borderRadius: 8,
                                        padding: '10px 14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 18
                                            },
                                            children: t.icon
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 218,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: 'var(--sans)',
                                                fontSize: 12.5,
                                                color: 'var(--text-2)'
                                            },
                                            children: t.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 219,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, t.name, true, {
                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                    lineNumber: 213,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 203,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(H2, {
                            id: "fuentes",
                            children: "Fuentes de Datos"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 224,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(P, {
                            children: "En un despliegue con datos reales, Aletheia integraría las siguientes fuentes públicas primarias:"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 225,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 6,
                                marginBottom: 20
                            },
                            children: [
                                'Contraloría General / Tribunal de Cuentas (por país)',
                                'Portales de transparencia gubernamental',
                                'Base de datos de licitaciones públicas (OCDS)',
                                'Reportes del FMI: Artículo IV y FSAP',
                                'Índice de Percepción de Corrupción (Transparency International)',
                                'Bases de la CEPAL sobre gasto social',
                                'Resoluciones judiciales de casos de corrupción (scraped)',
                                'Artículos de prensa de medios especializados (RSS)'
                            ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        fontFamily: 'var(--sans)',
                                        fontSize: 12.5,
                                        color: 'var(--text-3)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'var(--accent)',
                                                flexShrink: 0
                                            },
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 238,
                                            columnNumber: 17
                                        }, this),
                                        " ",
                                        s
                                    ]
                                }, s, true, {
                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                    lineNumber: 237,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 226,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(H2, {
                            id: "agentes",
                            children: "Agentes de IA"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 243,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(P, {
                            children: "Aletheia utiliza dos sistemas de IA en su pipeline de generación de datos ilustrativos:"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 12,
                                marginBottom: 20
                            },
                            children: [
                                {
                                    name: 'Mistral 7B',
                                    role: 'Generación de señales',
                                    desc: 'Genera descripciones de señales de riesgo y titulares de noticias ilustrativas a partir de plantillas determinísticas. Opera con temperatura baja para maximizar consistencia.'
                                },
                                {
                                    name: 'Claude (Anthropic)',
                                    role: 'Análisis y síntesis',
                                    desc: 'Proporciona análisis de contexto para países, revisión de coherencia en scores y generación del texto de la sección "Insight Engine" visible en el foro.'
                                }
                            ].map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: 'var(--bg-2)',
                                        border: '1px solid var(--line-2)',
                                        borderRadius: 10,
                                        padding: '14px 18px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontFamily: 'var(--mono)',
                                                fontSize: 10,
                                                color: 'var(--accent)',
                                                fontWeight: 700,
                                                marginBottom: 4
                                            },
                                            children: a.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 262,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontFamily: 'var(--mono)',
                                                fontSize: 8,
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                color: 'var(--text-3)',
                                                marginBottom: 8
                                            },
                                            children: a.role
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 263,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontFamily: 'var(--sans)',
                                                fontSize: 12,
                                                color: 'var(--text-3)',
                                                lineHeight: 1.55,
                                                margin: 0
                                            },
                                            children: a.desc
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 264,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, a.name, true, {
                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                    lineNumber: 258,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 245,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(H2, {
                            id: "limitaciones",
                            children: "Limitaciones y Datos Ilustrativos"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 269,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Disclaimer, {}, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 270,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(P, {
                            children: "Además del carácter ilustrativo de los datos, existen limitaciones metodológicas estructurales que aplicarían incluso con datos reales:"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 271,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                                marginBottom: 20
                            },
                            children: [
                                'Los índices de percepción de corrupción miden percepciones, no hechos verificados. Pueden estar influenciados por ciclos mediáticos.',
                                'La comparación inter-país asume equivalencia institucional que no siempre existe (sistemas presidencialistas vs. parlamentarios, federales vs. unitarios).',
                                'Los datos de contratación pública tienen distintos niveles de desagregación según el país, lo que afecta la comparabilidad del pilar fiscal.',
                                'La volatilidad de la BIC en países con alta inestabilidad política hace que el intervalo de confianza sea tan amplio que el valor central pierde significado estadístico.',
                                'El período 2015–2024 excluye reformas anteriores que pueden ser relevantes para entender la trayectoria de largo plazo.'
                            ].map((lim, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 10,
                                        fontFamily: 'var(--sans)',
                                        fontSize: 12.5,
                                        color: 'var(--text-3)',
                                        lineHeight: 1.55
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'var(--text-4)',
                                                fontFamily: 'var(--mono)',
                                                fontSize: 10,
                                                marginTop: 2,
                                                flexShrink: 0
                                            },
                                            children: [
                                                String(i + 1).padStart(2, '0'),
                                                "."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 284,
                                            columnNumber: 17
                                        }, this),
                                        lim
                                    ]
                                }, i, true, {
                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                    lineNumber: 280,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 272,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(H2, {
                            id: "participar",
                            children: "Cómo Participar"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 292,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(P, {
                            children: "Aletheia es una plataforma de investigación colaborativa. Hay tres formas de contribuir:"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 293,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                                marginBottom: 32
                            },
                            children: [
                                {
                                    icon: '💬',
                                    title: 'Foro',
                                    desc: 'Participa en conversaciones sobre países, gobiernos y casos concretos. Tus aportes de contexto enriquecen el análisis colectivo.'
                                },
                                {
                                    icon: '🔔',
                                    title: 'Suscripciones',
                                    desc: 'Suscríbete a países o tipologías para recibir notificaciones cuando el índice cambia o aparecen nuevas señales de riesgo.'
                                },
                                {
                                    icon: '📢',
                                    title: 'Movimientos',
                                    desc: 'Responde a señales de urgencia con firmas y declaraciones. Los movimientos generan presión documental ciudadana.'
                                }
                            ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: 14,
                                        alignItems: 'flex-start',
                                        background: 'var(--bg-2)',
                                        border: '1px solid var(--line-2)',
                                        borderRadius: 10,
                                        padding: '14px 18px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 22,
                                                flexShrink: 0
                                            },
                                            children: item.icon
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 305,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontFamily: 'var(--sans)',
                                                        fontSize: 13.5,
                                                        fontWeight: 600,
                                                        color: 'var(--text)',
                                                        marginBottom: 4
                                                    },
                                                    children: item.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontFamily: 'var(--sans)',
                                                        fontSize: 12.5,
                                                        color: 'var(--text-3)',
                                                        lineHeight: 1.55,
                                                        margin: 0
                                                    },
                                                    children: item.desc
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                                    lineNumber: 308,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                                            lineNumber: 306,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, item.title, true, {
                                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                                    lineNumber: 300,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 294,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: 'var(--bg-2)',
                                border: '1px solid var(--line-2)',
                                borderRadius: 10,
                                padding: '16px 20px',
                                fontFamily: 'var(--sans)',
                                fontSize: 11.5,
                                color: 'var(--text-4)',
                                lineHeight: 1.55
                            },
                            children: "Versión metodológica: 0.4-beta · Período de datos: 2015–2024 · Países cubiertos: 29 · Región: América Latina y el Caribe · Generado con plantillas determinísticas — no corresponde a hechos reales."
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/metodologia/page.tsx",
                            lineNumber: 314,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(app)/metodologia/page.tsx",
                    lineNumber: 133,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(app)/metodologia/page.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(app)/metodologia/page.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_s(MetodologiaPage, "K8E6XuY8skkgdL5oylt3kTupdkM=");
_c3 = MetodologiaPage;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "H2");
__turbopack_context__.k.register(_c1, "P");
__turbopack_context__.k.register(_c2, "Disclaimer");
__turbopack_context__.k.register(_c3, "MetodologiaPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_%28app%29_metodologia_page_tsx_11o2pdo._.js.map