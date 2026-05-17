module.exports = [
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
"[project]/components/forum/NewThreadModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewThreadModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-data.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const CAT_META = {
    pais: {
        label: 'País',
        desc: 'Conversación general del país',
        color: '#06b6d4'
    },
    gobierno: {
        label: 'Gobierno',
        desc: 'Análisis de un período o gobierno',
        color: '#a855f7'
    },
    tema: {
        label: 'Tema',
        desc: 'Caso, noticia o análisis específico',
        color: '#f59e0b'
    }
};
function NewThreadModal({ open, onClose, defaultCountry }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [country, setCountry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultCountry ?? '');
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [body, setBody] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const canSubmit = country && category && title.trim().length > 0 && !loading;
    async function handleSubmit() {
        if (!canSubmit) return;
        setLoading(true);
        setError('');
        try {
            const { data, error: err } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('forum_threads').insert({
                country_iso3: country,
                category: category,
                title: title.trim(),
                body: body.trim() || null,
                alert_level: 'watch',
                reply_count: 0,
                pinned: false
            }).select('id').single();
            if (err) throw err;
            onClose();
            router.push(`/foro/${data.id}`);
        } catch  {
            setError('No se pudo crear el hilo. Inicia sesión para publicar.');
            setLoading(false);
        }
    }
    const countries = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOCK_COUNTRIES"].slice().sort((a, b)=>a.name.localeCompare(b.name, 'es'));
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                scale: 0.95,
                y: 20
            },
            animate: {
                opacity: 1,
                scale: 1,
                y: 0
            },
            exit: {
                opacity: 0,
                scale: 0.95,
                y: 20
            },
            transition: {
                duration: 0.2,
                ease: [
                    0.4,
                    0,
                    0.2,
                    1
                ]
            },
            style: {
                background: '#fff',
                borderRadius: 16,
                width: '100%',
                maxWidth: 640,
                padding: 32,
                boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
                color: '#0f172a',
                maxHeight: '90vh',
                overflowY: 'auto'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 24
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontFamily: 'var(--serif)',
                                fontSize: 20,
                                fontWeight: 900,
                                color: '#0f172a'
                            },
                            children: "Nuevo hilo"
                        }, void 0, false, {
                            fileName: "[project]/components/forum/NewThreadModal.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            style: {
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#94a3b8',
                                fontSize: 22,
                                padding: 4
                            },
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/components/forum/NewThreadModal.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/forum/NewThreadModal.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: 20
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            style: {
                                display: 'block',
                                fontFamily: 'var(--mono)',
                                fontSize: 8,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: '#64748b',
                                marginBottom: 6
                            },
                            children: "PAÍS"
                        }, void 0, false, {
                            fileName: "[project]/components/forum/NewThreadModal.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: country,
                            onChange: (e)=>setCountry(e.target.value),
                            style: {
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: 8,
                                border: '1px solid #e2e8f0',
                                background: '#f8fafc',
                                fontFamily: 'var(--sans)',
                                fontSize: 13,
                                color: '#0f172a',
                                outline: 'none',
                                cursor: 'pointer'
                            },
                            onFocus: (e)=>e.currentTarget.style.borderColor = '#06b6d4',
                            onBlur: (e)=>e.currentTarget.style.borderColor = '#e2e8f0',
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "Selecciona un país…"
                                }, void 0, false, {
                                    fileName: "[project]/components/forum/NewThreadModal.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this),
                                countries.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: c.iso3,
                                        children: [
                                            c.flag,
                                            " ",
                                            c.name
                                        ]
                                    }, c.iso3, true, {
                                        fileName: "[project]/components/forum/NewThreadModal.tsx",
                                        lineNumber: 110,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/forum/NewThreadModal.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/forum/NewThreadModal.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: 20
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            style: {
                                display: 'block',
                                fontFamily: 'var(--mono)',
                                fontSize: 8,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: '#64748b',
                                marginBottom: 8
                            },
                            children: "CATEGORÍA"
                        }, void 0, false, {
                            fileName: "[project]/components/forum/NewThreadModal.tsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: 8
                            },
                            children: Object.entries(CAT_META).map(([id, meta])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCategory(id),
                                    style: {
                                        padding: '12px 10px',
                                        border: `2px solid ${category === id ? meta.color : '#e2e8f0'}`,
                                        borderRadius: 10,
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        background: category === id ? `${meta.color}10` : '#f8fafc',
                                        transition: 'all .15s'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontFamily: 'var(--sans)',
                                                fontSize: 12.5,
                                                fontWeight: 600,
                                                color: category === id ? meta.color : '#475569',
                                                marginBottom: 4
                                            },
                                            children: meta.label
                                        }, void 0, false, {
                                            fileName: "[project]/components/forum/NewThreadModal.tsx",
                                            lineNumber: 133,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontFamily: 'var(--sans)',
                                                fontSize: 10.5,
                                                color: '#94a3b8',
                                                lineHeight: 1.4
                                            },
                                            children: meta.desc
                                        }, void 0, false, {
                                            fileName: "[project]/components/forum/NewThreadModal.tsx",
                                            lineNumber: 136,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, id, true, {
                                    fileName: "[project]/components/forum/NewThreadModal.tsx",
                                    lineNumber: 122,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/forum/NewThreadModal.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/forum/NewThreadModal.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: 20
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 6
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        fontFamily: 'var(--mono)',
                                        fontSize: 8,
                                        letterSpacing: '0.18em',
                                        textTransform: 'uppercase',
                                        color: '#64748b'
                                    },
                                    children: "TÍTULO"
                                }, void 0, false, {
                                    fileName: "[project]/components/forum/NewThreadModal.tsx",
                                    lineNumber: 147,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontFamily: 'var(--mono)',
                                        fontSize: 9,
                                        color: title.length > 120 ? '#ef4444' : '#94a3b8'
                                    },
                                    children: [
                                        title.length,
                                        "/140"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/forum/NewThreadModal.tsx",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/forum/NewThreadModal.tsx",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            value: title,
                            onChange: (e)=>setTitle(e.target.value.slice(0, 140)),
                            placeholder: "¿Qué quieres discutir?",
                            style: {
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: 8,
                                border: '1px solid #e2e8f0',
                                background: '#f8fafc',
                                fontFamily: 'var(--sans)',
                                fontSize: 13,
                                color: '#0f172a',
                                outline: 'none',
                                boxSizing: 'border-box'
                            },
                            onFocus: (e)=>e.currentTarget.style.borderColor = '#06b6d4',
                            onBlur: (e)=>e.currentTarget.style.borderColor = '#e2e8f0'
                        }, void 0, false, {
                            fileName: "[project]/components/forum/NewThreadModal.tsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/forum/NewThreadModal.tsx",
                    lineNumber: 145,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: 24
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            style: {
                                display: 'block',
                                fontFamily: 'var(--mono)',
                                fontSize: 8,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: '#64748b',
                                marginBottom: 6
                            },
                            children: "PRIMER MENSAJE (opcional)"
                        }, void 0, false, {
                            fileName: "[project]/components/forum/NewThreadModal.tsx",
                            lineNumber: 171,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            value: body,
                            onChange: (e)=>setBody(e.target.value),
                            placeholder: "Abre la conversación con tu perspectiva…",
                            rows: 4,
                            style: {
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: 8,
                                border: '1px solid #e2e8f0',
                                background: '#f8fafc',
                                fontFamily: 'var(--sans)',
                                fontSize: 13,
                                color: '#0f172a',
                                outline: 'none',
                                resize: 'vertical',
                                boxSizing: 'border-box'
                            },
                            onFocus: (e)=>e.currentTarget.style.borderColor = '#06b6d4',
                            onBlur: (e)=>e.currentTarget.style.borderColor = '#e2e8f0'
                        }, void 0, false, {
                            fileName: "[project]/components/forum/NewThreadModal.tsx",
                            lineNumber: 174,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/forum/NewThreadModal.tsx",
                    lineNumber: 170,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: 16,
                        padding: '8px 12px',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: 6,
                        fontFamily: 'var(--sans)',
                        fontSize: 11,
                        color: '#dc2626'
                    },
                    children: error
                }, void 0, false, {
                    fileName: "[project]/components/forum/NewThreadModal.tsx",
                    lineNumber: 191,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 10
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            style: {
                                padding: '9px 20px',
                                background: 'transparent',
                                border: '1px solid #e2e8f0',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontFamily: 'var(--mono)',
                                fontSize: 9.5,
                                letterSpacing: '0.1em',
                                color: '#64748b'
                            },
                            children: "Cancelar"
                        }, void 0, false, {
                            fileName: "[project]/components/forum/NewThreadModal.tsx",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSubmit,
                            disabled: !canSubmit,
                            style: {
                                padding: '9px 22px',
                                background: canSubmit ? 'linear-gradient(135deg,#0ea5e9,#7c3aed)' : '#e2e8f0',
                                border: 'none',
                                borderRadius: 8,
                                cursor: canSubmit ? 'pointer' : 'not-allowed',
                                fontFamily: 'var(--mono)',
                                fontSize: 9.5,
                                letterSpacing: '0.1em',
                                color: canSubmit ? '#fff' : '#94a3b8',
                                opacity: loading ? 0.7 : 1
                            },
                            children: loading ? 'Publicando…' : 'Publicar hilo →'
                        }, void 0, false, {
                            fileName: "[project]/components/forum/NewThreadModal.tsx",
                            lineNumber: 208,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/forum/NewThreadModal.tsx",
                    lineNumber: 197,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/forum/NewThreadModal.tsx",
            lineNumber: 68,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/forum/NewThreadModal.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/forum/FilterSidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EMPTY_FILTERS",
    ()=>EMPTY_FILTERS,
    "default",
    ()=>FilterSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-data.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const REGIONS = [
    'Norteamérica',
    'Centroamérica',
    'Caribe',
    'Sudamérica'
];
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
const CATS = [
    {
        id: 'pais',
        label: 'País',
        color: '#06b6d4'
    },
    {
        id: 'gobierno',
        label: 'Gobierno',
        color: '#a855f7'
    },
    {
        id: 'tema',
        label: 'Tema',
        color: '#f59e0b'
    }
];
const ESTADOS = [
    'Abierto',
    'Movimiento',
    'Resuelto'
];
;
function toggle(arr, val) {
    return arr.includes(val) ? arr.filter((x)=>x !== val) : [
        ...arr,
        val
    ];
}
const EMPTY_FILTERS = {
    regions: [],
    countries: [],
    categories: [],
    years: [],
    estados: []
};
function FilterSidebar({ open, onClose, filters, onChange, onApply }) {
    const [countrySearch, setCountrySearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const activeCount = filters.regions.length + filters.countries.length + filters.categories.length + filters.years.length + filters.estados.length;
    const filteredCountries = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOCK_COUNTRIES"].filter((c)=>!countrySearch || c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.iso3.toLowerCase().includes(countrySearch.toLowerCase()));
    function chip(label, active, onClick, color) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onClick,
            style: {
                padding: '5px 12px',
                borderRadius: 999,
                cursor: 'pointer',
                fontFamily: 'var(--mono)',
                fontSize: 8.5,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: active ? `1px solid ${color ?? '#06b6d4'}` : '1px solid #e2e8f0',
                background: active ? `${color ?? '#06b6d4'}15` : 'transparent',
                color: active ? color ?? '#06b6d4' : '#64748b',
                transition: 'all .12s'
            },
            children: label
        }, label, false, {
            fileName: "[project]/components/forum/FilterSidebar.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, this);
    }
    function Section({ title, children }) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                marginBottom: 20
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontFamily: 'var(--mono)',
                        fontSize: 8,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: '#64748b',
                        marginBottom: 10
                    },
                    children: title
                }, void 0, false, {
                    fileName: "[project]/components/forum/FilterSidebar.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                children
            ]
        }, void 0, true, {
            fileName: "[project]/components/forum/FilterSidebar.tsx",
            lineNumber: 73,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: onClose,
                    style: {
                        position: 'fixed',
                        inset: 0,
                        zIndex: 800,
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(2px)'
                    }
                }, void 0, false, {
                    fileName: "[project]/components/forum/FilterSidebar.tsx",
                    lineNumber: 90,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        x: '100%'
                    },
                    animate: {
                        x: 0
                    },
                    exit: {
                        x: '100%'
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
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: 380,
                        zIndex: 900,
                        background: '#fff',
                        color: '#0f172a',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '-24px 0 60px rgba(0,0,0,0.3)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '18px 20px 14px',
                                borderBottom: '1px solid #f1f5f9'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontFamily: 'var(--serif)',
                                        fontSize: 18,
                                        fontWeight: 900,
                                        color: '#0f172a'
                                    },
                                    children: "Filtros"
                                }, void 0, false, {
                                    fileName: "[project]/components/forum/FilterSidebar.tsx",
                                    lineNumber: 113,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12
                                    },
                                    children: [
                                        activeCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onChange(EMPTY_FILTERS),
                                            style: {
                                                fontFamily: 'var(--sans)',
                                                fontSize: 12,
                                                color: '#06b6d4',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer'
                                            },
                                            children: "Limpiar todo"
                                        }, void 0, false, {
                                            fileName: "[project]/components/forum/FilterSidebar.tsx",
                                            lineNumber: 116,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: onClose,
                                            style: {
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#94a3b8',
                                                fontSize: 20
                                            },
                                            children: "×"
                                        }, void 0, false, {
                                            fileName: "[project]/components/forum/FilterSidebar.tsx",
                                            lineNumber: 123,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/forum/FilterSidebar.tsx",
                                    lineNumber: 114,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/forum/FilterSidebar.tsx",
                            lineNumber: 108,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: 1,
                                overflowY: 'auto',
                                padding: '16px 20px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                    title: "Región",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 6
                                        },
                                        children: REGIONS.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>onChange({
                                                        ...filters,
                                                        regions: toggle(filters.regions, r)
                                                    }),
                                                style: {
                                                    padding: '10px 14px',
                                                    borderRadius: 8,
                                                    border: filters.regions.includes(r) ? '2px solid #06b6d4' : '1px solid #f1f5f9',
                                                    background: filters.regions.includes(r) ? '#ecfeff' : '#f8fafc',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    fontFamily: 'var(--sans)',
                                                    fontSize: 12,
                                                    color: '#334155',
                                                    transition: 'all .12s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                },
                                                children: [
                                                    r,
                                                    filters.regions.includes(r) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: '#06b6d4'
                                                        },
                                                        children: "✓"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/forum/FilterSidebar.tsx",
                                                        lineNumber: 150,
                                                        columnNumber: 55
                                                    }, this)
                                                ]
                                            }, r, true, {
                                                fileName: "[project]/components/forum/FilterSidebar.tsx",
                                                lineNumber: 136,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/forum/FilterSidebar.tsx",
                                        lineNumber: 134,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/forum/FilterSidebar.tsx",
                                    lineNumber: 133,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                    title: "País",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: countrySearch,
                                            onChange: (e)=>setCountrySearch(e.target.value),
                                            placeholder: "Buscar país…",
                                            style: {
                                                width: '100%',
                                                padding: '8px 10px',
                                                borderRadius: 6,
                                                border: '1px solid #e2e8f0',
                                                background: '#f8fafc',
                                                fontFamily: 'var(--mono)',
                                                fontSize: 11,
                                                color: '#0f172a',
                                                outline: 'none',
                                                marginBottom: 8,
                                                boxSizing: 'border-box'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/forum/FilterSidebar.tsx",
                                            lineNumber: 157,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                maxHeight: 180,
                                                overflowY: 'auto',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2
                                            },
                                            children: filteredCountries.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>onChange({
                                                            ...filters,
                                                            countries: toggle(filters.countries, c.iso3)
                                                        }),
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: '7px 10px',
                                                        borderRadius: 6,
                                                        cursor: 'pointer',
                                                        background: filters.countries.includes(c.iso3) ? '#ecfeff' : 'transparent',
                                                        border: 'none',
                                                        transition: 'background .1s',
                                                        textAlign: 'left'
                                                    },
                                                    onMouseEnter: (e)=>{
                                                        if (!filters.countries.includes(c.iso3)) e.currentTarget.style.background = '#f8fafc';
                                                    },
                                                    onMouseLeave: (e)=>{
                                                        if (!filters.countries.includes(c.iso3)) e.currentTarget.style.background = 'transparent';
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontFamily: 'var(--sans)',
                                                                fontSize: 12,
                                                                color: '#334155'
                                                            },
                                                            children: [
                                                                c.flag,
                                                                " ",
                                                                c.name
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/forum/FilterSidebar.tsx",
                                                            lineNumber: 182,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontFamily: 'var(--mono)',
                                                                fontSize: 9,
                                                                color: '#94a3b8'
                                                            },
                                                            children: c.iso3
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/forum/FilterSidebar.tsx",
                                                            lineNumber: 185,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, c.iso3, true, {
                                                    fileName: "[project]/components/forum/FilterSidebar.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/forum/FilterSidebar.tsx",
                                            lineNumber: 168,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/forum/FilterSidebar.tsx",
                                    lineNumber: 156,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                    title: "Categoría",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: 6
                                        },
                                        children: CATS.map((cat)=>chip(cat.label, filters.categories.includes(cat.id), ()=>onChange({
                                                    ...filters,
                                                    categories: toggle(filters.categories, cat.id)
                                                }), cat.color))
                                    }, void 0, false, {
                                        fileName: "[project]/components/forum/FilterSidebar.tsx",
                                        lineNumber: 192,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/forum/FilterSidebar.tsx",
                                    lineNumber: 191,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                    title: "Año",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(5, 1fr)',
                                            gap: 6
                                        },
                                        children: YEARS.map((y)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>onChange({
                                                        ...filters,
                                                        years: toggle(filters.years, y)
                                                    }),
                                                style: {
                                                    padding: '7px',
                                                    borderRadius: 6,
                                                    cursor: 'pointer',
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 9,
                                                    fontWeight: 600,
                                                    border: 'none',
                                                    background: filters.years.includes(y) ? 'linear-gradient(135deg,#0ea5e9,#7c3aed)' : '#f1f5f9',
                                                    color: filters.years.includes(y) ? '#fff' : '#64748b',
                                                    transition: 'all .12s'
                                                },
                                                children: y
                                            }, y, false, {
                                                fileName: "[project]/components/forum/FilterSidebar.tsx",
                                                lineNumber: 200,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/forum/FilterSidebar.tsx",
                                        lineNumber: 198,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/forum/FilterSidebar.tsx",
                                    lineNumber: 197,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Section, {
                                    title: "Estado",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: 6
                                        },
                                        children: ESTADOS.map((e)=>chip(e, filters.estados.includes(e), ()=>onChange({
                                                    ...filters,
                                                    estados: toggle(filters.estados, e)
                                                })))
                                    }, void 0, false, {
                                        fileName: "[project]/components/forum/FilterSidebar.tsx",
                                        lineNumber: 221,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/forum/FilterSidebar.tsx",
                                    lineNumber: 220,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/forum/FilterSidebar.tsx",
                            lineNumber: 131,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '12px 20px',
                                borderTop: '1px solid #f1f5f9',
                                display: 'flex',
                                justifyContent: 'flex-end'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    onApply();
                                    onClose();
                                },
                                disabled: activeCount === 0,
                                style: {
                                    padding: '10px 24px',
                                    background: activeCount > 0 ? 'linear-gradient(135deg,#0ea5e9,#7c3aed)' : '#e2e8f0',
                                    border: 'none',
                                    borderRadius: 8,
                                    cursor: activeCount > 0 ? 'pointer' : 'not-allowed',
                                    fontFamily: 'var(--mono)',
                                    fontSize: 9.5,
                                    letterSpacing: '0.1em',
                                    color: activeCount > 0 ? '#fff' : '#94a3b8'
                                },
                                children: [
                                    "Aplicar (",
                                    activeCount,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/forum/FilterSidebar.tsx",
                                lineNumber: 232,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/forum/FilterSidebar.tsx",
                            lineNumber: 228,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/forum/FilterSidebar.tsx",
                    lineNumber: 94,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/components/forum/FilterSidebar.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/(app)/foro/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ForoPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$forum$2f$NewThreadModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/forum/NewThreadModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$forum$2f$FilterSidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/forum/FilterSidebar.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
const USE_MOCK = true;
// Map country_id → {name, flag}
const COUNTRY_MAP = Object.fromEntries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOCK_COUNTRIES"].map((c)=>[
        c.iso3,
        c
    ]));
// Derive visual category from alert_level for mock data
function threadCat(t) {
    if (t.alert_level === 'urgent') return 'gobierno';
    if (t.alert_level === 'alert') return 'pais';
    return 'tema';
}
const CAT_META = {
    todos: {
        label: 'Todos',
        color: 'var(--text-3)'
    },
    pais: {
        label: 'País',
        color: '#06b6d4'
    },
    gobierno: {
        label: 'Gobierno',
        color: '#a855f7'
    },
    tema: {
        label: 'Tema',
        color: '#f59e0b'
    }
};
function relTime(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'ahora mismo';
    if (m < 60) return `hace ${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `hace ${h}h`;
    return `hace ${Math.floor(h / 24)}d`;
}
function Avatar({ name, size = 32, analyst = false }) {
    const initials = name.split(' ').map((w)=>w[0]).join('').slice(0, 2).toUpperCase();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: size,
            height: size,
            borderRadius: '50%',
            flexShrink: 0,
            background: analyst ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'linear-gradient(135deg, #334155, #475569)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--mono)',
            fontSize: size * 0.35,
            color: '#fff',
            fontWeight: 700,
            border: analyst ? '2px solid rgba(6,182,212,0.4)' : 'none'
        },
        children: initials
    }, void 0, false, {
        fileName: "[project]/app/(app)/foro/page.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
function MessageCard({ reply, currentUser }) {
    const isMe = reply.created_by === currentUser;
    const [liked, setLiked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 8
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            duration: 0.2
        },
        style: {
            padding: '14px 20px',
            borderBottom: '1px solid var(--line)',
            transition: 'background .1s'
        },
        onMouseEnter: (e)=>e.currentTarget.style.background = 'rgba(16,30,52,0.5)',
        onMouseLeave: (e)=>e.currentTarget.style.background = 'transparent',
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                        name: reply.created_by,
                        size: 30,
                        analyst: reply.is_analyst
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontFamily: 'var(--sans)',
                                        fontSize: 12.5,
                                        fontWeight: 600,
                                        color: 'var(--text)'
                                    },
                                    children: reply.created_by
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                    lineNumber: 80,
                                    columnNumber: 13
                                }, this),
                                reply.is_analyst && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontFamily: 'var(--mono)',
                                        fontSize: 7,
                                        letterSpacing: '0.12em',
                                        color: '#06b6d4',
                                        background: 'rgba(6,182,212,0.1)',
                                        border: '1px solid rgba(6,182,212,0.3)',
                                        padding: '1px 5px',
                                        borderRadius: 3
                                    },
                                    children: "INSIGHT ENGINE"
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                    lineNumber: 84,
                                    columnNumber: 15
                                }, this),
                                isMe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontFamily: 'var(--mono)',
                                        fontSize: 7,
                                        letterSpacing: '0.12em',
                                        color: '#06b6d4',
                                        background: 'rgba(6,182,212,0.1)',
                                        border: '1px solid rgba(6,182,212,0.3)',
                                        padding: '1px 5px',
                                        borderRadius: 3
                                    },
                                    children: "TÚ"
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                    lineNumber: 92,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(app)/foro/page.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: 'var(--mono)',
                            fontSize: 8.5,
                            color: 'var(--text-4)'
                        },
                        children: relTime(reply.created_at)
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontFamily: 'var(--sans)',
                    fontSize: 12.5,
                    color: 'var(--text-2)',
                    lineHeight: 1.6,
                    paddingLeft: 38
                },
                children: reply.body
            }, void 0, false, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    marginTop: 8,
                    paddingLeft: 38
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setLiked((v)=>!v),
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'var(--mono)',
                            fontSize: 9,
                            color: liked ? '#f43f5e' : 'var(--text-4)',
                            padding: 0,
                            transition: 'color .15s'
                        },
                        children: [
                            liked ? '♥' : '♡',
                            " ",
                            reply.upvotes + (liked ? 1 : 0)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        style: {
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'var(--mono)',
                            fontSize: 9,
                            color: 'var(--text-4)',
                            padding: 0,
                            transition: 'color .15s'
                        },
                        onMouseEnter: (e)=>e.currentTarget.style.color = 'var(--text-2)',
                        onMouseLeave: (e)=>e.currentTarget.style.color = 'var(--text-4)',
                        children: "Responder"
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    reply.is_analyst && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: 'var(--mono)',
                            fontSize: 7.5,
                            color: 'var(--text-4)',
                            background: 'var(--bg-3)',
                            padding: '2px 7px',
                            borderRadius: 3
                        },
                        children: "fuente: AletheiaPath"
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(app)/foro/page.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
function ThreadView({ thread, replies, loading, onSend }) {
    const [msg, setMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const endRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const country = thread.country_id ? COUNTRY_MAP[thread.country_id] : null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        endRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [
        replies.length
    ]);
    function send() {
        if (!msg.trim()) return;
        onSend(msg.trim());
        setMsg('');
    }
    const cat = threadCat(thread);
    const { color } = CAT_META[cat];
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
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--line-2)',
                    flexShrink: 0,
                    background: 'var(--bg-2)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 7.5,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    color,
                                    border: `1px solid ${color}50`,
                                    padding: '2px 7px',
                                    borderRadius: 3,
                                    background: `${color}10`
                                },
                                children: CAT_META[cat].label
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 182,
                                columnNumber: 11
                            }, this),
                            country && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 14
                                },
                                children: country.flag
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 189,
                                columnNumber: 23
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 8.5,
                                    color: 'var(--text-3)'
                                },
                                children: [
                                    country?.name,
                                    " · 2024"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 193,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 8.5,
                                    color: 'var(--text-3)'
                                },
                                children: [
                                    replies.length,
                                    " mensajes"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 194,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 181,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            fontFamily: 'var(--serif)',
                            fontSize: 22,
                            fontWeight: 900,
                            color: 'var(--text)',
                            lineHeight: 1.25,
                            margin: 0
                        },
                        children: thread.title
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflowY: 'auto'
                },
                children: [
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6
                        },
                        children: [
                            1,
                            2,
                            3
                        ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: 80,
                                    background: 'var(--bg-3)',
                                    backgroundImage: 'linear-gradient(90deg,transparent 25%,var(--bg-4) 50%,transparent 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 1.5s infinite',
                                    borderRadius: 6
                                }
                            }, i, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 211,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 209,
                        columnNumber: 11
                    }, this) : replies.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            gap: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 32
                                },
                                children: "💬"
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 216,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 10,
                                    color: 'var(--text-3)',
                                    letterSpacing: '0.1em'
                                },
                                children: "SIN MENSAJES — SÉ EL PRIMERO"
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 217,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 215,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: replies.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MessageCard, {
                                reply: r
                            }, r.id, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 223,
                                columnNumber: 31
                            }, this))
                    }, void 0, false),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: endRef
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 207,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flexShrink: 0,
                    borderTop: '1px solid var(--line-2)',
                    background: 'var(--bg-2)',
                    padding: '12px 16px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: 'var(--bg-3)',
                        border: '1px solid var(--line-2)',
                        borderRadius: 10,
                        overflow: 'hidden',
                        transition: 'border-color .15s'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 10,
                                padding: '10px 12px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                    name: "U",
                                    size: 24
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                    lineNumber: 240,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: msg,
                                    onChange: (e)=>setMsg(e.target.value),
                                    onKeyDown: (e)=>{
                                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send();
                                    },
                                    placeholder: `Añade un comentario en ${country?.name ?? 'este hilo'}…`,
                                    rows: 3,
                                    style: {
                                        flex: 1,
                                        background: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        fontFamily: 'var(--sans)',
                                        fontSize: 12.5,
                                        color: 'var(--text)',
                                        resize: 'none',
                                        lineHeight: 1.5
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                    lineNumber: 241,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(app)/foro/page.tsx",
                            lineNumber: 239,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '6px 12px',
                                borderTop: '1px solid var(--line)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontFamily: 'var(--mono)',
                                        fontSize: 8,
                                        color: 'var(--text-4)',
                                        letterSpacing: '0.06em'
                                    },
                                    children: "Como invitado · ⌘+Enter para publicar"
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                    lineNumber: 258,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: send,
                                    disabled: !msg.trim(),
                                    style: {
                                        padding: '6px 16px',
                                        background: msg.trim() ? 'linear-gradient(135deg,#0ea5e9,#7c3aed)' : 'rgba(148,163,184,0.1)',
                                        border: 'none',
                                        borderRadius: 6,
                                        cursor: msg.trim() ? 'pointer' : 'not-allowed',
                                        fontFamily: 'var(--mono)',
                                        fontSize: 9,
                                        letterSpacing: '0.1em',
                                        color: msg.trim() ? '#fff' : 'var(--text-4)',
                                        transition: 'all .15s'
                                    },
                                    children: "Comentar →"
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                    lineNumber: 261,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(app)/foro/page.tsx",
                            lineNumber: 254,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(app)/foro/page.tsx",
                    lineNumber: 234,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 230,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(app)/foro/page.tsx",
        lineNumber: 175,
        columnNumber: 5
    }, this);
}
function EmptyThreadState() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 12,
            color: 'var(--text-3)',
            background: 'var(--bg)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 40,
                    opacity: 0.3
                },
                children: "💬"
            }, void 0, false, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 289,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontFamily: 'var(--mono)',
                    fontSize: 9.5,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    opacity: 0.6
                },
                children: "Selecciona un hilo para ver la conversación"
            }, void 0, false, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 290,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(app)/foro/page.tsx",
        lineNumber: 284,
        columnNumber: 5
    }, this);
}
function ForoInner() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const countryParam = params.get('country');
    const [threads, setThreads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [replies, setReplies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeId, setActiveId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('todos');
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [replLoading, setReplLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newModal, setNewModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filterOpen, setFilterOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$forum$2f$FilterSidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EMPTY_FILTERS"]);
    // Load threads
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setLoading(true);
        if ("TURBOPACK compile-time truthy", 1) {
            let t = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOCK_THREADS"];
            if (countryParam) t = t.filter((x)=>x.country_id === countryParam);
            setThreads(t);
            setLoading(false);
            return;
        }
        //TURBOPACK unreachable
        ;
    }, [
        countryParam
    ]);
    // Load replies when thread selected
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!activeId) {
            setReplies([]);
            return;
        }
        setReplLoading(true);
        if (USE_MOCK && activeId === 'th2') {
            setReplies(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOCK_REPLIES"]);
            setReplLoading(false);
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('forum_replies').select('*').eq('thread_id', activeId).order('created_at').then(({ data })=>{
            setReplies(data ?? []);
            setReplLoading(false);
        });
        // Realtime subscription
        const sub = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].channel(`forum:${activeId}`).on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'forum_replies',
            filter: `thread_id=eq.${activeId}`
        }, (payload)=>{
            setReplies((prev)=>[
                    ...prev,
                    payload.new
                ]);
        }).subscribe();
        return ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].removeChannel(sub);
        };
    }, [
        activeId
    ]);
    const activeThread = threads.find((t)=>t.id === activeId);
    // Filter threads by tab + search
    const visibleThreads = threads.filter((t)=>{
        if (tab !== 'todos' && threadCat(t) !== tab) return false;
        if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (filters.countries.length && !filters.countries.includes(t.country_id ?? '')) return false;
        return true;
    });
    async function handleSend(body) {
        if (!activeId) return;
        const mock = {
            id: `r_${Date.now()}`,
            thread_id: activeId,
            created_by: 'Invitado',
            is_analyst: false,
            upvotes: 0,
            created_at: new Date().toISOString(),
            body
        };
        setReplies((prev)=>[
                ...prev,
                mock
            ]);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    const activeCount = filters.regions.length + filters.countries.length + filters.categories.length + filters.years.length + filters.estados.length;
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '0 16px',
                    height: 52,
                    borderBottom: '1px solid var(--line-2)',
                    flexShrink: 0,
                    background: 'var(--bg-2)',
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            bottom: -1,
                            left: 0,
                            right: 0,
                            height: 1,
                            background: 'linear-gradient(90deg,var(--accent),transparent 60%)',
                            opacity: 0.4,
                            pointerEvents: 'none'
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 387,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            flexShrink: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: 'var(--good)',
                                    animation: 'pulse 2s ease-in-out infinite'
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 391,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 8.5,
                                    color: 'var(--text-3)',
                                    letterSpacing: '0.1em'
                                },
                                children: [
                                    threads.length,
                                    " HILOS ACTIVOS"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 392,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 390,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            maxWidth: 480,
                            position: 'relative'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    position: 'absolute',
                                    left: 10,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-3)',
                                    fontSize: 12
                                },
                                children: "⌕"
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 399,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: search,
                                onChange: (e)=>setSearch(e.target.value),
                                placeholder: "Buscar hilos, país, presidente…",
                                style: {
                                    width: '100%',
                                    padding: '7px 10px 7px 30px',
                                    background: 'rgba(56,189,248,.04)',
                                    border: '1px solid var(--line-2)',
                                    color: 'var(--text)',
                                    fontFamily: 'var(--mono)',
                                    fontSize: 11,
                                    outline: 'none',
                                    borderRadius: 6,
                                    boxSizing: 'border-box',
                                    transition: 'border-color .15s'
                                },
                                onFocus: (e)=>e.currentTarget.style.borderColor = 'var(--accent)',
                                onBlur: (e)=>e.currentTarget.style.borderColor = 'var(--line-2)'
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 398,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginLeft: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            flexShrink: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setFilterOpen(true),
                                style: {
                                    padding: '6px 12px',
                                    background: 'transparent',
                                    border: '1px solid rgba(148,163,184,0.2)',
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    fontFamily: 'var(--mono)',
                                    fontSize: 8.5,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    transition: 'all .15s'
                                },
                                onMouseEnter: (e)=>{
                                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)';
                                    e.currentTarget.style.color = 'var(--text)';
                                },
                                onMouseLeave: (e)=>{
                                    e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)';
                                    e.currentTarget.style.color = 'var(--text-3)';
                                },
                                children: [
                                    "⊞ Filtrar",
                                    activeCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            background: '#06b6d4',
                                            color: '#fff',
                                            borderRadius: '50%',
                                            width: 16,
                                            height: 16,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 8,
                                            fontWeight: 700
                                        },
                                        children: activeCount
                                    }, void 0, false, {
                                        fileName: "[project]/app/(app)/foro/page.tsx",
                                        lineNumber: 433,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 418,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setNewModal(true),
                                style: {
                                    padding: '6px 14px',
                                    background: 'linear-gradient(135deg,#0ea5e9,#7c3aed)',
                                    border: 'none',
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    fontFamily: 'var(--mono)',
                                    fontSize: 8.5,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    color: '#fff',
                                    whiteSpace: 'nowrap',
                                    transition: 'opacity .15s'
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.opacity = '0.9',
                                onMouseLeave: (e)=>e.currentTarget.style.opacity = '1',
                                children: "+ Nuevo hilo"
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 439,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push('/atlas'),
                                style: {
                                    padding: '6px 12px',
                                    background: 'transparent',
                                    border: '1px solid rgba(148,163,184,0.2)',
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    fontFamily: 'var(--mono)',
                                    fontSize: 8.5,
                                    letterSpacing: '0.08em',
                                    color: 'var(--text-3)',
                                    transition: 'all .15s'
                                },
                                onMouseEnter: (e)=>{
                                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)';
                                    e.currentTarget.style.color = 'var(--text)';
                                },
                                onMouseLeave: (e)=>{
                                    e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)';
                                    e.currentTarget.style.color = 'var(--text-3)';
                                },
                                children: "× Volver"
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 455,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 417,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 381,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0,
                    borderBottom: '1px solid var(--line-2)',
                    flexShrink: 0,
                    background: 'var(--bg-2)',
                    padding: '0 16px'
                },
                children: [
                    [
                        'todos',
                        'pais',
                        'gobierno',
                        'tema'
                    ].map((t)=>{
                        const active = tab === t;
                        const meta = CAT_META[t];
                        const count = t === 'todos' ? threads.length : threads.filter((x)=>threadCat(x) === t).length;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setTab(t),
                            style: {
                                padding: '10px 14px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: `2px solid ${active ? meta.color ?? 'var(--accent)' : 'transparent'}`,
                                cursor: 'pointer',
                                transition: 'border-color .15s, color .15s',
                                fontFamily: 'var(--mono)',
                                fontSize: 8.5,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: active ? meta.color ?? 'var(--text)' : 'var(--text-3)',
                                whiteSpace: 'nowrap'
                            },
                            children: [
                                meta.label,
                                " ",
                                count
                            ]
                        }, t, true, {
                            fileName: "[project]/app/(app)/foro/page.tsx",
                            lineNumber: 484,
                            columnNumber: 13
                        }, this);
                    }),
                    countryParam && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginLeft: 12,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontFamily: 'var(--mono)',
                                fontSize: 8,
                                letterSpacing: '0.1em',
                                color: 'var(--accent)',
                                background: 'rgba(6,182,212,0.1)',
                                border: '1px solid rgba(6,182,212,0.3)',
                                padding: '2px 8px',
                                borderRadius: 999,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                            },
                            children: [
                                COUNTRY_MAP[countryParam]?.flag,
                                " ",
                                COUNTRY_MAP[countryParam]?.name,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push('/foro'),
                                    style: {
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--accent)',
                                        fontSize: 13,
                                        padding: 0,
                                        lineHeight: 1
                                    },
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                    lineNumber: 511,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(app)/foro/page.tsx",
                            lineNumber: 504,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 503,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 473,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    display: 'flex',
                    overflow: 'hidden',
                    minHeight: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 340,
                            flexShrink: 0,
                            background: 'var(--bg-2)',
                            borderRight: '1px solid var(--line-2)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: 1,
                                overflowY: 'auto'
                            },
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px 14px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 4
                                },
                                children: Array.from({
                                    length: 6
                                }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 70,
                                            background: 'var(--bg-3)',
                                            backgroundImage: 'linear-gradient(90deg,transparent 25%,var(--bg-4) 50%,transparent 75%)',
                                            backgroundSize: '200% 100%',
                                            animation: 'shimmer 1.5s infinite',
                                            borderRadius: 4
                                        }
                                    }, i, false, {
                                        fileName: "[project]/app/(app)/foro/page.tsx",
                                        lineNumber: 533,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 531,
                                columnNumber: 15
                            }, this) : visibleThreads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 28
                                        },
                                        children: "🔍"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(app)/foro/page.tsx",
                                        lineNumber: 538,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: 'var(--mono)',
                                            fontSize: 9,
                                            color: 'var(--text-3)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em'
                                        },
                                        children: "Sin resultados"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(app)/foro/page.tsx",
                                        lineNumber: 539,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 537,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                variants: {
                                    hidden: {},
                                    show: {
                                        transition: {
                                            staggerChildren: 0.03
                                        }
                                    }
                                },
                                initial: "hidden",
                                animate: "show",
                                children: visibleThreads.map((t)=>{
                                    const active = t.id === activeId;
                                    const cat = threadCat(t);
                                    const { color } = CAT_META[cat];
                                    const country = t.country_id ? COUNTRY_MAP[t.country_id] : null;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        variants: {
                                            hidden: {
                                                opacity: 0,
                                                x: -6
                                            },
                                            show: {
                                                opacity: 1,
                                                x: 0,
                                                transition: {
                                                    duration: 0.2
                                                }
                                            }
                                        },
                                        onClick: ()=>setActiveId(active ? null : t.id),
                                        style: {
                                            padding: '12px 14px',
                                            cursor: 'pointer',
                                            borderLeft: `3px solid ${active ? 'var(--accent)' : 'transparent'}`,
                                            background: active ? 'rgba(56,189,248,0.04)' : 'transparent',
                                            borderBottom: '1px solid var(--line)',
                                            transition: 'background .12s, border-left-color .12s'
                                        },
                                        onMouseEnter: (e)=>{
                                            if (!active) e.currentTarget.style.background = 'var(--bg-3)';
                                        },
                                        onMouseLeave: (e)=>{
                                            if (!active) e.currentTarget.style.background = 'transparent';
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    marginBottom: 5
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontFamily: 'var(--mono)',
                                                            fontSize: 7,
                                                            letterSpacing: '0.1em',
                                                            textTransform: 'uppercase',
                                                            color,
                                                            border: `1px solid ${color}40`,
                                                            padding: '1px 5px',
                                                            borderRadius: 3,
                                                            background: `${color}0d`,
                                                            flexShrink: 0
                                                        },
                                                        children: CAT_META[cat].label
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(app)/foro/page.tsx",
                                                        lineNumber: 567,
                                                        columnNumber: 25
                                                    }, this),
                                                    country && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: 11
                                                        },
                                                        children: country.flag
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(app)/foro/page.tsx",
                                                        lineNumber: 574,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontFamily: 'var(--mono)',
                                                            fontSize: 7.5,
                                                            color: 'var(--text-4)'
                                                        },
                                                        children: [
                                                            country?.name,
                                                            " · 2024"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(app)/foro/page.tsx",
                                                        lineNumber: 575,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(app)/foro/page.tsx",
                                                lineNumber: 566,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontFamily: 'var(--sans)',
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    color: active ? 'var(--text)' : 'var(--text-2)',
                                                    lineHeight: 1.4,
                                                    margin: '0 0 6px',
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical'
                                                },
                                                children: [
                                                    t.pinned && '📌 ',
                                                    t.title
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(app)/foro/page.tsx",
                                                lineNumber: 579,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 7.5,
                                                    color: 'var(--text-4)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "💬 ",
                                                            t.reply_count
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(app)/foro/page.tsx",
                                                        lineNumber: 589,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: relTime(t.created_at)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(app)/foro/page.tsx",
                                                        lineNumber: 590,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(app)/foro/page.tsx",
                                                lineNumber: 588,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, t.id, true, {
                                        fileName: "[project]/app/(app)/foro/page.tsx",
                                        lineNumber: 552,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 542,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/foro/page.tsx",
                            lineNumber: 529,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 524,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            overflow: 'hidden',
                            background: 'var(--bg)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            mode: "wait",
                            children: activeThread ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0
                                },
                                animate: {
                                    opacity: 1
                                },
                                exit: {
                                    opacity: 0
                                },
                                transition: {
                                    duration: 0.15
                                },
                                style: {
                                    height: '100%'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadView, {
                                    thread: activeThread,
                                    replies: replies,
                                    loading: replLoading,
                                    onSend: handleSend
                                }, void 0, false, {
                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                    lineNumber: 612,
                                    columnNumber: 17
                                }, this)
                            }, activeThread.id, false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 604,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0
                                },
                                animate: {
                                    opacity: 1
                                },
                                style: {
                                    height: '100%'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyThreadState, {}, void 0, false, {
                                    fileName: "[project]/app/(app)/foro/page.tsx",
                                    lineNumber: 621,
                                    columnNumber: 17
                                }, this)
                            }, "empty", false, {
                                fileName: "[project]/app/(app)/foro/page.tsx",
                                lineNumber: 620,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(app)/foro/page.tsx",
                            lineNumber: 602,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/foro/page.tsx",
                        lineNumber: 601,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 521,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: newModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$forum$2f$NewThreadModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    open: newModal,
                    onClose: ()=>setNewModal(false),
                    defaultCountry: countryParam ?? ''
                }, void 0, false, {
                    fileName: "[project]/app/(app)/foro/page.tsx",
                    lineNumber: 631,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 629,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$forum$2f$FilterSidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                open: filterOpen,
                onClose: ()=>setFilterOpen(false),
                filters: filters,
                onChange: setFilters,
                onApply: ()=>{}
            }, void 0, false, {
                fileName: "[project]/app/(app)/foro/page.tsx",
                lineNumber: 639,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(app)/foro/page.tsx",
        lineNumber: 379,
        columnNumber: 5
    }, this);
}
function ForoPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--text-3)',
                fontFamily: 'var(--mono)',
                fontSize: 10
            },
            children: "Cargando foro…"
        }, void 0, false, {
            fileName: "[project]/app/(app)/foro/page.tsx",
            lineNumber: 652,
            columnNumber: 25
        }, this),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ForoInner, {}, void 0, false, {
            fileName: "[project]/app/(app)/foro/page.tsx",
            lineNumber: 653,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(app)/foro/page.tsx",
        lineNumber: 652,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_0ofwm7-._.js.map