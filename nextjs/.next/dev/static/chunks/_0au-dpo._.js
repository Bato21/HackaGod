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
"[project]/components/nav/AccountDropdown.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AccountDropdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const ROLE_COLORS = {
    PERIODISTA: '#06b6d4',
    ACTIVISTA: '#a855f7',
    INVESTIGADOR: '#3b82f6',
    CIUDADANO: '#94a3b8'
};
const MENU_ITEMS = [
    {
        label: 'Mi perfil',
        href: '/perfil',
        icon: '◎'
    },
    {
        label: 'Mis suscripciones',
        href: '/perfil/suscripciones',
        icon: '◉'
    },
    {
        label: 'Mis hilos',
        href: '/perfil/hilos',
        icon: '◈'
    },
    {
        label: 'Configuración',
        href: '/configuracion',
        icon: '⚙'
    }
];
function AccountDropdown({ user, isGuest }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const username = isGuest ? 'INVITADO' : user?.username ?? user?.email?.split('@')[0]?.toUpperCase() ?? 'USUARIO';
    const role = (user?.role ?? 'CIUDADANO').toUpperCase();
    const roleColor = ROLE_COLORS[role] ?? '#94a3b8';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AccountDropdown.useEffect": ()=>{
            function onMouseDown(e) {
                if (ref.current && !ref.current.contains(e.target)) setOpen(false);
            }
            function onKeyDown(e) {
                if (e.key === 'Escape') setOpen(false);
            }
            document.addEventListener('mousedown', onMouseDown);
            document.addEventListener('keydown', onKeyDown);
            return ({
                "AccountDropdown.useEffect": ()=>{
                    document.removeEventListener('mousedown', onMouseDown);
                    document.removeEventListener('keydown', onKeyDown);
                }
            })["AccountDropdown.useEffect"];
        }
    }["AccountDropdown.useEffect"], []);
    async function handleSignOut() {
        setOpen(false);
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
        router.push('/login');
    }
    const avatarStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--mono)',
        color: '#fff',
        fontWeight: 700,
        background: isGuest ? 'rgba(6,182,212,0.25)' : 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)',
        border: `1.5px solid ${isGuest ? 'rgba(6,182,212,0.4)' : 'rgba(124,58,237,0.5)'}`,
        borderRadius: '50%',
        flexShrink: 0
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        style: {
            position: 'relative'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setOpen((v)=>!v),
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: open ? 'rgba(15,23,42,0.5)' : 'transparent',
                    border: `1px solid ${open ? 'rgba(148,163,184,0.25)' : 'transparent'}`,
                    padding: '4px 8px 4px 6px',
                    cursor: 'pointer',
                    borderRadius: 8,
                    transition: 'all .15s'
                },
                onMouseEnter: (e)=>{
                    e.currentTarget.style.background = 'rgba(15,23,42,0.4)';
                    e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)';
                },
                onMouseLeave: (e)=>{
                    if (!open) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                    }
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            ...avatarStyle,
                            width: 28,
                            height: 28,
                            fontSize: 11
                        },
                        children: username.charAt(0)
                    }, void 0, false, {
                        fileName: "[project]/components/nav/AccountDropdown.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 9,
                                    color: 'var(--text)',
                                    letterSpacing: '0.07em',
                                    lineHeight: 1
                                },
                                children: username
                            }, void 0, false, {
                                fileName: "[project]/components/nav/AccountDropdown.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 7,
                                    letterSpacing: '0.12em',
                                    color: isGuest ? '#06b6d4' : roleColor,
                                    background: isGuest ? 'rgba(6,182,212,0.1)' : `${roleColor}18`,
                                    border: `1px solid ${isGuest ? 'rgba(6,182,212,0.3)' : `${roleColor}35`}`,
                                    padding: '0 4px',
                                    borderRadius: 2,
                                    lineHeight: 1.6
                                },
                                children: isGuest ? 'INVITADO' : role
                            }, void 0, false, {
                                fileName: "[project]/components/nav/AccountDropdown.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/nav/AccountDropdown.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: 'var(--text-3)',
                            fontSize: 9,
                            marginLeft: 2,
                            transform: open ? 'rotate(180deg)' : 'none',
                            transition: 'transform .2s',
                            display: 'inline-block'
                        },
                        children: "▾"
                    }, void 0, false, {
                        fileName: "[project]/components/nav/AccountDropdown.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/nav/AccountDropdown.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        scale: 0.96,
                        y: -6
                    },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: 0.96,
                        y: -6
                    },
                    transition: {
                        duration: 0.15,
                        ease: [
                            0.4,
                            0,
                            0.2,
                            1
                        ]
                    },
                    style: {
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        width: 260,
                        zIndex: 200,
                        background: 'rgba(9,18,34,0.97)',
                        border: '1px solid rgba(148,163,184,0.15)',
                        borderRadius: 12,
                        boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(6,182,212,0.04)',
                        backdropFilter: 'blur(20px)',
                        overflow: 'hidden'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '14px 14px 12px',
                                borderBottom: '1px solid rgba(148,163,184,0.1)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            ...avatarStyle,
                                            width: 44,
                                            height: 44,
                                            fontSize: 17
                                        },
                                        children: username.charAt(0)
                                    }, void 0, false, {
                                        fileName: "[project]/components/nav/AccountDropdown.tsx",
                                        lineNumber: 144,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 12,
                                                    color: 'var(--text)',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.04em'
                                                },
                                                children: username
                                            }, void 0, false, {
                                                fileName: "[project]/components/nav/AccountDropdown.tsx",
                                                lineNumber: 148,
                                                columnNumber: 19
                                            }, this),
                                            !isGuest && user?.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 9,
                                                    color: 'var(--text-3)',
                                                    marginTop: 1
                                                },
                                                children: user.email
                                            }, void 0, false, {
                                                fileName: "[project]/components/nav/AccountDropdown.tsx",
                                                lineNumber: 152,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    display: 'inline-block',
                                                    marginTop: 4,
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 7.5,
                                                    letterSpacing: '0.12em',
                                                    color: isGuest ? '#06b6d4' : roleColor,
                                                    background: isGuest ? 'rgba(6,182,212,0.1)' : `${roleColor}18`,
                                                    border: `1px solid ${isGuest ? 'rgba(6,182,212,0.3)' : `${roleColor}35`}`,
                                                    padding: '1px 6px',
                                                    borderRadius: 3
                                                },
                                                children: isGuest ? 'INVITADO' : role
                                            }, void 0, false, {
                                                fileName: "[project]/components/nav/AccountDropdown.tsx",
                                                lineNumber: 156,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/nav/AccountDropdown.tsx",
                                        lineNumber: 147,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/nav/AccountDropdown.tsx",
                                lineNumber: 143,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/nav/AccountDropdown.tsx",
                            lineNumber: 142,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '6px 0',
                                borderBottom: '1px solid rgba(148,163,184,0.1)'
                            },
                            children: isGuest ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px 12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: 'rgba(6,182,212,0.06)',
                                            border: '1px solid rgba(6,182,212,0.15)',
                                            borderRadius: 8,
                                            padding: '10px 12px',
                                            marginBottom: 10
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontFamily: 'var(--sans)',
                                                fontSize: 11,
                                                color: 'var(--text-3)',
                                                lineHeight: 1.5,
                                                margin: 0
                                            },
                                            children: "Estás navegando como invitado. Crea una cuenta para participar en el foro y suscribirte a países."
                                        }, void 0, false, {
                                            fileName: "[project]/components/nav/AccountDropdown.tsx",
                                            lineNumber: 178,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/nav/AccountDropdown.tsx",
                                        lineNumber: 174,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setOpen(false);
                                            router.push('/login');
                                        },
                                        style: {
                                            width: '100%',
                                            padding: '9px',
                                            background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
                                            border: 'none',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                            fontFamily: 'var(--mono)',
                                            fontSize: 10,
                                            color: '#fff',
                                            fontWeight: 700,
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            marginBottom: 6
                                        },
                                        children: "Crear cuenta"
                                    }, void 0, false, {
                                        fileName: "[project]/components/nav/AccountDropdown.tsx",
                                        lineNumber: 182,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setOpen(false);
                                            router.push('/login');
                                        },
                                        style: {
                                            width: '100%',
                                            padding: '6px',
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontFamily: 'var(--mono)',
                                            fontSize: 9,
                                            color: 'var(--text-3)'
                                        },
                                        children: "Iniciar sesión"
                                    }, void 0, false, {
                                        fileName: "[project]/components/nav/AccountDropdown.tsx",
                                        lineNumber: 195,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/nav/AccountDropdown.tsx",
                                lineNumber: 173,
                                columnNumber: 17
                            }, this) : MENU_ITEMS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setOpen(false);
                                        router.push(item.href);
                                    },
                                    style: {
                                        width: '100%',
                                        padding: '9px 14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'background .1s'
                                    },
                                    onMouseEnter: (e)=>e.currentTarget.style.background = 'rgba(148,163,184,0.06)',
                                    onMouseLeave: (e)=>e.currentTarget.style.background = 'transparent',
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'var(--text-4)',
                                                fontSize: 12,
                                                width: 16,
                                                textAlign: 'center'
                                            },
                                            children: item.icon
                                        }, void 0, false, {
                                            fileName: "[project]/components/nav/AccountDropdown.tsx",
                                            lineNumber: 220,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: 'var(--sans)',
                                                fontSize: 12,
                                                color: 'var(--text-2)'
                                            },
                                            children: item.label
                                        }, void 0, false, {
                                            fileName: "[project]/components/nav/AccountDropdown.tsx",
                                            lineNumber: 221,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, item.href, true, {
                                    fileName: "[project]/components/nav/AccountDropdown.tsx",
                                    lineNumber: 208,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/nav/AccountDropdown.tsx",
                            lineNumber: 171,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '6px 0'
                            },
                            children: isGuest ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setOpen(false);
                                    router.push('/login');
                                },
                                style: {
                                    width: '100%',
                                    padding: '9px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'background .1s'
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.background = 'rgba(148,163,184,0.06)',
                                onMouseLeave: (e)=>e.currentTarget.style.background = 'transparent',
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: 'var(--text-4)',
                                            fontSize: 12,
                                            width: 16,
                                            textAlign: 'center'
                                        },
                                        children: "←"
                                    }, void 0, false, {
                                        fileName: "[project]/components/nav/AccountDropdown.tsx",
                                        lineNumber: 241,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: 'var(--sans)',
                                            fontSize: 12,
                                            color: 'var(--text-2)'
                                        },
                                        children: "Volver al inicio"
                                    }, void 0, false, {
                                        fileName: "[project]/components/nav/AccountDropdown.tsx",
                                        lineNumber: 242,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/nav/AccountDropdown.tsx",
                                lineNumber: 230,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSignOut,
                                style: {
                                    width: '100%',
                                    padding: '9px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'background .1s'
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.background = 'rgba(239,68,68,0.06)',
                                onMouseLeave: (e)=>e.currentTarget.style.background = 'transparent',
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: '#ef4444',
                                            fontSize: 12,
                                            width: 16,
                                            textAlign: 'center'
                                        },
                                        children: "⏻"
                                    }, void 0, false, {
                                        fileName: "[project]/components/nav/AccountDropdown.tsx",
                                        lineNumber: 256,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: 'var(--sans)',
                                            fontSize: 12,
                                            color: '#ef4444'
                                        },
                                        children: "Cerrar sesión"
                                    }, void 0, false, {
                                        fileName: "[project]/components/nav/AccountDropdown.tsx",
                                        lineNumber: 257,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/nav/AccountDropdown.tsx",
                                lineNumber: 245,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/nav/AccountDropdown.tsx",
                            lineNumber: 228,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/nav/AccountDropdown.tsx",
                    lineNumber: 125,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/nav/AccountDropdown.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/nav/AccountDropdown.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
_s(AccountDropdown, "Y4/ALO2K9sMuFzAy1cWsRXC2G6s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AccountDropdown;
var _c;
__turbopack_context__.k.register(_c, "AccountDropdown");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/nav/TopNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TopNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$nav$2f$AccountDropdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/nav/AccountDropdown.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const NAV_PILLS = [
    {
        href: '/foro',
        label: 'FORO'
    },
    {
        href: '/metodologia',
        label: 'METODOLOGÍA'
    }
];
function TopNav() {
    _s();
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isGuest, setIsGuest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [darkMode, setDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopNav.useEffect": ()=>{
            const guest = ("TURBOPACK compile-time value", "object") !== 'undefined' && sessionStorage.getItem('aletheia_guest') === '1';
            setIsGuest(guest);
            if (!guest) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser().then({
                    "TopNav.useEffect": ({ data })=>{
                        if (data.user) {
                            setUser({
                                email: data.user.email,
                                username: data.user.user_metadata?.username,
                                role: data.user.user_metadata?.role
                            });
                        }
                    }
                }["TopNav.useEffect"]);
            }
        }
    }["TopNav.useEffect"], []);
    function pillStyle(active) {
        return {
            fontFamily: 'var(--mono)',
            fontSize: 7.5,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: active ? 'var(--text)' : 'var(--text-3)',
            textDecoration: 'none',
            padding: '4px 11px',
            borderRadius: 999,
            border: `1px solid ${active ? 'rgba(6,182,212,0.6)' : 'rgba(148,163,184,0.2)'}`,
            background: active ? 'rgba(6,182,212,0.08)' : 'transparent',
            transition: 'color .15s, border-color .15s, background .15s',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
        };
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].nav, {
        initial: {
            y: -46,
            opacity: 0
        },
        animate: {
            y: 0,
            opacity: 1
        },
        transition: {
            duration: 0.45,
            ease: [
                0.22,
                1,
                0.36,
                1
            ]
        },
        style: {
            height: 46,
            background: 'var(--bg-2)',
            borderBottom: '1px solid var(--line-2)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            flexShrink: 0,
            position: 'relative',
            zIndex: 50,
            gap: 10
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
                fileName: "[project]/components/nav/TopNav.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/atlas",
                style: {
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexShrink: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 9,
                            height: 9,
                            background: 'var(--accent)',
                            transform: 'rotate(45deg)',
                            flexShrink: 0,
                            boxShadow: '0 0 8px rgba(56,189,248,0.5)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/nav/TopNav.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: 'var(--serif)',
                            fontWeight: 900,
                            fontSize: 18,
                            letterSpacing: '-0.02em',
                            color: 'var(--text)'
                        },
                        children: "Aletheia"
                    }, void 0, false, {
                        fileName: "[project]/components/nav/TopNav.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: 'var(--mono)',
                            fontSize: 7,
                            color: 'var(--text-3)',
                            letterSpacing: '0.13em',
                            textTransform: 'uppercase',
                            borderLeft: '1px solid var(--line-2)',
                            paddingLeft: 8,
                            whiteSpace: 'nowrap'
                        },
                        children: "ÍNDICE ILUSTRATIVO · AMÉRICA · 2015–2024"
                    }, void 0, false, {
                        fileName: "[project]/components/nav/TopNav.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/nav/TopNav.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1
                }
            }, void 0, false, {
                fileName: "[project]/components/nav/TopNav.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: 'var(--mono)',
                            fontSize: 7,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: 'var(--text-4)',
                            border: '1px solid rgba(148,163,184,0.15)',
                            padding: '3px 8px',
                            borderRadius: 999,
                            background: 'rgba(148,163,184,0.03)',
                            userSelect: 'none'
                        },
                        children: "DATOS · FICTICIOS"
                    }, void 0, false, {
                        fileName: "[project]/components/nav/TopNav.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    NAV_PILLS.map(({ href, label })=>{
                        const active = path.startsWith(href);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: href,
                            style: pillStyle(active),
                            onMouseEnter: (e)=>{
                                if (!active) {
                                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)';
                                    e.currentTarget.style.color = 'var(--text)';
                                }
                            },
                            onMouseLeave: (e)=>{
                                if (!active) {
                                    e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)';
                                    e.currentTarget.style.color = 'var(--text-3)';
                                }
                            },
                            children: label
                        }, href, false, {
                            fileName: "[project]/components/nav/TopNav.tsx",
                            lineNumber: 116,
                            columnNumber: 13
                        }, this);
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setDarkMode((v)=>!v),
                        style: pillStyle(false),
                        onMouseEnter: (e)=>{
                            e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)';
                            e.currentTarget.style.color = 'var(--text)';
                        },
                        onMouseLeave: (e)=>{
                            e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)';
                            e.currentTarget.style.color = 'var(--text-3)';
                        },
                        children: darkMode ? '◑ OSCURO' : '◐ CLARO'
                    }, void 0, false, {
                        fileName: "[project]/components/nav/TopNav.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 1,
                            height: 18,
                            background: 'var(--line-2)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/nav/TopNav.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$nav$2f$AccountDropdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        user: user,
                        isGuest: isGuest
                    }, void 0, false, {
                        fileName: "[project]/components/nav/TopNav.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/nav/TopNav.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/nav/TopNav.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_s(TopNav, "ZG5DCC3LV2gcKdmICuGBs6f9NIE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = TopNav;
var _c;
__turbopack_context__.k.register(_c, "TopNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0au-dpo._.js.map