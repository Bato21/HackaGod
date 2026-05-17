(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/mock-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const USE_MOCK = true // set false to fetch from Supabase
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
            if ("TURBOPACK compile-time truthy", 1) {
                setThreads(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_THREADS"]);
                setLoading(false);
                return;
            }
            //TURBOPACK unreachable
            ;
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
                        lineNumber: 38,
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
                        lineNumber: 40,
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
                        lineNumber: 43,
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
                                lineNumber: 50,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 48,
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
                        lineNumber: 64,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 36,
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
                            lineNumber: 80,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 79,
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
                                lineNumber: 88,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 86,
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
                                lineNumber: 93,
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
                                lineNumber: 94,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 92,
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
                                            lineNumber: 113,
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
                                                    lineNumber: 123,
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
                                                            lineNumber: 127,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: new Date(t.created_at).toLocaleDateString('es')
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(app)/foro/page.tsx",
                                                            lineNumber: 128,
                                                            columnNumber: 25
                                                        }, this),
                                                        t.pinned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: 'var(--accent)'
                                                            },
                                                            children: "📌 Fijado"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(app)/foro/page.tsx",
                                                            lineNumber: 129,
                                                            columnNumber: 38
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                                    lineNumber: 126,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(app)/foro/page.tsx",
                                            lineNumber: 122,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                    lineNumber: 104,
                                    columnNumber: 19
                                }, this)
                            }, t.id, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 102,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 97,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(app)/foro/page.tsx",
        lineNumber: 32,
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

//# sourceMappingURL=_0hh-ao4._.js.map