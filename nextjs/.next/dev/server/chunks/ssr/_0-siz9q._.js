module.exports = [
"[project]/components/atlas/LeftPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeftPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
const SEV_COLOR = {
    clean: '#0e7490',
    low: '#0891b2',
    medlow: '#a3e635',
    mid: '#facc15',
    midhigh: '#f97316',
    high: '#dc2626',
    critical: '#7f1d1d'
};
function ieaColor(iea) {
    if (iea === null) return '#1e293b';
    if (iea <= 20) return '#dc2626';
    if (iea <= 35) return '#f97316';
    if (iea <= 50) return '#facc15';
    if (iea <= 65) return '#a3e635';
    if (iea <= 80) return '#0891b2';
    return '#0e7490';
}
const STORAGE_KEY = 'aletheia.atlas.leftPanel';
function LeftPanel({ countries, selected, onSelect, year, rangeMin, rangeMax, onRange }) {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return true;
        //TURBOPACK unreachable
        ;
        const v = undefined;
    });
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [sort, setSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('corrupt');
    const [localMin, setLocalMin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(rangeMin);
    const [localMax, setLocalMax] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(rangeMax);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setLocalMin(rangeMin);
    }, [
        rangeMin
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setLocalMax(rangeMax);
    }, [
        rangeMax
    ]);
    function toggleOpen() {
        setOpen((v)=>{
            const next = !v;
            try {
                localStorage.setItem(STORAGE_KEY, String(next));
            } catch  {}
            return next;
        });
    }
    const filtered = countries.filter((c)=>{
        const q = search.toLowerCase();
        if (q && !c.name.toLowerCase().includes(q) && !c.iso3.toLowerCase().includes(q)) return false;
        if (c.iea !== null && (c.iea < localMin || c.iea > localMax)) return false;
        return true;
    }).sort((a, b)=>{
        if (sort === 'az') return a.name.localeCompare(b.name, 'es');
        if (sort === 'corrupt') return (a.iea ?? 999) - (b.iea ?? 999);
        return (b.iea ?? -999) - (a.iea ?? -999);
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            position: 'relative',
            height: '100%'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                initial: false,
                children: open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        width: 0,
                        opacity: 0
                    },
                    animate: {
                        width: 300,
                        opacity: 1
                    },
                    exit: {
                        width: 0,
                        opacity: 0
                    },
                    transition: {
                        duration: 0.3,
                        ease: [
                            0.4,
                            0,
                            0.2,
                            1
                        ]
                    },
                    style: {
                        background: 'var(--bg-2)',
                        borderRight: '1px solid var(--line-2)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        height: '100%',
                        flexShrink: 0
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '10px 12px 8px',
                                borderBottom: '1px solid var(--line)',
                                flexShrink: 0
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'relative'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            position: 'absolute',
                                            left: 9,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--text-3)',
                                            fontSize: 12
                                        },
                                        children: "⌕"
                                    }, void 0, false, {
                                        fileName: "[project]/components/atlas/LeftPanel.tsx",
                                        lineNumber: 105,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: search,
                                        onChange: (e)=>setSearch(e.target.value),
                                        placeholder: "Buscar país, código…",
                                        style: {
                                            width: '100%',
                                            background: 'rgba(56,189,248,.04)',
                                            border: '1px solid var(--line-2)',
                                            color: 'var(--text)',
                                            fontFamily: 'var(--mono)',
                                            fontSize: 11,
                                            padding: '7px 30px 7px 28px',
                                            outline: 'none',
                                            borderRadius: 6,
                                            boxSizing: 'border-box',
                                            transition: 'border-color .15s, box-shadow .15s'
                                        },
                                        onFocus: (e)=>{
                                            e.currentTarget.style.borderColor = 'var(--accent)';
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(56,189,248,0.1)';
                                        },
                                        onBlur: (e)=>{
                                            e.currentTarget.style.borderColor = 'var(--line-2)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/atlas/LeftPanel.tsx",
                                        lineNumber: 106,
                                        columnNumber: 17
                                    }, this),
                                    search && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSearch(''),
                                        style: {
                                            position: 'absolute',
                                            right: 8,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--text-3)',
                                            fontSize: 13,
                                            padding: 0,
                                            lineHeight: 1
                                        },
                                        children: "×"
                                    }, void 0, false, {
                                        fileName: "[project]/components/atlas/LeftPanel.tsx",
                                        lineNumber: 128,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/atlas/LeftPanel.tsx",
                                lineNumber: 104,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/atlas/LeftPanel.tsx",
                            lineNumber: 103,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '10px 12px 8px',
                                borderBottom: '1px solid var(--line)',
                                flexShrink: 0
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 8
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: 'var(--mono)',
                                                fontSize: 7.5,
                                                letterSpacing: '0.14em',
                                                textTransform: 'uppercase',
                                                color: 'var(--text-3)'
                                            },
                                            children: "FILTRO POR RANGO"
                                        }, void 0, false, {
                                            fileName: "[project]/components/atlas/LeftPanel.tsx",
                                            lineNumber: 143,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontFamily: 'var(--mono)',
                                                fontSize: 8.5,
                                                color: 'var(--accent)'
                                            },
                                            children: [
                                                localMin,
                                                "–",
                                                localMax
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/atlas/LeftPanel.tsx",
                                            lineNumber: 146,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/atlas/LeftPanel.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: 8
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "range",
                                            min: 0,
                                            max: localMax,
                                            value: localMin,
                                            onChange: (e)=>{
                                                const v = +e.target.value;
                                                setLocalMin(v);
                                                onRange(v, localMax);
                                            },
                                            style: {
                                                flex: 1,
                                                accentColor: 'var(--accent)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/atlas/LeftPanel.tsx",
                                            lineNumber: 151,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "range",
                                            min: localMin,
                                            max: 100,
                                            value: localMax,
                                            onChange: (e)=>{
                                                const v = +e.target.value;
                                                setLocalMax(v);
                                                onRange(localMin, v);
                                            },
                                            style: {
                                                flex: 1,
                                                accentColor: 'var(--accent)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/atlas/LeftPanel.tsx",
                                            lineNumber: 156,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/atlas/LeftPanel.tsx",
                                    lineNumber: 150,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: 6,
                                        marginTop: 6
                                    },
                                    children: [
                                        localMin,
                                        localMax
                                    ].map((val, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            min: 0,
                                            max: 100,
                                            value: val,
                                            onChange: (e)=>{
                                                const v = Math.max(0, Math.min(100, +e.target.value));
                                                if (i === 0) {
                                                    setLocalMin(v);
                                                    onRange(v, localMax);
                                                } else {
                                                    setLocalMax(v);
                                                    onRange(localMin, v);
                                                }
                                            },
                                            style: {
                                                flex: 1,
                                                background: 'var(--bg-3)',
                                                border: '1px solid var(--line-2)',
                                                color: 'var(--text)',
                                                fontFamily: 'var(--mono)',
                                                fontSize: 11,
                                                padding: '4px 6px',
                                                borderRadius: 4,
                                                outline: 'none',
                                                textAlign: 'center'
                                            }
                                        }, i, false, {
                                            fileName: "[project]/components/atlas/LeftPanel.tsx",
                                            lineNumber: 164,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/LeftPanel.tsx",
                                    lineNumber: 162,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/atlas/LeftPanel.tsx",
                            lineNumber: 141,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '8px 12px',
                                borderBottom: '1px solid var(--line)',
                                flexShrink: 0
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontFamily: 'var(--mono)',
                                        fontSize: 7.5,
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        color: 'var(--text-3)',
                                        marginBottom: 7
                                    },
                                    children: "ORDEN"
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/LeftPanel.tsx",
                                    lineNumber: 184,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: 4
                                    },
                                    children: [
                                        {
                                            id: 'corrupt',
                                            label: '+ Corruptos'
                                        },
                                        {
                                            id: 'clean',
                                            label: '+ Limpios'
                                        },
                                        {
                                            id: 'az',
                                            label: 'A–Z'
                                        }
                                    ].map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSort(o.id),
                                            style: {
                                                flex: 1,
                                                padding: '5px 4px',
                                                fontFamily: 'var(--mono)',
                                                fontSize: 7.5,
                                                letterSpacing: '0.06em',
                                                textTransform: 'uppercase',
                                                cursor: 'pointer',
                                                borderRadius: 5,
                                                border: 'none',
                                                transition: 'all .15s',
                                                background: sort === o.id ? 'linear-gradient(135deg,#0ea5e9,#7c3aed)' : 'rgba(148,163,184,0.08)',
                                                color: sort === o.id ? '#fff' : 'var(--text-3)'
                                            },
                                            children: o.label
                                        }, o.id, false, {
                                            fileName: "[project]/components/atlas/LeftPanel.tsx",
                                            lineNumber: 193,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/LeftPanel.tsx",
                                    lineNumber: 187,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/atlas/LeftPanel.tsx",
                            lineNumber: 183,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flexShrink: 0,
                                padding: '8px 12px 4px',
                                borderBottom: '1px solid var(--line)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: 'var(--mono)',
                                            fontSize: 8,
                                            letterSpacing: '0.14em',
                                            textTransform: 'uppercase',
                                            color: 'var(--text-3)'
                                        },
                                        children: [
                                            "RANKING · ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: 'var(--accent)'
                                                },
                                                children: filtered.length
                                            }, void 0, false, {
                                                fileName: "[project]/components/atlas/LeftPanel.tsx",
                                                lineNumber: 216,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/atlas/LeftPanel.tsx",
                                        lineNumber: 215,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: 'var(--mono)',
                                            fontSize: 8,
                                            color: 'var(--text-4)'
                                        },
                                        children: year
                                    }, void 0, false, {
                                        fileName: "[project]/components/atlas/LeftPanel.tsx",
                                        lineNumber: 218,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/atlas/LeftPanel.tsx",
                                lineNumber: 214,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/atlas/LeftPanel.tsx",
                            lineNumber: 213,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: 1,
                                overflowY: 'auto'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                                    children: `::-webkit-scrollbar{width:2px}::-webkit-scrollbar-thumb{background:var(--line-2)}`
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/LeftPanel.tsx",
                                    lineNumber: 223,
                                    columnNumber: 15
                                }, this),
                                filtered.map((c, idx)=>{
                                    const active = c.iso3 === selected;
                                    const color = ieaColor(c.iea);
                                    const inRange = c.iea === null || c.iea >= localMin && c.iea <= localMax;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        onClick: ()=>onSelect(c.iso3),
                                        whileHover: {
                                            backgroundColor: active ? undefined : 'rgba(16,30,52,0.9)'
                                        },
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: '26px 20px 1fr 46px 10px',
                                            gap: 5,
                                            alignItems: 'center',
                                            padding: '7px 12px 7px 10px',
                                            cursor: 'pointer',
                                            borderLeft: `3px solid ${active ? 'var(--accent)' : 'transparent'}`,
                                            background: active ? 'var(--bg-4)' : 'transparent',
                                            borderBottom: '1px solid var(--line)',
                                            opacity: inRange ? 1 : 0.35,
                                            transition: 'background .12s, border-left-color .12s, opacity .2s'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 8,
                                                    color: 'var(--text-4)',
                                                    textAlign: 'right'
                                                },
                                                children: String(idx + 1).padStart(2, '0')
                                            }, void 0, false, {
                                                fileName: "[project]/components/atlas/LeftPanel.tsx",
                                                lineNumber: 244,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 11,
                                                    textAlign: 'center'
                                                },
                                                children: c.flag
                                            }, void 0, false, {
                                                fileName: "[project]/components/atlas/LeftPanel.tsx",
                                                lineNumber: 247,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 11.5,
                                                    color: active ? 'var(--text)' : 'var(--text-2)',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    transition: 'color .12s'
                                                },
                                                children: c.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/atlas/LeftPanel.tsx",
                                                lineNumber: 248,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 10.5,
                                                    fontWeight: 600,
                                                    textAlign: 'right',
                                                    color,
                                                    transition: 'color .12s'
                                                },
                                                children: c.iea !== null ? c.iea.toFixed(1) : '—'
                                            }, void 0, false, {
                                                fileName: "[project]/components/atlas/LeftPanel.tsx",
                                                lineNumber: 251,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 7,
                                                    height: 7,
                                                    borderRadius: 2,
                                                    background: color,
                                                    flexShrink: 0
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/atlas/LeftPanel.tsx",
                                                lineNumber: 254,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, c.iso3, true, {
                                        fileName: "[project]/components/atlas/LeftPanel.tsx",
                                        lineNumber: 229,
                                        columnNumber: 19
                                    }, this);
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/atlas/LeftPanel.tsx",
                            lineNumber: 222,
                            columnNumber: 13
                        }, this)
                    ]
                }, "panel", true, {
                    fileName: "[project]/components/atlas/LeftPanel.tsx",
                    lineNumber: 90,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/atlas/LeftPanel.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: toggleOpen,
                style: {
                    position: 'absolute',
                    right: open ? -14 : 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    width: 14,
                    height: 48,
                    background: 'var(--bg-3)',
                    border: '1px solid var(--line-2)',
                    borderRadius: '0 6px 6px 0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-3)',
                    fontSize: 9,
                    transition: 'background .15s, color .15s, right .3s'
                },
                onMouseEnter: (e)=>{
                    e.currentTarget.style.background = 'var(--bg-4)';
                    e.currentTarget.style.color = 'var(--text)';
                },
                onMouseLeave: (e)=>{
                    e.currentTarget.style.background = 'var(--bg-3)';
                    e.currentTarget.style.color = 'var(--text-3)';
                },
                title: open ? 'Colapsar panel' : 'Expandir panel',
                children: open ? '‹' : '›'
            }, void 0, false, {
                fileName: "[project]/components/atlas/LeftPanel.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/atlas/LeftPanel.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/design-tokens.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/lib/mock-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─── MOCK DATA — set USE_MOCK = false in each page to switch to live Supabase ───
__turbopack_context__.s([
    "MOCK_COUNTRIES",
    ()=>MOCK_COUNTRIES,
    "MOCK_PANELS",
    ()=>MOCK_PANELS,
    "MOCK_REPLIES",
    ()=>MOCK_REPLIES,
    "MOCK_REPORTS",
    ()=>MOCK_REPORTS,
    "MOCK_THREAD",
    ()=>MOCK_THREAD,
    "MOCK_THREADS",
    ()=>MOCK_THREADS,
    "getMockPanel",
    ()=>getMockPanel
]);
const MOCK_COUNTRIES = [
    {
        iso3: 'URY',
        name: 'Uruguay',
        flag: '🇺🇾',
        lat: -32.52,
        lng: -55.77,
        iea: 18.2
    },
    {
        iso3: 'CRI',
        name: 'Costa Rica',
        flag: '🇨🇷',
        lat: 9.75,
        lng: -83.75,
        iea: 26.9
    },
    {
        iso3: 'CHL',
        name: 'Chile',
        flag: '🇨🇱',
        lat: -35.68,
        lng: -71.54,
        iea: 34.8
    },
    {
        iso3: 'PAN',
        name: 'Panamá',
        flag: '🇵🇦',
        lat: 8.42,
        lng: -80.11,
        iea: 44.2
    },
    {
        iso3: 'BRA',
        name: 'Brasil',
        flag: '🇧🇷',
        lat: -14.24,
        lng: -51.93,
        iea: 51.7
    },
    {
        iso3: 'ECU',
        name: 'Ecuador',
        flag: '🇪🇨',
        lat: -1.83,
        lng: -78.18,
        iea: 55.4
    },
    {
        iso3: 'COL',
        name: 'Colombia',
        flag: '🇨🇴',
        lat: 4.57,
        lng: -74.30,
        iea: 59.1
    },
    {
        iso3: 'PER',
        name: 'Perú',
        flag: '🇵🇪',
        lat: -9.19,
        lng: -75.02,
        iea: 61.8
    },
    {
        iso3: 'ARG',
        name: 'Argentina',
        flag: '🇦🇷',
        lat: -38.42,
        lng: -63.62,
        iea: 63.4
    },
    {
        iso3: 'PRY',
        name: 'Paraguay',
        flag: '🇵🇾',
        lat: -23.44,
        lng: -58.44,
        iea: 65.7
    },
    {
        iso3: 'BOL',
        name: 'Bolivia',
        flag: '🇧🇴',
        lat: -16.29,
        lng: -63.59,
        iea: 67.2
    },
    {
        iso3: 'MEX',
        name: 'México',
        flag: '🇲🇽',
        lat: 23.63,
        lng: -102.55,
        iea: 69.9
    },
    {
        iso3: 'SLV',
        name: 'El Salvador',
        flag: '🇸🇻',
        lat: 13.79,
        lng: -88.90,
        iea: 71.3
    },
    {
        iso3: 'GTM',
        name: 'Guatemala',
        flag: '🇬🇹',
        lat: 15.78,
        lng: -90.23,
        iea: 74.5
    },
    {
        iso3: 'HND',
        name: 'Honduras',
        flag: '🇭🇳',
        lat: 15.20,
        lng: -86.24,
        iea: 77.1
    },
    {
        iso3: 'NIC',
        name: 'Nicaragua',
        flag: '🇳🇮',
        lat: 12.87,
        lng: -85.21,
        iea: 80.8
    },
    {
        iso3: 'VEN',
        name: 'Venezuela',
        flag: '🇻🇪',
        lat: 6.42,
        lng: -66.59,
        iea: 87.3
    }
];
const mkCountry = (iso3, name, flag, region)=>({
        id: iso3,
        iso_alpha2: iso3.slice(0, 2),
        iso_alpha3: iso3,
        name_es: name,
        name_en: name,
        region,
        latitude: 0,
        longitude: 0,
        flag_emoji: flag,
        active: true
    });
const mkScore = (id, iea, pillars, bic_low, bic_high, vol)=>({
        id,
        country_id: id,
        period: '2023',
        iea_score: iea,
        pillar_scores: pillars,
        bic_score: iea,
        bic_low,
        bic_high,
        bic_volatility: vol
    });
const MOCK_PANELS = {
    CHL: {
        country: mkCountry('CHL', 'Chile', '🇨🇱', 'Sudamérica'),
        score: mkScore('CHL', 34.8, {
            fiscal_discipline: 68,
            social_investment: 71,
            transparency: 55,
            sector_stability: 63
        }, 29, 41, 'low'),
        signals: [
            {
                id: 's1',
                country_id: 'CHL',
                pattern_type: 'contratación directa',
                description: 'Adjudicaciones directas en sector salud superan 40% del total — umbral de alerta activado en Q2 2023.',
                severity: 3,
                active: true,
                detected_at: '2023-06-01'
            },
            {
                id: 's2',
                country_id: 'CHL',
                pattern_type: 'transferencias irregulares',
                description: 'Caso Convenios: 14 organizaciones involucradas, contratos acumulados >2.400M CLP, patrón de adjudicación directa.',
                severity: 4,
                active: true,
                detected_at: '2023-08-14'
            }
        ],
        threads: [
            {
                id: 't1',
                title: 'Caso Convenios: seguimiento de imputados y avance del proceso en Fiscalía',
                alert_level: 'alert',
                reply_count: 41
            },
            {
                id: 't2',
                title: 'IEA 2015–2023: análisis de tendencias en transparencia institucional',
                alert_level: 'watch',
                reply_count: 18
            }
        ]
    },
    VEN: {
        country: mkCountry('VEN', 'Venezuela', '🇻🇪', 'Sudamérica'),
        score: mkScore('VEN', 87.3, {
            fiscal_discipline: 14,
            social_investment: 11,
            transparency: 8,
            sector_stability: 16
        }, 80, 94, 'high'),
        signals: [
            {
                id: 's3',
                country_id: 'VEN',
                pattern_type: 'colapso institucional',
                description: 'Desaparición de reportes presupuestarios públicos desde Q1 2022. Sin auditorías externas en 3 períodos consecutivos.',
                severity: 5,
                active: true,
                detected_at: '2023-01-15'
            },
            {
                id: 's4',
                country_id: 'VEN',
                pattern_type: 'desvío gasto social',
                description: 'Gasto social declarado cae 34% sin correlato en indicadores de pobreza — discrepancia estadística significativa.',
                severity: 5,
                active: true,
                detected_at: '2023-03-22'
            },
            {
                id: 's5',
                country_id: 'VEN',
                pattern_type: 'empresa pública',
                description: 'PDVSA: sin estados financieros auditados desde 2016. Pérdidas estimadas no contabilizadas: $18.000M.',
                severity: 5,
                active: true,
                detected_at: '2023-05-10'
            }
        ],
        threads: [
            {
                id: 't3',
                title: 'Presupuesto 2023 muestra caída del 34% en gasto social. ¿Qué explica este desplome?',
                alert_level: 'urgent',
                reply_count: 23
            }
        ]
    },
    URY: {
        country: mkCountry('URY', 'Uruguay', '🇺🇾', 'Sudamérica'),
        score: mkScore('URY', 18.2, {
            fiscal_discipline: 88,
            social_investment: 84,
            transparency: 91,
            sector_stability: 82
        }, 14, 23, 'low'),
        signals: [],
        threads: [
            {
                id: 't4',
                title: 'Uruguay como benchmark regional: ¿qué explica su consistencia en el IEA?',
                alert_level: 'watch',
                reply_count: 34
            }
        ]
    },
    ARG: {
        country: mkCountry('ARG', 'Argentina', '🇦🇷', 'Sudamérica'),
        score: mkScore('ARG', 63.4, {
            fiscal_discipline: 44,
            social_investment: 58,
            transparency: 42,
            sector_stability: 46
        }, 56, 71, 'high'),
        signals: [
            {
                id: 's6',
                country_id: 'ARG',
                pattern_type: 'deuda pública',
                description: 'Restructuración de deuda en condiciones no publicadas — falta de transparencia en términos acordados con acreedores.',
                severity: 3,
                active: true,
                detected_at: '2023-04-18'
            }
        ],
        threads: [
            {
                id: 't5',
                title: 'IEA 2015–2023: ciclo kirchnerista vs. macrismo en disciplina fiscal',
                alert_level: 'watch',
                reply_count: 67
            }
        ]
    },
    MEX: {
        country: mkCountry('MEX', 'México', '🇲🇽', 'Centroamérica'),
        score: mkScore('MEX', 69.9, {
            fiscal_discipline: 42,
            social_investment: 48,
            transparency: 38,
            sector_stability: 44
        }, 62, 78, 'medium'),
        signals: [
            {
                id: 's7',
                country_id: 'MEX',
                pattern_type: 'licitaciones',
                description: 'Gasto en seguridad supera 25% del presupuesto con opacidad en contratos — 68% adjudicaciones directas en obras federales.',
                severity: 4,
                active: true,
                detected_at: '2023-07-03'
            }
        ],
        threads: [
            {
                id: 't6',
                title: 'Gasto en seguridad supera 25% del presupuesto — patrones históricos de desviación',
                alert_level: 'watch',
                reply_count: 18
            }
        ]
    }
};
const DEFAULT_PANEL = {
    country: mkCountry('---', 'País', '🏳', 'América Latina'),
    score: mkScore('---', 55.0, {
        fiscal_discipline: 50,
        social_investment: 55,
        transparency: 48,
        sector_stability: 52
    }, 48, 62, 'medium'),
    signals: [],
    threads: []
};
function getMockPanel(iso3) {
    return MOCK_PANELS[iso3] ?? DEFAULT_PANEL;
}
const MOCK_THREADS = [
    {
        id: 'th1',
        country_id: 'VEN',
        title: 'El presupuesto 2023 muestra caída del 34% en gasto social. ¿Qué explica este desplome?',
        body: null,
        alert_level: 'urgent',
        reply_count: 23,
        pinned: true,
        created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    },
    {
        id: 'th2',
        country_id: 'CHL',
        title: 'Caso Convenios: seguimiento de imputados y avance del proceso en Fiscalía Nacional',
        body: null,
        alert_level: 'alert',
        reply_count: 41,
        pinned: false,
        created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
    },
    {
        id: 'th3',
        country_id: 'PER',
        title: 'Cinco gobiernos, cinco investigados. ¿Es el sistema judicial capaz de actuar de forma independiente?',
        body: null,
        alert_level: 'alert',
        reply_count: 52,
        pinned: false,
        created_at: new Date(Date.now() - 1 * 86400 * 1000).toISOString()
    },
    {
        id: 'th4',
        country_id: 'MEX',
        title: 'Gasto en seguridad supera 25% del presupuesto — patrones históricos de desviación identificados',
        body: null,
        alert_level: 'watch',
        reply_count: 18,
        pinned: false,
        created_at: new Date(Date.now() - 1 * 86400 * 1000).toISOString()
    },
    {
        id: 'th5',
        country_id: 'ARG',
        title: 'IEA 2015–2023: ciclo kirchnerista vs. macrismo en disciplina fiscal y transparencia',
        body: null,
        alert_level: 'watch',
        reply_count: 67,
        pinned: false,
        created_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString()
    },
    {
        id: 'th6',
        country_id: 'BRA',
        title: 'Lula 2023: ¿recuperación real en el IEA o efecto estadístico de la base baja?',
        body: null,
        alert_level: 'watch',
        reply_count: 29,
        pinned: false,
        created_at: new Date(Date.now() - 3 * 86400 * 1000).toISOString()
    },
    {
        id: 'th7',
        country_id: 'URY',
        title: 'Uruguay como benchmark regional: ¿qué explica su consistencia histórica en el índice?',
        body: null,
        alert_level: 'watch',
        reply_count: 34,
        pinned: false,
        created_at: new Date(Date.now() - 4 * 86400 * 1000).toISOString()
    },
    {
        id: 'th8',
        country_id: 'GTM',
        title: 'Redes de captura estatal en Guatemala: análisis del patrón de adjudicaciones 2020–2023',
        body: null,
        alert_level: 'alert',
        reply_count: 15,
        pinned: false,
        created_at: new Date(Date.now() - 5 * 86400 * 1000).toISOString()
    }
];
const MOCK_THREAD = MOCK_THREADS[1];
const MOCK_REPLIES = [
    {
        id: 'r1',
        thread_id: 'th2',
        created_by: 'Ana Veedor',
        is_analyst: false,
        upvotes: 14,
        created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        body: 'El Ministerio Público formalizó a cuatro alcaldes por el caso Convenios. Según los datos del IEA, Chile ya mostraba anomalías en el pilar de Transparencia desde 2021. ¿Alguien tiene acceso a los contratos originales? Necesitamos cruzar montos con el indicador de contratación pública.'
    },
    {
        id: 'r2',
        thread_id: 'th2',
        created_by: 'Pancho Linares',
        is_analyst: false,
        upvotes: 9,
        created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        body: 'Los contratos están en el portal de Contraloría. El problema es que los montos no cuadran con las rendiciones. CIPER publicó el desglose — hay una discrepancia de 340M CLP en una sola ONG. El IEA baja 2.1 puntos en 2023 y este caso explica parte significativa.'
    },
    {
        id: 'r3',
        thread_id: 'th2',
        created_by: 'Insight Engine',
        is_analyst: true,
        upvotes: 0,
        created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        body: 'Correlación detectada: pilar de Transparencia con caída consistente desde Q4 2021 (55.3 → 48.1 en 3 períodos). El Caso Convenios involucra 14 organizaciones, contratos acumulados >2.400M CLP. Patrón: adjudicación directa con entidades vinculadas a funcionarios activos. Recomiendo cruzar con datos de contratación pública, sector administración, 2021–2023.'
    },
    {
        id: 'r4',
        thread_id: 'th2',
        created_by: 'Julieta Ramírez',
        is_analyst: false,
        upvotes: 22,
        created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        body: 'El caso tiene un patrón muy similar a lo documentado en Paraguay en 2019. Misma estructura: ONG pantalla, funcionario intermediario, contrato sin licitación. La diferencia es que en Chile sí hay fiscalía independiente. El juicio podría ser un test para el sistema institucional.'
    },
    {
        id: 'r5',
        thread_id: 'th2',
        created_by: 'Rodrigo Mena',
        is_analyst: false,
        upvotes: 7,
        created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        body: 'Importante distinguir: el IEA mide corrupción estimada, no corrupción detectada. El hecho de que el caso llegue a Fiscalía podría indicar que el sistema de control funciona — lo que paradójicamente es positivo para el índice a largo plazo. Hay que seguir la evolución.'
    }
];
const MOCK_REPORTS = [
    {
        id: 'n1',
        title: 'Caso Convenios: Fiscalía Nacional imputa a cuatro alcaldes por desvío de fondos públicos',
        excerpt: 'La investigación revela una red de transferencias irregulares a organizaciones sociales vinculadas a funcionarios activos, con contratos que superan los 2.400 millones de pesos.',
        corruption_types: [
            'licitación directa',
            'tráfico de influencias'
        ],
        severity: 4,
        published_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
        source_name: 'CIPER Chile',
        url: null
    },
    {
        id: 'n2',
        title: 'Venezuela: sin estados financieros de PDVSA auditados desde 2016',
        excerpt: 'La petrolera estatal acumula siete años sin publicar cuentas verificables. Analistas estiman pérdidas no contabilizadas superiores a 18.000 millones de dólares.',
        corruption_types: [
            'opacidad financiera',
            'empresa pública'
        ],
        severity: 5,
        published_at: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
        source_name: 'Reuters',
        url: null
    },
    {
        id: 'n3',
        title: 'México: 68% de contratos federales en obras públicas se adjudican de forma directa',
        excerpt: 'Auditoría Superior de la Federación detecta patrón sistemático de opacidad en licitaciones, particularmente en proyectos de infraestructura prioritaria del gobierno federal.',
        corruption_types: [
            'licitación directa',
            'gasto público'
        ],
        severity: 4,
        published_at: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
        source_name: 'El País',
        url: null
    },
    {
        id: 'n4',
        title: 'Perú: cinco expresidentes bajo investigación simultánea por corrupción',
        excerpt: 'El Ministerio Público mantiene abiertas causas contra cinco mandatarios en distintas etapas procesales, convirtiendo al país en el caso más extremo de la región en materia de responsabilidad ejecutiva.',
        corruption_types: [
            'corrupción ejecutiva',
            'impunidad'
        ],
        severity: 5,
        published_at: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
        source_name: 'La República',
        url: null
    },
    {
        id: 'n5',
        title: 'Argentina mejora 1.8 puntos en disciplina fiscal pese a contexto económico adverso',
        excerpt: 'El índice IEA registra una leve recuperación en el pilar de disciplina fiscal durante el primer semestre de 2023, aunque la volatilidad estructural continúa siendo alta.',
        corruption_types: [
            'disciplina fiscal'
        ],
        severity: 2,
        published_at: new Date(Date.now() - 6 * 86400 * 1000).toISOString(),
        source_name: 'Infobae',
        url: null
    },
    {
        id: 'n6',
        title: 'Guatemala: red de captura estatal vinculada a tres ministerios',
        excerpt: 'Investigadores del MP identifican un esquema de cooptación de cargos públicos clave que permitió desviar fondos de cooperación internacional hacia empresas fantasma.',
        corruption_types: [
            'captura estatal',
            'fraude'
        ],
        severity: 4,
        published_at: new Date(Date.now() - 7 * 86400 * 1000).toISOString(),
        source_name: 'Plaza Pública',
        url: null
    },
    {
        id: 'n7',
        title: 'Uruguay mantiene liderazgo regional en transparencia con índice 91/100',
        excerpt: 'Por séptimo año consecutivo Uruguay encabeza el ranking IEA en el pilar de Transparencia Institucional, consolidándose como referencia para reformas en otros países de la región.',
        corruption_types: [
            'transparencia'
        ],
        severity: 1,
        published_at: new Date(Date.now() - 8 * 86400 * 1000).toISOString(),
        source_name: 'El Observador',
        url: null
    },
    {
        id: 'n8',
        title: 'Brasil: operación policial descubre esquema de sobornos en contratos de saneamiento',
        excerpt: 'La Policía Federal ejecuta 34 órdenes de allanamiento en cuatro estados. El esquema habría desviado cerca de 800 millones de reales durante tres administraciones municipales consecutivas.',
        corruption_types: [
            'soborno',
            'contratos públicos'
        ],
        severity: 4,
        published_at: new Date(Date.now() - 9 * 86400 * 1000).toISOString(),
        source_name: 'Folha de S.Paulo',
        url: null
    },
    {
        id: 'n9',
        title: 'Honduras: gasto discrecional de la presidencia aumenta 112% sin rendición de cuentas',
        excerpt: 'Los fondos reservados de la Casa Presidencial crecen de manera sostenida sin respaldo en el presupuesto aprobado por el Congreso, según análisis del presupuesto ejecutado 2023.',
        corruption_types: [
            'gasto discrecional',
            'opacidad'
        ],
        severity: 5,
        published_at: new Date(Date.now() - 10 * 86400 * 1000).toISOString(),
        source_name: 'Criterio.hn',
        url: null
    }
];
}),
"[project]/components/atlas/CountryPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CountryPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2d$tokens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/design-tokens.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-data.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const USE_MOCK = true // set false to fetch from Supabase
;
const PILLAR_LABELS = {
    fiscal_discipline: 'Disciplina Fiscal',
    social_investment: 'Inversión Social',
    transparency: 'Transparencia',
    sector_stability: 'Estabilidad Sectorial'
};
const ALERT_COLOR = {
    watch: 'var(--accent)',
    alert: 'var(--warn)',
    urgent: 'var(--bad)'
};
function SectionHeader({ label }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontFamily: 'var(--mono)',
                    fontSize: 7.5,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    whiteSpace: 'nowrap',
                    opacity: 0.85
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/components/atlas/CountryPanel.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    height: 1,
                    background: 'var(--accent)',
                    opacity: 0.2
                }
            }, void 0, false, {
                fileName: "[project]/components/atlas/CountryPanel.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/atlas/CountryPanel.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
function pillarFillColor(v) {
    if (v >= 60) return 'var(--accent)';
    if (v >= 40) return 'var(--warn)';
    return 'var(--bad)';
}
function CountryPanel({ iso3, onClose }) {
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const scoreRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setLoading(true);
        setData(null);
        if ("TURBOPACK compile-time truthy", 1) {
            setData((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMockPanel"])(iso3));
            setLoading(false);
            return;
        }
        //TURBOPACK unreachable
        ;
    }, [
        iso3
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!data?.score?.iea_score || !scoreRef.current) return;
        const target = data.score.iea_score;
        const el = scoreRef.current;
        const dur = 800;
        const start = performance.now();
        const ease = (t)=>1 - Math.pow(1 - t, 3);
        const tick = (now)=>{
            const t = Math.min(1, (now - start) / dur);
            el.textContent = Math.round(target * ease(t)).toString();
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [
        data?.score?.iea_score
    ]);
    const iea = data?.score?.iea_score ?? null;
    const color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2d$tokens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["severityColor"])(iea);
    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.06
            }
        }
    };
    const item = {
        hidden: {
            opacity: 0,
            y: 8
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'var(--bg-2)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    height: 1,
                    background: 'linear-gradient(90deg, var(--accent), rgba(56,189,248,.2))',
                    flexShrink: 0
                }
            }, void 0, false, {
                fileName: "[project]/components/atlas/CountryPanel.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '20px 26px 14px',
                    borderBottom: '1px solid var(--line-2)',
                    flexShrink: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: 'var(--mono)',
                            fontSize: 8,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'var(--accent)',
                            marginBottom: 10,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        },
                        onClick: onClose,
                        children: [
                            "← ",
                            iso3
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/atlas/CountryPanel.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: 'var(--serif)',
                            fontSize: 34,
                            fontWeight: 900,
                            lineHeight: 1,
                            letterSpacing: '-0.02em',
                            color: 'var(--text)',
                            marginBottom: 4
                        },
                        children: loading ? '…' : data?.country?.flag_emoji ? `${data.country.flag_emoji} ${data.country.name_es}` : data?.country?.name_es ?? iso3
                    }, void 0, false, {
                        fileName: "[project]/components/atlas/CountryPanel.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: 'var(--mono)',
                            fontSize: 8.5,
                            color: 'var(--text-3)',
                            letterSpacing: '0.09em',
                            textTransform: 'uppercase'
                        },
                        children: [
                            iso3,
                            data?.country?.region ? ` · ${data.country.region}` : ''
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/atlas/CountryPanel.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/atlas/CountryPanel.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflowY: 'auto'
                },
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: '16px 26px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10
                    },
                    children: [
                        80,
                        120,
                        100
                    ].map((h, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                height: h,
                                background: 'var(--bg-3)',
                                backgroundImage: 'linear-gradient(90deg, transparent 25%, var(--bg-4) 50%, transparent 75%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.5s infinite'
                            }
                        }, i, false, {
                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                            lineNumber: 115,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/atlas/CountryPanel.tsx",
                    lineNumber: 113,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    variants: container,
                    initial: "hidden",
                    animate: "show",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            variants: item,
                            style: {
                                padding: '18px 26px',
                                borderBottom: '1px solid var(--line)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 18,
                                flexShrink: 0,
                                background: 'linear-gradient(135deg, var(--bg-3), var(--bg-2))'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'flex-end'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    ref: scoreRef,
                                                    style: {
                                                        fontFamily: 'var(--mono)',
                                                        fontSize: 62,
                                                        fontWeight: 500,
                                                        lineHeight: 1,
                                                        letterSpacing: '-0.04em',
                                                        color: 'var(--gold)',
                                                        textShadow: '0 0 30px rgba(250,204,21,.2)'
                                                    },
                                                    children: "0"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                    lineNumber: 129,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontFamily: 'var(--mono)',
                                                        fontSize: 12,
                                                        color: 'var(--text-3)',
                                                        marginBottom: 8,
                                                        marginLeft: 4
                                                    },
                                                    children: "/100"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                                            lineNumber: 128,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'inline-block',
                                                fontFamily: 'var(--mono)',
                                                fontSize: 8,
                                                letterSpacing: '0.15em',
                                                textTransform: 'uppercase',
                                                padding: '3px 8px',
                                                marginTop: 4,
                                                background: `${color}18`,
                                                color: color,
                                                border: `1px solid ${color}44`
                                            },
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2d$tokens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["severityLabel"])(iea)
                                        }, void 0, false, {
                                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                                            lineNumber: 137,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/atlas/CountryPanel.tsx",
                                    lineNumber: 127,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        flex: 1,
                                        paddingTop: 4
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontFamily: 'var(--mono)',
                                                fontSize: 7.5,
                                                color: 'var(--text-4)',
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                marginBottom: 8
                                            },
                                            children: "Índice IEA"
                                        }, void 0, false, {
                                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                                            lineNumber: 147,
                                            columnNumber: 17
                                        }, this),
                                        data?.score?.bic_low != null && data.score.bic_high != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        height: 3,
                                                        background: 'var(--line-2)',
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        marginBottom: 4
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                position: 'absolute',
                                                                top: 0,
                                                                bottom: 0,
                                                                left: `${data.score.bic_low}%`,
                                                                width: `${data.score.bic_high - data.score.bic_low}%`,
                                                                background: `linear-gradient(90deg, ${color}88, ${color})`
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                            lineNumber: 155,
                                                            columnNumber: 23
                                                        }, this),
                                                        iea !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                position: 'absolute',
                                                                top: -1,
                                                                bottom: -1,
                                                                width: 2,
                                                                left: `${iea}%`,
                                                                background: '#fff',
                                                                transform: 'translateX(-50%)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                            lineNumber: 162,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                    lineNumber: 154,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontFamily: 'var(--mono)',
                                                        fontSize: 8,
                                                        color: 'var(--text-4)'
                                                    },
                                                    children: [
                                                        "BIC ",
                                                        data.score.bic_low.toFixed(0),
                                                        "–",
                                                        data.score.bic_high.toFixed(0),
                                                        " ·",
                                                        ' ',
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: data.score.bic_volatility === 'low' ? 'var(--good)' : data.score.bic_volatility === 'medium' ? 'var(--gold)' : 'var(--bad)'
                                                            },
                                                            children: data.score.bic_volatility ?? '—'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                            lineNumber: 171,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                                            lineNumber: 153,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/atlas/CountryPanel.tsx",
                                    lineNumber: 146,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                            lineNumber: 122,
                            columnNumber: 13
                        }, this),
                        data?.score?.pillar_scores && Object.keys(data.score.pillar_scores).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            variants: item,
                            style: {
                                padding: '14px 26px',
                                borderBottom: '1px solid var(--line)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                                    label: "Pilares IEA"
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/CountryPanel.tsx",
                                    lineNumber: 183,
                                    columnNumber: 17
                                }, this),
                                Object.entries(data.score.pillar_scores).map(([key, val])=>{
                                    const v = val;
                                    const fc = pillarFillColor(v);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 4
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontFamily: 'var(--mono)',
                                                            fontSize: 8,
                                                            letterSpacing: '0.08em',
                                                            textTransform: 'uppercase',
                                                            color: 'var(--text-3)'
                                                        },
                                                        children: PILLAR_LABELS[key] ?? key
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                        lineNumber: 190,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontFamily: 'var(--mono)',
                                                            fontSize: 9,
                                                            fontWeight: 500,
                                                            color: 'var(--text-2)'
                                                        },
                                                        children: [
                                                            v.toFixed(0),
                                                            "/100"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                lineNumber: 189,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    height: 3,
                                                    background: 'var(--line-2)',
                                                    overflow: 'hidden'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        height: '100%',
                                                        width: `${v}%`,
                                                        background: fc,
                                                        transformOrigin: 'left',
                                                        animation: 'expand .8s var(--ease) .3s both'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                lineNumber: 195,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, key, true, {
                                        fileName: "[project]/components/atlas/CountryPanel.tsx",
                                        lineNumber: 188,
                                        columnNumber: 21
                                    }, this);
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                            lineNumber: 182,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            children: data?.signals && data.signals.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                variants: item,
                                style: {
                                    padding: '14px 26px',
                                    borderBottom: '1px solid var(--line)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            marginBottom: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 7.5,
                                                    letterSpacing: '0.22em',
                                                    textTransform: 'uppercase',
                                                    color: 'var(--accent)',
                                                    opacity: 0.85
                                                },
                                                children: "Señales activas"
                                            }, void 0, false, {
                                                fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                lineNumber: 214,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 9,
                                                    padding: '1px 6px',
                                                    background: 'rgba(244,63,94,.15)',
                                                    color: 'var(--bad)',
                                                    border: '1px solid rgba(244,63,94,.3)'
                                                },
                                                children: data.signals.length
                                            }, void 0, false, {
                                                fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                lineNumber: 217,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    flex: 1,
                                                    height: 1,
                                                    background: 'var(--accent)',
                                                    opacity: 0.2
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                lineNumber: 220,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/atlas/CountryPanel.tsx",
                                        lineNumber: 213,
                                        columnNumber: 19
                                    }, this),
                                    data.signals.map((sig, i)=>{
                                        const sc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2d$tokens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["severityColor"])(sig.severity * 20);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                            initial: {
                                                opacity: 0,
                                                x: -6
                                            },
                                            animate: {
                                                opacity: 1,
                                                x: 0
                                            },
                                            transition: {
                                                delay: i * 0.05
                                            },
                                            style: {
                                                padding: '8px 10px',
                                                marginBottom: 6,
                                                background: 'var(--bg-3)',
                                                borderLeft: `2px solid ${sc}`
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                        marginBottom: 4
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontFamily: 'var(--mono)',
                                                                fontSize: 8,
                                                                padding: '1px 5px',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.06em',
                                                                background: 'var(--bg-4)',
                                                                color: 'var(--text-3)'
                                                            },
                                                            children: sig.pattern_type
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                            lineNumber: 233,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: sc,
                                                                fontSize: 10
                                                            },
                                                            children: [
                                                                '●'.repeat(sig.severity),
                                                                '○'.repeat(5 - sig.severity)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                            lineNumber: 236,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                    lineNumber: 232,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontFamily: 'var(--sans)',
                                                        fontSize: 11,
                                                        lineHeight: 1.55,
                                                        color: 'var(--text-2)',
                                                        margin: 0
                                                    },
                                                    children: sig.description
                                                }, void 0, false, {
                                                    fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                    lineNumber: 238,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, sig.id, true, {
                                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                                            lineNumber: 225,
                                            columnNumber: 23
                                        }, this);
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/atlas/CountryPanel.tsx",
                                lineNumber: 212,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                            lineNumber: 210,
                            columnNumber: 13
                        }, this),
                        data?.threads && data.threads.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            variants: item,
                            style: {
                                padding: '14px 26px 18px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                                    label: "Conversación"
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/CountryPanel.tsx",
                                    lineNumber: 249,
                                    columnNumber: 17
                                }, this),
                                data.threads.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: '8px 0',
                                            borderBottom: '1px solid var(--line)',
                                            cursor: 'pointer'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 7.5,
                                                    letterSpacing: '0.15em',
                                                    textTransform: 'uppercase',
                                                    color: ALERT_COLOR[t.alert_level] ?? 'var(--accent)',
                                                    marginBottom: 3,
                                                    opacity: 0.9
                                                },
                                                children: t.alert_level
                                            }, void 0, false, {
                                                fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                lineNumber: 252,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontFamily: 'var(--sans)',
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    color: 'var(--text-2)',
                                                    margin: '0 0 3px',
                                                    lineHeight: 1.35
                                                },
                                                children: t.title
                                            }, void 0, false, {
                                                fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                lineNumber: 255,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 8,
                                                    color: 'var(--text-4)'
                                                },
                                                children: [
                                                    t.reply_count,
                                                    " respuestas"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/atlas/CountryPanel.tsx",
                                                lineNumber: 256,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, t.id, true, {
                                        fileName: "[project]/components/atlas/CountryPanel.tsx",
                                        lineNumber: 251,
                                        columnNumber: 19
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    style: {
                                        width: '100%',
                                        marginTop: 12,
                                        padding: '11px 0',
                                        background: 'var(--accent)',
                                        color: '#020c18',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--mono)',
                                        fontSize: 9,
                                        letterSpacing: '0.18em',
                                        textTransform: 'uppercase',
                                        fontWeight: 500,
                                        transition: 'background .15s'
                                    },
                                    onMouseEnter: (e)=>e.currentTarget.style.background = '#0ea5e9',
                                    onMouseLeave: (e)=>e.currentTarget.style.background = 'var(--accent)',
                                    children: "Ver foro completo →"
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/CountryPanel.tsx",
                                    lineNumber: 259,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                            lineNumber: 248,
                            columnNumber: 15
                        }, this),
                        data && !data.signals.length && !data.threads.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            variants: item,
                            style: {
                                padding: '24px 26px',
                                textAlign: 'center'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 9,
                                    color: 'var(--text-4)',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase'
                                },
                                children: "Sin señales activas"
                            }, void 0, false, {
                                fileName: "[project]/components/atlas/CountryPanel.tsx",
                                lineNumber: 276,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/atlas/CountryPanel.tsx",
                            lineNumber: 275,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/atlas/CountryPanel.tsx",
                    lineNumber: 119,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/atlas/CountryPanel.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/atlas/CountryPanel.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/atlas/RightPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RightPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$CountryPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/atlas/CountryPanel.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function ieaColor(iea) {
    if (iea === null) return '#64748b';
    if (iea <= 20) return '#dc2626';
    if (iea <= 35) return '#f97316';
    if (iea <= 50) return '#facc15';
    if (iea <= 65) return '#a3e635';
    if (iea <= 80) return '#0891b2';
    return '#0e7490';
}
// ── State A: Continental summary ─────────────────────────────────
function ResumenContinental({ countries }) {
    const sorted = [
        ...countries
    ].filter((c)=>c.iea !== null).sort((a, b)=>(a.iea ?? 0) - (b.iea ?? 0));
    const mostCorrupt = sorted.slice(0, 10);
    const cleanest = sorted.slice(-10).reverse();
    const maxScore = Math.max(...countries.map((c)=>c.iea ?? 0), 1);
    function BarRow({ c, reverse }) {
        const color = ieaColor(c.iea);
        const pct = (c.iea ?? 0) / 100 * 100;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 0'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontFamily: 'var(--mono)',
                        fontSize: 8,
                        color: 'var(--text-4)',
                        width: 14,
                        textAlign: 'right',
                        flexShrink: 0
                    },
                    children: sorted.indexOf(c) + 1
                }, void 0, false, {
                    fileName: "[project]/components/atlas/RightPanel.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontSize: 11,
                        flexShrink: 0
                    },
                    children: c.flag
                }, void 0, false, {
                    fileName: "[project]/components/atlas/RightPanel.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        flex: 1,
                        height: 4,
                        background: 'rgba(148,163,184,0.1)',
                        borderRadius: 2,
                        overflow: 'hidden'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: `${pct}%`,
                            height: '100%',
                            background: color,
                            borderRadius: 2,
                            transition: 'width .4s'
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/atlas/RightPanel.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/atlas/RightPanel.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontFamily: 'var(--mono)',
                        fontSize: 9,
                        color,
                        fontWeight: 600,
                        width: 34,
                        textAlign: 'right',
                        flexShrink: 0
                    },
                    children: c.iea?.toFixed(1)
                }, void 0, false, {
                    fileName: "[project]/components/atlas/RightPanel.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/atlas/RightPanel.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, this);
    }
    function SubHead({ label }) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                fontFamily: 'var(--mono)',
                fontSize: 7.5,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: 8,
                marginTop: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8
            },
            children: [
                label,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        flex: 1,
                        height: 1,
                        background: 'var(--accent)',
                        opacity: 0.2
                    }
                }, void 0, false, {
                    fileName: "[project]/components/atlas/RightPanel.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/atlas/RightPanel.tsx",
            lineNumber: 53,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '16px 16px 12px',
            overflowY: 'auto',
            flex: 1
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: 'var(--mono)',
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-3)',
                    marginBottom: 6
                },
                children: "RESUMEN CONTINENTAL"
            }, void 0, false, {
                fileName: "[project]/components/atlas/RightPanel.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontFamily: 'var(--sans)',
                    fontSize: 11,
                    color: 'var(--text-3)',
                    lineHeight: 1.55,
                    marginBottom: 4
                },
                children: "Haz clic en un país en el mapa o en el ranking para abrir su detalle, ver su evolución y compararlo con otro."
            }, void 0, false, {
                fileName: "[project]/components/atlas/RightPanel.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SubHead, {
                label: "TOP 10 · MÁS CORRUPTOS"
            }, void 0, false, {
                fileName: "[project]/components/atlas/RightPanel.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            mostCorrupt.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BarRow, {
                    c: c,
                    reverse: false
                }, c.iso3, false, {
                    fileName: "[project]/components/atlas/RightPanel.tsx",
                    lineNumber: 74,
                    columnNumber: 29
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SubHead, {
                label: "TOP 10 · MÁS LIMPIOS"
            }, void 0, false, {
                fileName: "[project]/components/atlas/RightPanel.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            cleanest.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BarRow, {
                    c: c,
                    reverse: true
                }, c.iso3, false, {
                    fileName: "[project]/components/atlas/RightPanel.tsx",
                    lineNumber: 77,
                    columnNumber: 26
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/components/atlas/RightPanel.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
// ── Country action bar ──────────────────────────────────────────
function ActionBar({ iso3, onClose, onCompare }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const btnBase = {
        flex: 1,
        padding: '7px 4px',
        fontFamily: 'var(--mono)',
        fontSize: 7.5,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        border: '1px solid rgba(148,163,184,0.2)',
        background: 'transparent',
        color: 'var(--text-3)',
        borderRadius: 6,
        transition: 'all .15s'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            gap: 6,
            padding: '10px 14px',
            borderTop: '1px solid var(--line-2)',
            flexShrink: 0,
            background: 'var(--bg-2)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onCompare,
                style: btnBase,
                onMouseEnter: (e)=>{
                    e.currentTarget.style.background = 'rgba(148,163,184,0.08)';
                    e.currentTarget.style.color = 'var(--text)';
                },
                onMouseLeave: (e)=>{
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-3)';
                },
                children: "COMPARAR"
            }, void 0, false, {
                fileName: "[project]/components/atlas/RightPanel.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>router.push(`/foro?country=${iso3}`),
                style: btnBase,
                onMouseEnter: (e)=>{
                    e.currentTarget.style.background = 'rgba(148,163,184,0.08)';
                    e.currentTarget.style.color = 'var(--text)';
                },
                onMouseLeave: (e)=>{
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-3)';
                },
                children: "FORO"
            }, void 0, false, {
                fileName: "[project]/components/atlas/RightPanel.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>router.push(`/pais/${iso3}`),
                style: {
                    ...btnBase,
                    background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
                    border: 'none',
                    color: '#fff'
                },
                onMouseEnter: (e)=>e.currentTarget.style.opacity = '0.9',
                onMouseLeave: (e)=>e.currentTarget.style.opacity = '1',
                children: "EXPANDIR"
            }, void 0, false, {
                fileName: "[project]/components/atlas/RightPanel.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onClose,
                style: btnBase,
                onMouseEnter: (e)=>{
                    e.currentTarget.style.background = 'rgba(148,163,184,0.08)';
                    e.currentTarget.style.color = 'var(--text)';
                },
                onMouseLeave: (e)=>{
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-3)';
                },
                children: "CERRAR"
            }, void 0, false, {
                fileName: "[project]/components/atlas/RightPanel.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/atlas/RightPanel.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
function RightPanel({ selected, countries, onClose, onCompare }) {
    const WIDTH = selected ? 380 : 320;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        mode: "wait",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                x: 40,
                opacity: 0
            },
            animate: {
                x: 0,
                opacity: 1
            },
            exit: {
                x: 40,
                opacity: 0
            },
            transition: {
                duration: 0.3,
                ease: [
                    0.4,
                    0,
                    0.2,
                    1
                ]
            },
            style: {
                width: WIDTH,
                flexShrink: 0,
                background: 'var(--bg-2)',
                borderLeft: '1px solid var(--line-2)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden'
            },
            children: selected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            overflow: 'hidden'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$CountryPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            iso3: selected,
                            onClose: onClose
                        }, void 0, false, {
                            fileName: "[project]/components/atlas/RightPanel.tsx",
                            lineNumber: 165,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/atlas/RightPanel.tsx",
                        lineNumber: 164,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBar, {
                        iso3: selected,
                        onClose: onClose,
                        onCompare: ()=>onCompare(selected)
                    }, void 0, false, {
                        fileName: "[project]/components/atlas/RightPanel.tsx",
                        lineNumber: 167,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ResumenContinental, {
                countries: countries
            }, void 0, false, {
                fileName: "[project]/components/atlas/RightPanel.tsx",
                lineNumber: 170,
                columnNumber: 11
            }, this)
        }, selected ?? 'resumen', false, {
            fileName: "[project]/components/atlas/RightPanel.tsx",
            lineNumber: 149,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/atlas/RightPanel.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/atlas/Timeline.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Timeline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
const YEARS = [
    2015,
    2016,
    2017,
    2018,
    2019,
    2020,
    2021,
    2022,
    2023,
    2024
];
function Timeline({ year, onChange }) {
    const [playing, setPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!playing) {
            if (timerRef.current) clearTimeout(timerRef.current);
            return;
        }
        timerRef.current = setTimeout(()=>{
            const idx = YEARS.indexOf(year);
            if (idx < YEARS.length - 1) {
                onChange(YEARS[idx + 1]);
            } else {
                setPlaying(false);
            }
        }, 1500);
        return ()=>{
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [
        playing,
        year,
        onChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            height: 64,
            background: 'var(--bg-2)',
            borderTop: '1px solid var(--line-2)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 16,
            flexShrink: 0,
            position: 'relative',
            zIndex: 10
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                onClick: ()=>setPlaying((v)=>!v),
                whileHover: {
                    scale: 1.08
                },
                whileTap: {
                    scale: 0.95
                },
                style: {
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 14,
                    flexShrink: 0,
                    boxShadow: '0 0 16px rgba(14,165,233,0.35)'
                },
                children: playing ? '⏸' : '▶'
            }, void 0, false, {
                fileName: "[project]/components/atlas/Timeline.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    padding: '0 4px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            left: 4,
                            right: 4,
                            top: '50%',
                            height: 1,
                            background: 'var(--line-2)',
                            transform: 'translateY(-50%)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/atlas/Timeline.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            left: 4,
                            top: '50%',
                            height: 1.5,
                            background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                            transform: 'translateY(-50%)',
                            width: `${YEARS.indexOf(year) / (YEARS.length - 1) * 100}%`,
                            transition: 'width .6s var(--ease)',
                            borderRadius: 1
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/atlas/Timeline.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    YEARS.map((y)=>{
                        const active = y === year;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setPlaying(false);
                                onChange(y);
                            },
                            style: {
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 4,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '2px',
                                position: 'relative',
                                zIndex: 1
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    animate: active ? {
                                        scale: 1.5,
                                        backgroundColor: '#06b6d4',
                                        boxShadow: '0 0 10px rgba(6,182,212,0.8)'
                                    } : {
                                        scale: 1,
                                        backgroundColor: '#1e3050',
                                        boxShadow: '0 0 0px rgba(6,182,212,0)'
                                    },
                                    transition: {
                                        duration: 0.25,
                                        ease: 'easeOut'
                                    },
                                    style: {
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        border: active ? '1.5px solid #06b6d4' : '1px solid rgba(148,163,184,0.2)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/Timeline.tsx",
                                    lineNumber: 90,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontFamily: 'var(--mono)',
                                        fontSize: 7.5,
                                        color: active ? 'var(--text)' : 'var(--text-4)',
                                        fontWeight: active ? 700 : 400,
                                        letterSpacing: '0.04em',
                                        transition: 'color .2s'
                                    },
                                    children: y
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/Timeline.tsx",
                                    lineNumber: 101,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, y, true, {
                            fileName: "[project]/components/atlas/Timeline.tsx",
                            lineNumber: 81,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/components/atlas/Timeline.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0.4,
                    y: 4
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    duration: 0.25
                },
                style: {
                    fontFamily: 'var(--mono)',
                    fontSize: 38,
                    fontWeight: 700,
                    color: 'var(--accent)',
                    letterSpacing: '-0.03em',
                    minWidth: 88,
                    textAlign: 'right',
                    flexShrink: 0,
                    lineHeight: 1
                },
                children: year
            }, year, false, {
                fileName: "[project]/components/atlas/Timeline.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/atlas/Timeline.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/atlas/MapOptions.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_OPTS",
    ()=>DEFAULT_OPTS,
    "default",
    ()=>MapOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
const DEFAULT_OPTS = {
    vizType: 'coropleta',
    projection: 'mercator',
    palette: 'divergente',
    theme: 'oscuro',
    isoLabels: false,
    patternLinks: false,
    activeSignals: true
};
const PALETTES = [
    {
        id: 'divergente',
        label: 'Divergente',
        gradient: 'linear-gradient(90deg, #0e7490, #facc15, #7f1d1d)'
    },
    {
        id: 'editorial',
        label: 'Editorial',
        gradient: 'linear-gradient(90deg, #16a34a, #fbbf24, #dc2626)'
    },
    {
        id: 'riesgo',
        label: 'Riesgo',
        gradient: 'linear-gradient(90deg, #facc15, #f97316, #dc2626)'
    },
    {
        id: 'vibrante',
        label: 'Vibrante',
        gradient: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #ef4444)'
    },
    {
        id: 'monocromo',
        label: 'Monocromo',
        gradient: 'linear-gradient(90deg, #1e293b, #94a3b8, #f1f5f9)'
    }
];
const COLOR_BAR = 'linear-gradient(90deg, #7f1d1d 0%, #dc2626 20%, #f97316 35%, #facc15 50%, #a3e635 65%, #0891b2 80%, #0e7490 100%)';
function Toggle({ label, checked, onToggle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 0'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontFamily: 'var(--sans)',
                    fontSize: 12,
                    color: 'var(--text-2)'
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/components/atlas/MapOptions.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onToggle,
                style: {
                    width: 36,
                    height: 20,
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    background: checked ? 'linear-gradient(135deg, #0ea5e9, #7c3aed)' : 'rgba(148,163,184,0.15)',
                    position: 'relative',
                    transition: 'background .2s'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        position: 'absolute',
                        top: 2,
                        left: checked ? 18 : 2,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#fff',
                        transition: 'left .2s'
                    }
                }, void 0, false, {
                    fileName: "[project]/components/atlas/MapOptions.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/atlas/MapOptions.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/atlas/MapOptions.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
function PillGroup({ options, active, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap'
        },
        children: options.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onChange(o.id),
                style: {
                    padding: '5px 12px',
                    borderRadius: 999,
                    fontFamily: 'var(--mono)',
                    fontSize: 8.5,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all .15s',
                    border: active === o.id ? '1px solid rgba(6,182,212,0.7)' : '1px solid rgba(148,163,184,0.2)',
                    background: active === o.id ? 'linear-gradient(135deg,#0ea5e9,#7c3aed)' : 'rgba(148,163,184,0.06)',
                    color: active === o.id ? '#fff' : 'var(--text-3)'
                },
                children: o.label
            }, o.id, false, {
                fileName: "[project]/components/atlas/MapOptions.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/atlas/MapOptions.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
function Section({ title, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            marginBottom: 18
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: 'var(--mono)',
                    fontSize: 8,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--text-3)',
                    marginBottom: 10
                },
                children: title
            }, void 0, false, {
                fileName: "[project]/components/atlas/MapOptions.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/atlas/MapOptions.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
}
function MapOptions({ open, onClose, opts, onChange }) {
    function set(key, val) {
        const next = {
            ...opts,
            [key]: val
        };
        onChange(next);
        try {
            localStorage.setItem('aletheia.atlas.mapOptions', JSON.stringify(next));
        } catch  {}
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                scale: 0.96,
                y: -8
            },
            animate: {
                opacity: 1,
                scale: 1,
                y: 0
            },
            exit: {
                opacity: 0,
                scale: 0.96,
                y: -8
            },
            transition: {
                duration: 0.18,
                ease: [
                    0.4,
                    0,
                    0.2,
                    1
                ]
            },
            style: {
                position: 'absolute',
                top: 14,
                right: 14,
                zIndex: 40,
                width: 340,
                background: 'rgba(9,18,34,0.97)',
                border: '1px solid rgba(148,163,184,0.15)',
                borderRadius: 16,
                boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(20px)',
                overflow: 'hidden'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px 12px',
                        borderBottom: '1px solid rgba(148,163,184,0.1)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontFamily: 'var(--mono)',
                                fontSize: 10,
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: 'var(--text)'
                            },
                            children: "OPCIONES DEL MAPA"
                        }, void 0, false, {
                            fileName: "[project]/components/atlas/MapOptions.tsx",
                            lineNumber: 137,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            style: {
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-3)',
                                fontSize: 16,
                                padding: 2
                            },
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/components/atlas/MapOptions.tsx",
                            lineNumber: 140,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/atlas/MapOptions.tsx",
                    lineNumber: 132,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: '16px 18px',
                        maxHeight: 'calc(100vh - 200px)',
                        overflowY: 'auto'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                            title: "Tipo de visualización",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PillGroup, {
                                options: [
                                    {
                                        id: 'coropleta',
                                        label: 'Coropleta'
                                    },
                                    {
                                        id: 'burbujas',
                                        label: 'Burbujas'
                                    }
                                ],
                                active: opts.vizType,
                                onChange: (v)=>set('vizType', v)
                            }, void 0, false, {
                                fileName: "[project]/components/atlas/MapOptions.tsx",
                                lineNumber: 149,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/atlas/MapOptions.tsx",
                            lineNumber: 148,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                            title: "Proyección",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PillGroup, {
                                options: [
                                    {
                                        id: 'mercator',
                                        label: 'Mercator'
                                    },
                                    {
                                        id: 'equalearth',
                                        label: 'Equal Earth'
                                    },
                                    {
                                        id: 'globe',
                                        label: 'Globo'
                                    }
                                ],
                                active: opts.projection,
                                onChange: (v)=>set('projection', v)
                            }, void 0, false, {
                                fileName: "[project]/components/atlas/MapOptions.tsx",
                                lineNumber: 157,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/atlas/MapOptions.tsx",
                            lineNumber: 156,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                            title: "Paleta de colores",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 6
                                },
                                children: PALETTES.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>set('palette', p.id),
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            padding: '8px 10px',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                            border: opts.palette === p.id ? '2px solid rgba(6,182,212,0.8)' : '1px solid rgba(148,163,184,0.12)',
                                            background: 'rgba(148,163,184,0.04)',
                                            boxShadow: opts.palette === p.id ? '0 0 10px rgba(6,182,212,0.2)' : 'none',
                                            transition: 'all .15s',
                                            textAlign: 'left'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 60,
                                                    height: 14,
                                                    borderRadius: 4,
                                                    background: p.gradient,
                                                    flexShrink: 0
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/atlas/MapOptions.tsx",
                                                lineNumber: 185,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 9,
                                                    color: 'var(--text-2)',
                                                    letterSpacing: '0.06em'
                                                },
                                                children: p.label
                                            }, void 0, false, {
                                                fileName: "[project]/components/atlas/MapOptions.tsx",
                                                lineNumber: 186,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, p.id, true, {
                                        fileName: "[project]/components/atlas/MapOptions.tsx",
                                        lineNumber: 171,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/atlas/MapOptions.tsx",
                                lineNumber: 169,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/atlas/MapOptions.tsx",
                            lineNumber: 168,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                            title: "Tema",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PillGroup, {
                                options: [
                                    {
                                        id: 'oscuro',
                                        label: 'Oscuro'
                                    },
                                    {
                                        id: 'claro',
                                        label: 'Claro'
                                    },
                                    {
                                        id: 'corporativo',
                                        label: 'Corporativo'
                                    }
                                ],
                                active: opts.theme,
                                onChange: (v)=>set('theme', v)
                            }, void 0, false, {
                                fileName: "[project]/components/atlas/MapOptions.tsx",
                                lineNumber: 195,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/atlas/MapOptions.tsx",
                            lineNumber: 194,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                            title: "Opciones",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Toggle, {
                                    label: "Etiquetas ISO",
                                    checked: opts.isoLabels,
                                    onToggle: ()=>set('isoLabels', !opts.isoLabels)
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/MapOptions.tsx",
                                    lineNumber: 207,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Toggle, {
                                    label: "Mostrar enlaces de patrón",
                                    checked: opts.patternLinks,
                                    onToggle: ()=>set('patternLinks', !opts.patternLinks)
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/MapOptions.tsx",
                                    lineNumber: 208,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Toggle, {
                                    label: "Mostrar señales activas",
                                    checked: opts.activeSignals,
                                    onToggle: ()=>set('activeSignals', !opts.activeSignals)
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/MapOptions.tsx",
                                    lineNumber: 209,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/atlas/MapOptions.tsx",
                            lineNumber: 206,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                borderTop: '1px solid rgba(148,163,184,0.1)',
                                paddingTop: 14
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontFamily: 'var(--mono)',
                                        fontSize: 8,
                                        letterSpacing: '0.14em',
                                        color: 'var(--text-3)',
                                        marginBottom: 8
                                    },
                                    children: "ESCALA · 0 LIMPIO → 100 CORRUPTO"
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/MapOptions.tsx",
                                    lineNumber: 214,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        height: 8,
                                        borderRadius: 4,
                                        background: COLOR_BAR,
                                        marginBottom: 4
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/MapOptions.tsx",
                                    lineNumber: 217,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontFamily: 'var(--mono)',
                                        fontSize: 7.5,
                                        color: 'var(--text-4)'
                                    },
                                    children: [
                                        0,
                                        25,
                                        50,
                                        75,
                                        100
                                    ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: n
                                        }, n, false, {
                                            fileName: "[project]/components/atlas/MapOptions.tsx",
                                            lineNumber: 219,
                                            columnNumber: 48
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/MapOptions.tsx",
                                    lineNumber: 218,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginTop: 8,
                                        fontFamily: 'var(--mono)',
                                        fontSize: 7.5,
                                        color: 'var(--text-4)'
                                    },
                                    children: "Los países atenuados están fuera del rango filtrado"
                                }, void 0, false, {
                                    fileName: "[project]/components/atlas/MapOptions.tsx",
                                    lineNumber: 221,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/atlas/MapOptions.tsx",
                            lineNumber: 213,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/atlas/MapOptions.tsx",
                    lineNumber: 146,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/atlas/MapOptions.tsx",
            lineNumber: 115,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/atlas/MapOptions.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/atlas/CountryTooltip.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CountryTooltip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
function ieaColor(iea) {
    if (iea === null) return '#64748b';
    if (iea <= 20) return '#dc2626';
    if (iea <= 35) return '#f97316';
    if (iea <= 50) return '#facc15';
    if (iea <= 65) return '#a3e635';
    if (iea <= 80) return '#0891b2';
    return '#0e7490';
}
function CountryTooltip({ info }) {
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [current, setCurrent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const showTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hideTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (info) {
            if (hideTimer.current) clearTimeout(hideTimer.current);
            showTimer.current = setTimeout(()=>{
                setCurrent(info);
                setVisible(true);
            }, 80);
        } else {
            if (showTimer.current) clearTimeout(showTimer.current);
            hideTimer.current = setTimeout(()=>setVisible(false), 100);
        }
    }, [
        info
    ]);
    if (!current) return null;
    const color = ieaColor(current.iea);
    const hasDelta = current.delta !== null;
    const deltaUp = hasDelta && current.delta > 0;
    const deltaEq = hasDelta && current.delta === 0;
    // Clamp to viewport
    const x = Math.min(current.x + 14, (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 800) - 210);
    const y = Math.min(current.y + 10, (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 600) - 120);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9999
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            children: visible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    scale: 0.95
                },
                animate: {
                    opacity: 1,
                    scale: 1
                },
                exit: {
                    opacity: 0,
                    scale: 0.95
                },
                transition: {
                    duration: 0.15,
                    ease: 'easeOut'
                },
                style: {
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: 200,
                    background: 'rgba(9,18,34,0.96)',
                    border: `1px solid ${color}40`,
                    borderRadius: 10,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${color}20`,
                    backdropFilter: 'blur(12px)',
                    padding: '10px 12px',
                    pointerEvents: 'none'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            marginBottom: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'var(--sans)',
                                    fontSize: 12.5,
                                    fontWeight: 600,
                                    color: 'var(--text)'
                                },
                                children: current.name
                            }, void 0, false, {
                                fileName: "[project]/components/atlas/CountryTooltip.tsx",
                                lineNumber: 81,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 8.5,
                                    color: 'var(--text-3)',
                                    letterSpacing: '0.06em'
                                },
                                children: current.iso3
                            }, void 0, false, {
                                fileName: "[project]/components/atlas/CountryTooltip.tsx",
                                lineNumber: 84,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/atlas/CountryTooltip.tsx",
                        lineNumber: 80,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 4,
                            marginBottom: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 32,
                                    fontWeight: 700,
                                    color,
                                    lineHeight: 1
                                },
                                children: current.iea !== null ? current.iea.toFixed(1) : '—'
                            }, void 0, false, {
                                fileName: "[project]/components/atlas/CountryTooltip.tsx",
                                lineNumber: 91,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 13,
                                    color: 'var(--text-3)'
                                },
                                children: "/100"
                            }, void 0, false, {
                                fileName: "[project]/components/atlas/CountryTooltip.tsx",
                                lineNumber: 94,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/atlas/CountryTooltip.tsx",
                        lineNumber: 90,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontFamily: 'var(--mono)',
                            fontSize: 8.5,
                            color: 'var(--text-3)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: current.year
                            }, void 0, false, {
                                fileName: "[project]/components/atlas/CountryTooltip.tsx",
                                lineNumber: 102,
                                columnNumber: 15
                            }, this),
                            hasDelta && !deltaEq && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: deltaUp ? '#22d3a0' : '#f43f5e'
                                },
                                children: [
                                    deltaUp ? '▲' : '▼',
                                    " ",
                                    Math.abs(current.delta).toFixed(1),
                                    " vs ",
                                    current.year - 1
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/atlas/CountryTooltip.tsx",
                                lineNumber: 104,
                                columnNumber: 17
                            }, this),
                            deltaEq && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: 'var(--text-4)'
                                },
                                children: "= sin cambio"
                            }, void 0, false, {
                                fileName: "[project]/components/atlas/CountryTooltip.tsx",
                                lineNumber: 108,
                                columnNumber: 27
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/atlas/CountryTooltip.tsx",
                        lineNumber: 98,
                        columnNumber: 13
                    }, this)
                ]
            }, "tooltip", true, {
                fileName: "[project]/components/atlas/CountryTooltip.tsx",
                lineNumber: 60,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/atlas/CountryTooltip.tsx",
            lineNumber: 58,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/atlas/CountryTooltip.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/(app)/atlas/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AtlasPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$LeftPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/atlas/LeftPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$RightPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/atlas/RightPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$Timeline$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/atlas/Timeline.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$MapOptions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/atlas/MapOptions.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$CountryTooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/atlas/CountryTooltip.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-data.ts [app-ssr] (ecmascript)");
;
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
const USE_MOCK = true;
const LeafletMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/components/atlas/LeafletMap.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: '100%',
                height: '100%',
                background: 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 10
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: 20,
                        height: 20,
                        border: '2px solid var(--line-2)',
                        borderTopColor: 'var(--accent)',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                    }
                }, void 0, false, {
                    fileName: "[project]/app/(app)/atlas/page.tsx",
                    lineNumber: 24,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontFamily: 'var(--mono)',
                        fontSize: 9,
                        color: 'var(--text-3)',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase'
                    },
                    children: "Cargando mapa…"
                }, void 0, false, {
                    fileName: "[project]/app/(app)/atlas/page.tsx",
                    lineNumber: 25,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/(app)/atlas/page.tsx",
            lineNumber: 20,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
});
const COLOR_BAR = 'linear-gradient(90deg, #7f1d1d 0%, #dc2626 20%, #f97316 35%, #facc15 50%, #a3e635 65%, #0891b2 80%, #0e7490 100%)';
function AtlasPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [countries, setCountries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [year, setYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(2024);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [rangeMin, setRangeMin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [rangeMax, setRangeMax] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(100);
    const [mapOptsOpen, setMapOptsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mapOpts, setMapOpts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$MapOptions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_OPTS"];
        //TURBOPACK unreachable
        ;
    });
    const [tooltip, setTooltip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newsPanelOpen, setNewsPanelOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            setCountries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOCK_COUNTRIES"]);
            setLoading(false);
            return;
        }
        //TURBOPACK unreachable
        ;
    }, [
        year
    ]);
    const rows = countries.map((c, i)=>({
            ...c,
            rank: i + 1
        }));
    const handleSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((iso3)=>{
        setSelected((prev)=>prev === iso3 ? null : iso3);
    }, []);
    const handleHover = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((info)=>{
        setTooltip(info);
    }, []);
    const handleCompare = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((iso3)=>{
        router.push(`/comparar?c=${iso3}`);
    }, [
        router
    ]);
    const handleRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((min, max)=>{
        setRangeMin(min);
        setRangeMax(max);
    }, []);
    function zoomIn() {
        const m = window.__aletheiaMap;
        m?.zoomIn?.();
    }
    function zoomOut() {
        const m = window.__aletheiaMap;
        m?.zoomOut?.();
    }
    function zoomReset() {
        const m = window.__aletheiaMap;
        m?.fitBounds?.([
            [
                -58,
                -120
            ],
            [
                74,
                -30
            ]
        ]);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    display: 'flex',
                    overflow: 'hidden',
                    minHeight: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$LeftPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        countries: rows,
                        selected: selected,
                        onSelect: handleSelect,
                        year: year,
                        rangeMin: rangeMin,
                        rangeMax: rangeMax,
                        onRange: handleRange
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/atlas/page.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            position: 'relative',
                            overflow: 'hidden',
                            background: 'var(--bg)'
                        },
                        children: [
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 20,
                                            height: 20,
                                            border: '2px solid var(--line-2)',
                                            borderTopColor: 'var(--accent)',
                                            borderRadius: '50%',
                                            animation: 'spin 0.8s linear infinite'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 130,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: 'var(--mono)',
                                            fontSize: 9,
                                            color: 'var(--text-3)',
                                            letterSpacing: '0.14em',
                                            textTransform: 'uppercase'
                                        },
                                        children: "Cargando datos…"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 131,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LeafletMap, {
                                scores: countries,
                                selected: selected,
                                rangeMin: rangeMin,
                                rangeMax: rangeMax,
                                onSelect: handleSelect,
                                onHover: handleHover
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    left: 14,
                                    bottom: 100,
                                    zIndex: 20,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 4
                                },
                                children: [
                                    {
                                        icon: '+',
                                        action: zoomIn,
                                        title: 'Acercar'
                                    },
                                    {
                                        icon: '−',
                                        action: zoomOut,
                                        title: 'Alejar'
                                    },
                                    {
                                        icon: '⊙',
                                        action: zoomReset,
                                        title: 'Restablecer'
                                    }
                                ].map(({ icon, action, title })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: action,
                                        title: title,
                                        style: {
                                            width: 32,
                                            height: 32,
                                            background: 'rgba(11,21,38,0.85)',
                                            border: '1px solid var(--line-2)',
                                            color: 'var(--text-3)',
                                            fontSize: 15,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backdropFilter: 'blur(8px)',
                                            borderRadius: 6,
                                            transition: 'border-color .15s, color .15s'
                                        },
                                        onMouseEnter: (e)=>{
                                            e.currentTarget.style.borderColor = 'var(--accent)';
                                            e.currentTarget.style.color = 'var(--text)';
                                        },
                                        onMouseLeave: (e)=>{
                                            e.currentTarget.style.borderColor = 'var(--line-2)';
                                            e.currentTarget.style.color = 'var(--text-3)';
                                        },
                                        children: icon
                                    }, icon, false, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    top: 14,
                                    right: 14,
                                    zIndex: 30,
                                    display: 'flex',
                                    gap: 6
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                                    onClick: ()=>setMapOptsOpen((v)=>!v),
                                    whileHover: {
                                        scale: 1.05
                                    },
                                    whileTap: {
                                        scale: 0.97
                                    },
                                    style: {
                                        padding: '6px 12px',
                                        background: mapOptsOpen ? 'rgba(6,182,212,0.15)' : 'rgba(11,21,38,0.85)',
                                        border: `1px solid ${mapOptsOpen ? 'rgba(6,182,212,0.6)' : 'var(--line-2)'}`,
                                        color: mapOptsOpen ? 'var(--accent)' : 'var(--text-3)',
                                        cursor: 'pointer',
                                        borderRadius: 8,
                                        backdropFilter: 'blur(8px)',
                                        fontFamily: 'var(--mono)',
                                        fontSize: 9,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        transition: 'all .15s'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "⚙"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/atlas/page.tsx",
                                            lineNumber: 190,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "OPCIONES"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(app)/atlas/page.tsx",
                                            lineNumber: 191,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(app)/atlas/page.tsx",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$MapOptions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                open: mapOptsOpen,
                                onClose: ()=>setMapOptsOpen(false),
                                opts: mapOpts,
                                onChange: setMapOpts
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    bottom: 14,
                                    left: 14,
                                    zIndex: 20,
                                    background: 'rgba(11,21,38,0.88)',
                                    border: '1px solid var(--line-2)',
                                    padding: '10px 14px',
                                    backdropFilter: 'blur(8px)',
                                    borderRadius: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontFamily: 'var(--mono)',
                                            fontSize: 7.5,
                                            color: 'var(--text-3)',
                                            letterSpacing: '0.14em',
                                            textTransform: 'uppercase',
                                            marginBottom: 6
                                        },
                                        children: [
                                            "Índice IEA · ",
                                            year,
                                            " · Escala 0–100"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 209,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 160,
                                            height: 5,
                                            background: COLOR_BAR,
                                            borderRadius: 3,
                                            marginBottom: 4
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 212,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontFamily: 'var(--mono)',
                                            fontSize: 7,
                                            color: 'var(--text-4)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "0 CORRUPTO"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                                lineNumber: 214,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "50"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                                lineNumber: 215,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "100 LIMPIO"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                                lineNumber: 216,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 213,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, this),
                            !selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    bottom: 14,
                                    right: 14,
                                    zIndex: 20,
                                    background: 'rgba(11,21,38,0.8)',
                                    border: '1px solid var(--line-2)',
                                    padding: '6px 12px',
                                    backdropFilter: 'blur(8px)',
                                    borderRadius: 6
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontFamily: 'var(--mono)',
                                        fontSize: 8,
                                        letterSpacing: '0.1em',
                                        color: 'var(--text-3)',
                                        textTransform: 'uppercase'
                                    },
                                    children: "Haz clic en un país"
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/atlas/page.tsx",
                                    lineNumber: 227,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 222,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(app)/atlas/page.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$RightPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        selected: selected,
                        countries: countries,
                        onClose: ()=>setSelected(null),
                        onCompare: handleCompare
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/atlas/page.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/atlas/page.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$Timeline$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                year: year,
                onChange: setYear
            }, void 0, false, {
                fileName: "[project]/app/(app)/atlas/page.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$CountryTooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                info: tooltip
            }, void 0, false, {
                fileName: "[project]/app/(app)/atlas/page.tsx",
                lineNumber: 247,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(app)/atlas/page.tsx",
        lineNumber: 110,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_0-siz9q._.js.map