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
"[project]/app/(app)/foro/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ForoPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const ALERT = {
    watch: {
        color: 'var(--gold)',
        label: 'Seguimiento'
    },
    alert: {
        color: 'var(--warn)',
        label: 'Alerta'
    },
    urgent: {
        color: 'var(--bad)',
        label: 'Urgente'
    }
};
const TABS = [
    'Recientes',
    'Más urgentes',
    'Con respuestas'
];
function ForoPage() {
    _s();
    const [threads, setThreads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Recientes');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ForoPage.useEffect": ()=>{
            setLoading(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('forum_threads').select('*').order(tab === 'Más urgentes' ? 'alert_level' : tab === 'Con respuestas' ? 'reply_count' : 'created_at', {
                ascending: false
            }).limit(80).then({
                "ForoPage.useEffect": ({ data })=>{
                    setThreads(data ?? []);
                    setLoading(false);
                }
            }["ForoPage.useEffect"]);
        }
    }["ForoPage.useEffect"], [
        tab
    ]);
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
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
            background: 'var(--bg)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '0 20px',
                    height: 46,
                    borderBottom: '1px solid var(--line-2)',
                    flexShrink: 0,
                    background: 'var(--bg-2)',
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            bottom: -1,
                            left: 0,
                            right: 0,
                            height: 1,
                            background: 'linear-gradient(90deg, var(--accent), transparent 60%)',
                            opacity: 0.5,
                            pointerEvents: 'none'
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        style: {
                            fontFamily: 'var(--serif)',
                            fontSize: 22,
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                            color: 'var(--text)',
                            flexShrink: 0
                        },
                        children: "Tribuna"
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: 'var(--mono)',
                            fontSize: 8,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'var(--text-3)',
                            borderLeft: '1px solid var(--line-2)',
                            paddingLeft: 14
                        },
                        children: "Investigación colaborativa"
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginLeft: 'auto',
                            display: 'flex',
                            gap: 2
                        },
                        children: TABS.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setTab(t),
                                style: {
                                    padding: '5px 12px',
                                    background: tab === t ? 'var(--bg-3)' : 'transparent',
                                    color: tab === t ? 'var(--accent)' : 'var(--text-3)',
                                    border: tab === t ? '1px solid var(--line-2)' : '1px solid transparent',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--mono)',
                                    fontSize: 9,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    transition: 'all .15s'
                                },
                                children: t
                            }, t, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 46,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        style: {
                            padding: '7px 16px',
                            background: 'transparent',
                            border: '1px solid rgba(56,189,248,.4)',
                            color: 'var(--accent)',
                            cursor: 'pointer',
                            fontFamily: 'var(--mono)',
                            fontSize: 9,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            transition: 'all .18s'
                        },
                        onMouseEnter: (e)=>{
                            e.currentTarget.style.background = 'rgba(56,189,248,.08)';
                            e.currentTarget.style.borderColor = 'var(--accent)';
                        },
                        onMouseLeave: (e)=>{
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'rgba(56,189,248,.4)';
                        },
                        children: "+ Nuevo hilo"
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflowY: 'auto',
                    background: 'var(--bg-2)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '10px 18px',
                            borderBottom: '1px solid var(--line)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            position: 'sticky',
                            top: 0,
                            background: 'var(--bg-2)',
                            zIndex: 1
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontFamily: 'var(--mono)',
                                fontSize: 9.5,
                                color: 'var(--text-3)'
                            },
                            children: loading ? '…' : `${threads.length} conversaciones`
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/foro/page.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '12px 20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4
                        },
                        children: Array.from({
                            length: 8
                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: 72,
                                    background: 'var(--bg-3)',
                                    backgroundImage: 'linear-gradient(90deg,transparent 25%,var(--bg-4) 50%,transparent 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 1.5s infinite'
                                }
                            }, i, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 84,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 82,
                        columnNumber: 11
                    }, this) : threads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                children: "💬"
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 10,
                                    color: 'var(--text-3)',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase'
                                },
                                children: "Sin hilos activos"
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 88,
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
                        children: threads.map((t)=>{
                            const s = ALERT[t.alert_level] ?? ALERT.watch;
                            const isUrgent = t.alert_level === 'urgent';
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                variants: {
                                    hidden: {
                                        opacity: 0,
                                        x: -6
                                    },
                                    show: {
                                        opacity: 1,
                                        x: 0,
                                        transition: {
                                            duration: .25
                                        }
                                    }
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/foro/${t.id}`,
                                    style: {
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 12,
                                        padding: '13px 18px',
                                        borderBottom: '1px solid var(--line)',
                                        textDecoration: 'none',
                                        transition: 'all .12s',
                                        borderLeft: '2px solid transparent'
                                    },
                                    onMouseEnter: (e)=>{
                                        e.currentTarget.style.background = 'var(--bg-3)';
                                        e.currentTarget.style.borderLeftColor = 'rgba(56,189,248,.3)';
                                    },
                                    onMouseLeave: (e)=>{
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderLeftColor = 'transparent';
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                flexShrink: 0,
                                                fontFamily: 'var(--mono)',
                                                fontSize: 7.5,
                                                padding: '2px 6px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.12em',
                                                border: `1px solid ${s.color}44`,
                                                color: s.color,
                                                background: `${s.color}10`,
                                                marginTop: 2,
                                                animation: isUrgent ? 'pulse 1.5s ease-in-out infinite' : 'none'
                                            },
                                            children: s.label
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/foro/page.tsx",
                                            lineNumber: 109,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                flex: 1
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    style: {
                                                        fontFamily: 'var(--sans)',
                                                        fontSize: 12.5,
                                                        fontWeight: 500,
                                                        lineHeight: 1.35,
                                                        color: 'var(--text-2)',
                                                        margin: '0 0 5px',
                                                        overflow: 'hidden',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical'
                                                    },
                                                    children: t.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                                    lineNumber: 119,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        gap: 10,
                                                        fontFamily: 'var(--mono)',
                                                        fontSize: 8,
                                                        color: 'var(--text-4)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                t.reply_count,
                                                                " respuestas"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(app)/foro/page.tsx",
                                                            lineNumber: 123,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: new Date(t.created_at).toLocaleDateString('es')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(app)/foro/page.tsx",
                                                            lineNumber: 124,
                                                            columnNumber: 25
                                                        }, this),
                                                        t.pinned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: 'var(--accent)'
                                                            },
                                                            children: "📌 Fijado"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(app)/foro/page.tsx",
                                                            lineNumber: 125,
                                                            columnNumber: 38
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                                    lineNumber: 122,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(app)/foro/page.tsx",
                                            lineNumber: 118,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                    lineNumber: 100,
                                    columnNumber: 19
                                }, this)
                            }, t.id, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 98,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(app)/foro/page.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(ForoPage, "wniayNm5TPcrUs2NSMeC9cOZPak=");
_c = ForoPage;
var _c;
__turbopack_context__.k.register(_c, "ForoPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0a~p42.._.js.map