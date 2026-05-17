(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const URL = 'https://yiqxyfesywdswtcjaqeq.supabase.co';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcXh5ZmVzeXdkc3d0Y2phcWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTE3NzYsImV4cCI6MjA5NDQ2Nzc3Nn0.26aatH3JqmPzGEsQbp7kSvNP8KVYiIrnazD38qLWq_c';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(URL, ANON);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/design-tokens.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TOKENS",
    ()=>TOKENS,
    "severityColor",
    ()=>severityColor,
    "severityLabel",
    ()=>severityLabel
]);
const TOKENS = {
    surface: {
        base: '#070d1a',
        elevated: '#0d1729',
        raised: '#152138',
        overlay: 'rgba(13,23,41,0.85)',
        glass: 'rgba(21,33,56,0.6)',
        white: '#ffffff'
    },
    gradient: {
        primary: 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)',
        primaryReverse: 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)',
        accent: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
    },
    brand: {
        cyan: '#06b6d4',
        blue: '#3b82f6',
        indigo: '#6366f1',
        violet: '#8b5cf6'
    },
    text: {
        primary: '#f1f5f9',
        secondary: '#cbd5e1',
        dim: '#94a3b8',
        faint: '#64748b',
        onLight: '#0f172a'
    },
    border: {
        subtle: 'rgba(148,163,184,0.1)',
        default: 'rgba(148,163,184,0.2)',
        strong: 'rgba(148,163,184,0.4)',
        glow: 'rgba(59,130,246,0.5)'
    },
    severity: {
        clean: '#06b6d4',
        low: '#3b82f6',
        medium: '#a855f7',
        high: '#f59e0b',
        critical: '#ef4444',
        noData: '#1e293b'
    },
    motion: {
        fast: 150,
        base: 300,
        slow: 600,
        cinema: 900,
        easing: {
            inOut: [
                0.4,
                0,
                0.2,
                1
            ],
            out: [
                0,
                0,
                0.2,
                1
            ],
            spring: {
                type: 'spring',
                stiffness: 100,
                damping: 20
            }
        }
    }
};
function severityColor(iea) {
    if (iea === null || iea === undefined) return TOKENS.severity.noData;
    if (iea >= 80) return TOKENS.severity.clean;
    if (iea >= 60) return TOKENS.severity.low;
    if (iea >= 40) return TOKENS.severity.medium;
    if (iea >= 20) return TOKENS.severity.high;
    return TOKENS.severity.critical;
}
function severityLabel(iea) {
    if (iea === null || iea === undefined) return 'Sin datos';
    if (iea >= 80) return 'Transparente';
    if (iea >= 60) return 'Bajo riesgo';
    if (iea >= 40) return 'Riesgo moderado';
    if (iea >= 20) return 'Alto riesgo';
    return 'Crítico';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(app)/reportes/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReportesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/design-tokens.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const item = {
    hidden: {
        opacity: 0,
        y: 12
    },
    show: {
        opacity: 1,
        y: 0
    }
};
function ReportesPage() {
    _s();
    const [reports, setReports] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportesPage.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('news_events').select('id,title,summary,corruption_types,severity,published_at,source_name,url').eq('verified', true).order('published_at', {
                ascending: false
            }).limit(60).then({
                "ReportesPage.useEffect": ({ data })=>{
                    setReports((data ?? []).map({
                        "ReportesPage.useEffect": (d)=>({
                                id: d.id,
                                title: d.title,
                                excerpt: d.summary ?? null,
                                corruption_types: d.corruption_types ?? [],
                                severity: d.severity ?? 1,
                                published_at: d.published_at,
                                source_name: d.source_name ?? null,
                                url: d.url ?? null
                            })
                    }["ReportesPage.useEffect"]));
                    setLoading(false);
                }
            }["ReportesPage.useEffect"]);
        }
    }["ReportesPage.useEffect"], []);
    const filtered = reports.filter((r)=>!search || r.title.toLowerCase().includes(search.toLowerCase()));
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
                    borderRight: '1px solid var(--line-2)',
                    padding: '14px',
                    background: 'var(--bg-2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    height: 1,
                                    background: 'var(--accent)',
                                    opacity: 0.25
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/reportes/page.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 8,
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    color: 'var(--accent)'
                                },
                                children: "Filtros"
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/reportes/page.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    height: 1,
                                    background: 'var(--accent)',
                                    opacity: 0.25
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/reportes/page.tsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(app)/reportes/page.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: search,
                        onChange: (e)=>setSearch(e.target.value),
                        placeholder: "Buscar…",
                        style: {
                            width: '100%',
                            background: 'rgba(56,189,248,.04)',
                            border: '1px solid var(--line-2)',
                            color: 'var(--text)',
                            fontFamily: 'var(--mono)',
                            fontSize: 12,
                            padding: '7px 10px',
                            outline: 'none',
                            transition: 'border-color .18s, background .18s, box-shadow .18s'
                        },
                        onFocus: (e)=>{
                            e.currentTarget.style.borderColor = 'var(--accent)';
                            e.currentTarget.style.background = 'rgba(56,189,248,.08)';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(56,189,248,.1)';
                        },
                        onBlur: (e)=>{
                            e.currentTarget.style.borderColor = 'var(--line-2)';
                            e.currentTarget.style.background = 'rgba(56,189,248,.04)';
                            e.currentTarget.style.boxShadow = 'none';
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/reportes/page.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    search && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setSearch(''),
                        style: {
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent)',
                            fontFamily: 'var(--mono)',
                            fontSize: 9,
                            cursor: 'pointer',
                            textAlign: 'left',
                            letterSpacing: '.08em',
                            textTransform: 'uppercase'
                        },
                        children: "Limpiar ×"
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/reportes/page.tsx",
                        lineNumber: 48,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: 'var(--mono)',
                            fontSize: 9,
                            color: 'var(--text-4)'
                        },
                        children: [
                            filtered.length,
                            " resultados"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(app)/reportes/page.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/reportes/page.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflowY: 'auto',
                    padding: 18
                },
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3,1fr)',
                        gap: 14
                    },
                    children: Array.from({
                        length: 9
                    }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                height: 180,
                                background: 'var(--bg-2)',
                                backgroundImage: 'linear-gradient(90deg,transparent 25%,var(--bg-3) 50%,transparent 75%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.5s infinite'
                            }
                        }, i, false, {
                            fileName: "[project]/app/(app)/reportes/page.tsx",
                            lineNumber: 61,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/(app)/reportes/page.tsx",
                    lineNumber: 59,
                    columnNumber: 11
                }, this) : filtered.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: 10
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: 32
                            },
                            children: "📭"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/reportes/page.tsx",
                            lineNumber: 66,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontFamily: 'var(--mono)',
                                fontSize: 10,
                                color: 'var(--text-3)',
                                letterSpacing: '.1em',
                                textTransform: 'uppercase'
                            },
                            children: "Sin reportes"
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/reportes/page.tsx",
                            lineNumber: 67,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(app)/reportes/page.tsx",
                    lineNumber: 65,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    variants: {
                        hidden: {},
                        show: {
                            transition: {
                                staggerChildren: .04
                            }
                        }
                    },
                    initial: "hidden",
                    animate: "show",
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3,1fr)',
                        gap: 14
                    },
                    children: filtered.map((r)=>{
                        const sc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2d$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["severityColor"])(r.severity * 20);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].article, {
                            variants: item,
                            style: {
                                background: 'var(--bg-2)',
                                border: '1px solid var(--line-2)',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'transform .15s, box-shadow .15s'
                            },
                            whileHover: {
                                y: -2,
                                boxShadow: '0 8px 24px rgba(0,0,0,.5)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        height: 2,
                                        background: `linear-gradient(90deg, ${sc}, rgba(56,189,248,.2))`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/reportes/page.tsx",
                                    lineNumber: 79,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '12px 14px',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 8
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontFamily: 'var(--mono)',
                                                        fontSize: 8,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '.08em',
                                                        color: 'var(--accent)',
                                                        opacity: .8
                                                    },
                                                    children: r.source_name ?? '—'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(app)/reportes/page.tsx",
                                                    lineNumber: 82,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontFamily: 'var(--mono)',
                                                        fontSize: 8,
                                                        color: 'var(--text-4)'
                                                    },
                                                    children: new Date(r.published_at).toLocaleDateString('es')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(app)/reportes/page.tsx",
                                                    lineNumber: 83,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(app)/reportes/page.tsx",
                                            lineNumber: 81,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            style: {
                                                fontFamily: 'var(--sans)',
                                                fontSize: 13,
                                                fontWeight: 500,
                                                lineHeight: 1.35,
                                                color: 'var(--text-2)',
                                                margin: 0,
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            },
                                            children: r.title
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/reportes/page.tsx",
                                            lineNumber: 85,
                                            columnNumber: 21
                                        }, this),
                                        r.excerpt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontFamily: 'var(--sans)',
                                                fontSize: 11,
                                                lineHeight: 1.55,
                                                color: 'var(--text-3)',
                                                margin: 0,
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            },
                                            children: r.excerpt
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/reportes/page.tsx",
                                            lineNumber: 89,
                                            columnNumber: 23
                                        }, this),
                                        r.corruption_types.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 4,
                                                marginTop: 'auto'
                                            },
                                            children: r.corruption_types.slice(0, 3).map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontFamily: 'var(--mono)',
                                                        fontSize: 7.5,
                                                        padding: '1px 5px',
                                                        background: 'var(--bg-3)',
                                                        color: 'var(--text-4)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '.06em',
                                                        border: '1px solid var(--line)'
                                                    },
                                                    children: t
                                                }, t, false, {
                                                    fileName: "[project]/app/(app)/reportes/page.tsx",
                                                    lineNumber: 96,
                                                    columnNumber: 27
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/reportes/page.tsx",
                                            lineNumber: 94,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                borderTop: '1px solid var(--line)',
                                                paddingTop: 8,
                                                marginTop: 'auto'
                                            },
                                            children: r.url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: r.url,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                style: {
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 9,
                                                    color: 'var(--accent)',
                                                    textDecoration: 'none',
                                                    letterSpacing: '.08em',
                                                    textTransform: 'uppercase',
                                                    transition: 'opacity .15s'
                                                },
                                                onMouseEnter: (e)=>e.currentTarget.style.opacity = '.7',
                                                onMouseLeave: (e)=>e.currentTarget.style.opacity = '1',
                                                children: "Leer fuente →"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(app)/reportes/page.tsx",
                                                lineNumber: 104,
                                                columnNumber: 25
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 9,
                                                    color: 'var(--text-4)'
                                                },
                                                children: "Sin enlace"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(app)/reportes/page.tsx",
                                                lineNumber: 111,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/reportes/page.tsx",
                                            lineNumber: 102,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(app)/reportes/page.tsx",
                                    lineNumber: 80,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, r.id, true, {
                            fileName: "[project]/app/(app)/reportes/page.tsx",
                            lineNumber: 75,
                            columnNumber: 17
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/app/(app)/reportes/page.tsx",
                    lineNumber: 70,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(app)/reportes/page.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(app)/reportes/page.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_s(ReportesPage, "IU3hbOOkg01FL6QNZVuC2XFf/Qo=");
_c = ReportesPage;
var _c;
__turbopack_context__.k.register(_c, "ReportesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_02y-6e3._.js.map