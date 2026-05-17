(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/auth/WorldMapBg.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorldMapBg
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const ARCS = [
    {
        startLat: -33.45,
        startLng: -70.65,
        endLat: 40.42,
        endLng: -3.70
    },
    {
        startLat: -15.78,
        startLng: -47.93,
        endLat: 48.86,
        endLng: 2.35
    },
    {
        startLat: 4.71,
        startLng: -74.07,
        endLat: 51.51,
        endLng: -0.13
    },
    {
        startLat: -12.05,
        startLng: -77.04,
        endLat: 52.52,
        endLng: 13.41
    },
    {
        startLat: 19.43,
        startLng: -99.13,
        endLat: 40.71,
        endLng: -74.01
    },
    {
        startLat: -34.60,
        startLng: -58.38,
        endLat: 1.29,
        endLng: 36.82
    },
    {
        startLat: -0.23,
        startLng: -78.52,
        endLat: 35.69,
        endLng: 139.69
    },
    {
        startLat: 10.48,
        startLng: -66.90,
        endLat: 59.91,
        endLng: 10.75
    }
];
function project(lng, lat, W, H) {
    const x = (lng + 180) / 360 * W;
    const sinLat = Math.sin(lat * Math.PI / 180);
    const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * H;
    return [
        x,
        y
    ];
}
function bezier(t, x1, y1, cx, cy, x2, y2) {
    const u = 1 - t;
    return [
        u * u * x1 + 2 * u * t * cx + t * t * x2,
        u * u * y1 + 2 * u * t * cy + t * t * y2
    ];
}
function WorldMapBg() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        mounted: true,
        arcs: [],
        raf: null,
        topo: null
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldMapBg.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            state.current.mounted = true;
            function setSize() {
                if (!canvas) return;
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            }
            setSize();
            window.addEventListener('resize', setSize);
            state.current.arcs = ARCS.map({
                "WorldMapBg.useEffect": (d)=>({
                        ...d,
                        progress: 0
                    })
            }["WorldMapBg.useEffect"]);
            function drawTopo(ctx, topo, W, H) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const topojson = window.topojson;
                if (!topojson) return;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const features = topojson.feature(topo, topo.objects.countries).features;
                features.forEach({
                    "WorldMapBg.useEffect.drawTopo": (f)=>{
                        if (!f.geometry) return;
                        const polys = f.geometry.type === 'Polygon' ? [
                            f.geometry.coordinates
                        ] : f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [];
                        polys.forEach({
                            "WorldMapBg.useEffect.drawTopo": (poly)=>{
                                poly.forEach({
                                    "WorldMapBg.useEffect.drawTopo": (ring)=>{
                                        const fixed = [
                                            ring[0].slice()
                                        ];
                                        for(let i = 1; i < ring.length; i++){
                                            let lng = ring[i][0];
                                            const diff = lng - fixed[fixed.length - 1][0];
                                            if (diff > 180) lng -= 360;
                                            else if (diff < -180) lng += 360;
                                            fixed.push([
                                                lng,
                                                ring[i][1]
                                            ]);
                                        }
                                        const lngs = fixed.map({
                                            "WorldMapBg.useEffect.drawTopo.lngs": (p)=>p[0]
                                        }["WorldMapBg.useEffect.drawTopo.lngs"]);
                                        if (Math.max(...lngs) - Math.min(...lngs) > 270) return;
                                        ctx.beginPath();
                                        fixed.forEach({
                                            "WorldMapBg.useEffect.drawTopo": ([lng, lat], i)=>{
                                                const [x, y] = project(lng, lat, W, H);
                                                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                                            }
                                        }["WorldMapBg.useEffect.drawTopo"]);
                                        ctx.closePath();
                                        ctx.fillStyle = 'rgba(14,165,233,0.03)';
                                        ctx.strokeStyle = 'rgba(56,189,248,0.13)';
                                        ctx.lineWidth = 0.4;
                                        ctx.fill();
                                        ctx.stroke();
                                    }
                                }["WorldMapBg.useEffect.drawTopo"]);
                            }
                        }["WorldMapBg.useEffect.drawTopo"]);
                    }
                }["WorldMapBg.useEffect.drawTopo"]);
            }
            function draw() {
                if (!state.current.mounted || !canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                const W = canvas.width, H = canvas.height;
                ctx.clearRect(0, 0, W, H);
                if (state.current.topo) drawTopo(ctx, state.current.topo, W, H);
                const now = Date.now();
                state.current.arcs.forEach({
                    "WorldMapBg.useEffect.draw": (arc)=>{
                        const [x1, y1] = project(arc.startLng, arc.startLat, W, H);
                        const [x2, y2] = project(arc.endLng, arc.endLat, W, H);
                        const dist = Math.hypot(x2 - x1, y2 - y1);
                        const cx = (x1 + x2) / 2;
                        const cy = Math.min(y1, y2) - dist * 0.38;
                        const t = arc.progress;
                        const N = 64;
                        ctx.beginPath();
                        for(let i = 0; i <= N; i++){
                            const [bx, by] = bezier(i / N, x1, y1, cx, cy, x2, y2);
                            i === 0 ? ctx.moveTo(bx, by) : ctx.lineTo(bx, by);
                        }
                        ctx.strokeStyle = 'rgba(56,189,248,0.08)';
                        ctx.lineWidth = 0.8;
                        ctx.setLineDash([
                            3,
                            6
                        ]);
                        ctx.stroke();
                        ctx.setLineDash([]);
                        if (t > 0) {
                            const steps = Math.max(2, Math.floor(N * t));
                            ctx.beginPath();
                            for(let i = 0; i <= steps; i++){
                                const [bx, by] = bezier(i / N, x1, y1, cx, cy, x2, y2);
                                i === 0 ? ctx.moveTo(bx, by) : ctx.lineTo(bx, by);
                            }
                            ctx.strokeStyle = 'rgba(14,165,233,0.65)';
                            ctx.lineWidth = 1.6;
                            ctx.stroke();
                            const [hx, hy] = bezier(t, x1, y1, cx, cy, x2, y2);
                            const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 12);
                            g.addColorStop(0, 'rgba(56,189,248,0.55)');
                            g.addColorStop(1, 'rgba(56,189,248,0)');
                            ctx.beginPath();
                            ctx.arc(hx, hy, 12, 0, Math.PI * 2);
                            ctx.fillStyle = g;
                            ctx.fill();
                            ctx.beginPath();
                            ctx.arc(hx, hy, 2.5, 0, Math.PI * 2);
                            ctx.fillStyle = 'rgba(186,230,253,0.95)';
                            ctx.fill();
                        }
                        ;
                        [
                            [
                                x1,
                                y1
                            ],
                            [
                                x2,
                                y2
                            ]
                        ].forEach({
                            "WorldMapBg.useEffect.draw": ([px, py])=>{
                                const pulse = 0.35 + 0.3 * Math.sin(now / 650 + px * 0.015);
                                ctx.beginPath();
                                ctx.arc(px, py, 5, 0, Math.PI * 2);
                                ctx.strokeStyle = `rgba(56,189,248,${pulse.toFixed(2)})`;
                                ctx.lineWidth = 1;
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.arc(px, py, 2.2, 0, Math.PI * 2);
                                ctx.fillStyle = 'rgba(56,189,248,0.9)';
                                ctx.fill();
                            }
                        }["WorldMapBg.useEffect.draw"]);
                    }
                }["WorldMapBg.useEffect.draw"]);
                state.current.raf = requestAnimationFrame(draw);
            }
            fetch('/countries-110m.json').then({
                "WorldMapBg.useEffect": (r)=>r.json()
            }["WorldMapBg.useEffect"]).then({
                "WorldMapBg.useEffect": (topo)=>{
                    if (state.current.mounted) state.current.topo = topo;
                }
            }["WorldMapBg.useEffect"]).catch({
                "WorldMapBg.useEffect": ()=>{}
            }["WorldMapBg.useEffect"]);
            // Animate arcs with simple JS since GSAP not available in Next.js
            state.current.arcs.forEach({
                "WorldMapBg.useEffect": (arc, i)=>{
                    const duration = 3000;
                    const delay = i * 720;
                    const repeatDelay = 600;
                    let start = null;
                    function animate(ts) {
                        if (!state.current.mounted) return;
                        if (start === null) start = ts;
                        const elapsed = ts - start;
                        const cycle = duration + repeatDelay;
                        const t = elapsed % cycle / duration;
                        arc.progress = Math.min(1, t <= 1 ? easeInOut(t) : 0);
                        requestAnimationFrame(animate);
                    }
                    setTimeout({
                        "WorldMapBg.useEffect": ()=>requestAnimationFrame(animate)
                    }["WorldMapBg.useEffect"], delay);
                }
            }["WorldMapBg.useEffect"]);
            function easeInOut(t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            }
            draw();
            return ({
                "WorldMapBg.useEffect": ()=>{
                    state.current.mounted = false;
                    window.removeEventListener('resize', setSize);
                    if (state.current.raf) cancelAnimationFrame(state.current.raf);
                }
            })["WorldMapBg.useEffect"];
        }
    }["WorldMapBg.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: "absolute inset-0 w-full h-full pointer-events-none opacity-75"
    }, void 0, false, {
        fileName: "[project]/components/auth/WorldMapBg.tsx",
        lineNumber: 199,
        columnNumber: 5
    }, this);
}
_s(WorldMapBg, "UZcFMI+FJ18A6BFRU/ynpKC5H0s=");
_c = WorldMapBg;
var _c;
__turbopack_context__.k.register(_c, "WorldMapBg");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/app/(auth)/login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2f$WorldMapBg$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/auth/WorldMapBg.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function LoginPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('login');
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [remember, setRemember] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [exiting, setExiting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (tab === 'login') {
                const { error: err } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
                    email,
                    password
                });
                if (err) {
                    setError(err.message);
                    setLoading(false);
                    return;
                }
            } else {
                if (name.trim().length < 2) {
                    setError('Ingresa tu nombre.');
                    setLoading(false);
                    return;
                }
                if (password.length < 6) {
                    setError('La contraseña debe tener al menos 6 caracteres.');
                    setLoading(false);
                    return;
                }
                const { data, error: err } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name: name.trim()
                        }
                    }
                });
                if (err) {
                    setError(err.message);
                    setLoading(false);
                    return;
                }
                if (data.user && !data.session) {
                    setError('Revisa tu correo para confirmar la cuenta antes de iniciar sesión.');
                    setLoading(false);
                    return;
                }
            }
            triggerTransition();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error inesperado.');
            setLoading(false);
        }
    }
    function handleGuest() {
        // Store guest flag in sessionStorage
        sessionStorage.setItem('aletheia_guest', '1');
        triggerTransition();
    }
    function triggerTransition() {
        setExiting(true);
        // Navigate after cinematic exit completes
        setTimeout(()=>router.push('/atlas'), 900);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 overflow-hidden flex items-center justify-center",
        style: {
            background: 'linear-gradient(160deg, #071221 0%, #0f2237 45%, #0a1d30 100%)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 pointer-events-none",
                style: {
                    background: `
            radial-gradient(circle at 18% 30%, rgba(14,165,233,0.22), transparent 48%),
            radial-gradient(circle at 80% 68%, rgba(124,58,237,0.14), transparent 48%),
            radial-gradient(circle at 55% 10%, rgba(13,148,136,0.10), transparent 38%),
            repeating-linear-gradient(0deg, transparent 0 39px, rgba(255,255,255,0.022) 39px 40px),
            repeating-linear-gradient(90deg, transparent 0 39px, rgba(255,255,255,0.022) 39px 40px)
          `
                }
            }, void 0, false, {
                fileName: "[project]/app/(auth)/login/page.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2f$WorldMapBg$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/(auth)/login/page.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "relative z-10 flex-1 max-w-[560px] flex flex-col gap-8 select-none",
                animate: exiting ? {
                    x: '-100%',
                    opacity: 0
                } : {
                    x: 0,
                    opacity: 1
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
                initial: {
                    opacity: 0,
                    x: -24
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[28px] font-medium tracking-tight",
                                style: {
                                    fontFamily: 'Montserrat, system-ui, sans-serif',
                                    color: '#eef4fc',
                                    letterSpacing: '-0.02em'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: '#38bdf8',
                                            marginRight: 10,
                                            fontSize: 12,
                                            verticalAlign: 'middle'
                                        },
                                        children: "◆"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(auth)/login/page.tsx",
                                        lineNumber: 96,
                                        columnNumber: 13
                                    }, this),
                                    "Aletheia"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 text-[11px] uppercase tracking-[0.14em]",
                                style: {
                                    color: '#7fa3c8'
                                },
                                children: "Índice ilustrativo · Periodismo de datos"
                            }, void 0, false, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(auth)/login/page.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-[54px] font-medium leading-[1.05] m-0",
                                style: {
                                    fontFamily: 'Montserrat, system-ui, sans-serif',
                                    color: '#eef4fc',
                                    letterSpacing: '-0.02em'
                                },
                                children: "La corrupción no es una cifra."
                            }, void 0, false, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-[54px] font-medium leading-[1.05] m-0 mb-5",
                                style: {
                                    fontFamily: 'Montserrat, system-ui, sans-serif',
                                    color: '#5a7fa8',
                                    letterSpacing: '-0.02em'
                                },
                                children: "Es una conversación que empieza aquí."
                            }, void 0, false, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[14px] leading-[1.65] m-0 max-w-[460px]",
                                style: {
                                    color: '#7fa3c8'
                                },
                                children: "Explora el mapa interactivo de América con datos ilustrativos: rankings, comparativas, evolución temporal, fichas de país con presidente, gabinete y titulares de prensa. Pensado para investigar, contrastar y entender."
                            }, void 0, false, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(auth)/login/page.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-10 pt-7 border-t border-white/10",
                        children: [
                            [
                                'Países',
                                '29'
                            ],
                            [
                                'Años',
                                '10'
                            ],
                            [
                                'Regiones',
                                '4'
                            ]
                        ].map(([label, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] uppercase tracking-[0.12em]",
                                        style: {
                                            color: '#7fa3c8'
                                        },
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/app/(auth)/login/page.tsx",
                                        lineNumber: 131,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[26px] font-medium mt-1",
                                        style: {
                                            fontFamily: 'Geist Mono, ui-monospace, monospace',
                                            color: '#38bdf8'
                                        },
                                        children: value
                                    }, void 0, false, {
                                        fileName: "[project]/app/(auth)/login/page.tsx",
                                        lineNumber: 132,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, label, true, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(auth)/login/page.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[10px] tracking-[0.06em]",
                        style: {
                            color: '#4a6a8a'
                        },
                        children: "© Aletheia · Datos ficticios con fines demostrativos"
                    }, void 0, false, {
                        fileName: "[project]/app/(auth)/login/page.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(auth)/login/page.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-16 hidden lg:block"
            }, void 0, false, {
                fileName: "[project]/app/(auth)/login/page.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "relative z-10 w-[420px] rounded-xl shadow-2xl p-8 flex-shrink-0",
                style: {
                    background: '#ffffff',
                    maxHeight: 'calc(100vh - 80px)',
                    overflowY: 'auto'
                },
                animate: exiting ? {
                    x: '120%',
                    opacity: 0
                } : {
                    x: 0,
                    opacity: 1
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
                initial: {
                    opacity: 0,
                    x: 24
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[10px] uppercase tracking-[0.16em] mb-2",
                        style: {
                            color: '#0ea5e9'
                        },
                        children: "Acceso"
                    }, void 0, false, {
                        fileName: "[project]/app/(auth)/login/page.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        mode: "wait",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h1, {
                            initial: {
                                opacity: 0,
                                y: 8
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            exit: {
                                opacity: 0,
                                y: -8
                            },
                            transition: {
                                duration: 0.2
                            },
                            className: "text-[32px] font-medium mb-7 leading-tight",
                            style: {
                                fontFamily: 'Montserrat, system-ui, sans-serif',
                                color: '#0d1b2a',
                                letterSpacing: '-0.02em'
                            },
                            children: tab === 'login' ? 'Bienvenido de vuelta.' : 'Crea tu cuenta.'
                        }, tab, false, {
                            fileName: "[project]/app/(auth)/login/page.tsx",
                            lineNumber: 162,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(auth)/login/page.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex rounded-lg p-1 mb-6",
                        style: {
                            background: '#f4f6fb',
                            border: '1px solid #d4dded'
                        },
                        children: [
                            'login',
                            'register'
                        ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setTab(t);
                                    setError('');
                                },
                                className: "flex-1 py-2 rounded-md text-[13px] font-medium transition-all duration-150",
                                style: tab === t ? {
                                    background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
                                    color: '#fff'
                                } : {
                                    color: '#64748b'
                                },
                                children: t === 'login' ? 'Iniciar sesión' : 'Registrarse'
                            }, t, false, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 178,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(auth)/login/page.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "flex flex-col gap-4",
                        children: [
                            tab === 'register' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-[11px] mb-1.5 font-medium",
                                        style: {
                                            color: '#475569'
                                        },
                                        children: "Nombre"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(auth)/login/page.tsx",
                                        lineNumber: 195,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: name,
                                        onChange: (e)=>setName(e.target.value),
                                        placeholder: "Tu nombre completo",
                                        autoComplete: "name",
                                        className: "w-full rounded-lg px-3 py-2.5 text-[13px] outline-none transition-all",
                                        style: {
                                            border: '1px solid #d4dded',
                                            color: '#0d1b2a',
                                            background: '#fff'
                                        },
                                        onFocus: (e)=>e.currentTarget.style.borderColor = '#0ea5e9',
                                        onBlur: (e)=>e.currentTarget.style.borderColor = '#d4dded'
                                    }, void 0, false, {
                                        fileName: "[project]/app/(auth)/login/page.tsx",
                                        lineNumber: 196,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 194,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-[11px] mb-1.5 font-medium",
                                        style: {
                                            color: '#475569'
                                        },
                                        children: "Correo electrónico"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(auth)/login/page.tsx",
                                        lineNumber: 207,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "email",
                                        value: email,
                                        onChange: (e)=>setEmail(e.target.value),
                                        placeholder: "tu@correo.com",
                                        autoComplete: "email",
                                        required: true,
                                        className: "w-full rounded-lg px-3 py-2.5 text-[13px] outline-none transition-all",
                                        style: {
                                            border: '1px solid #d4dded',
                                            color: '#0d1b2a',
                                            background: '#fff'
                                        },
                                        onFocus: (e)=>e.currentTarget.style.borderColor = '#0ea5e9',
                                        onBlur: (e)=>e.currentTarget.style.borderColor = '#d4dded'
                                    }, void 0, false, {
                                        fileName: "[project]/app/(auth)/login/page.tsx",
                                        lineNumber: 208,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 206,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-[11px] mb-1.5 font-medium",
                                        style: {
                                            color: '#475569'
                                        },
                                        children: "Contraseña"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(auth)/login/page.tsx",
                                        lineNumber: 218,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "password",
                                        value: password,
                                        onChange: (e)=>setPassword(e.target.value),
                                        placeholder: tab === 'register' ? 'Mínimo 6 caracteres' : '•••••••••',
                                        autoComplete: tab === 'register' ? 'new-password' : 'current-password',
                                        required: true,
                                        className: "w-full rounded-lg px-3 py-2.5 text-[13px] outline-none transition-all",
                                        style: {
                                            border: '1px solid #d4dded',
                                            color: '#0d1b2a',
                                            background: '#fff'
                                        },
                                        onFocus: (e)=>e.currentTarget.style.borderColor = '#0ea5e9',
                                        onBlur: (e)=>e.currentTarget.style.borderColor = '#d4dded'
                                    }, void 0, false, {
                                        fileName: "[project]/app/(auth)/login/page.tsx",
                                        lineNumber: 219,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 217,
                                columnNumber: 11
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[11px] px-3 py-2 rounded-md",
                                style: {
                                    color: '#b91c1c',
                                    background: '#fef2f2',
                                    border: '1px solid #fecaca'
                                },
                                children: [
                                    "⚠ ",
                                    error
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 231,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between text-[11px]",
                                style: {
                                    color: '#64748b'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-2 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: remember,
                                                onChange: (e)=>setRemember(e.target.checked),
                                                className: "accent-[#0ea5e9]"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(auth)/login/page.tsx",
                                                lineNumber: 238,
                                                columnNumber: 15
                                            }, this),
                                            "Mantener sesión"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(auth)/login/page.tsx",
                                        lineNumber: 237,
                                        columnNumber: 13
                                    }, this),
                                    tab === 'login' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#",
                                        onClick: (e)=>e.preventDefault(),
                                        className: "hover:underline",
                                        style: {
                                            color: '#0ea5e9'
                                        },
                                        children: "¿Olvidaste la contraseña?"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(auth)/login/page.tsx",
                                        lineNumber: 245,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: loading,
                                className: "w-full py-3 rounded-lg text-[13px] font-semibold text-white uppercase tracking-wider transition-opacity disabled:opacity-60 active:translate-y-px",
                                style: {
                                    background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)'
                                },
                                children: loading ? 'Cargando…' : tab === 'login' ? 'Ingresar' : 'Crear cuenta'
                            }, void 0, false, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(auth)/login/page.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 my-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 h-px",
                                style: {
                                    background: '#d4dded'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 262,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] uppercase tracking-wider",
                                style: {
                                    color: '#94a3b8'
                                },
                                children: "o bien"
                            }, void 0, false, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 263,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 h-px",
                                style: {
                                    background: '#d4dded'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 264,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(auth)/login/page.tsx",
                        lineNumber: 261,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleGuest,
                        className: "w-full py-2.5 rounded-lg text-[13px] font-medium uppercase tracking-wide transition-all",
                        style: {
                            border: '1px dashed #bec9de',
                            color: '#475569',
                            background: 'transparent'
                        },
                        onMouseEnter: (e)=>{
                            e.currentTarget.style.borderStyle = 'solid';
                            e.currentTarget.style.borderColor = '#0ea5e9';
                        },
                        onMouseLeave: (e)=>{
                            e.currentTarget.style.borderStyle = 'dashed';
                            e.currentTarget.style.borderColor = '#bec9de';
                        },
                        children: "Continuar como invitado"
                    }, void 0, false, {
                        fileName: "[project]/app/(auth)/login/page.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-5 text-[10px] leading-relaxed",
                        style: {
                            color: '#6b7fa3'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono font-medium",
                                children: "PROTOTIPO"
                            }, void 0, false, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/app/(auth)/login/page.tsx",
                                lineNumber: 278,
                                columnNumber: 67
                            }, this),
                            "Las credenciales se guardan localmente en este navegador. No envíes datos reales."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(auth)/login/page.tsx",
                        lineNumber: 277,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(auth)/login/page.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(auth)/login/page.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_s(LoginPage, "emr1eRmOyPuYS+e636NEkqa6tWE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LoginPage;
var _c;
__turbopack_context__.k.register(_c, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_08z4u8a._.js.map