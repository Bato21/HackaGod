module.exports = [
"[project]/lib/supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-ssr] (ecmascript) <locals>");
;
const URL = 'https://yiqxyfesywdswtcjaqeq.supabase.co';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcXh5ZmVzeXdkc3d0Y2phcWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTE3NzYsImV4cCI6MjA5NDQ2Nzc3Nn0.26aatH3JqmPzGEsQbp7kSvNP8KVYiIrnazD38qLWq_c';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(URL, ANON);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$CountryPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/atlas/CountryPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2d$tokens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/design-tokens.ts [app-ssr] (ecmascript)");
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
const USE_MOCK = true // set false to fetch from Supabase
;
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
                gap: 12
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
                    lineNumber: 16,
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
                    lineNumber: 17,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/(app)/atlas/page.tsx",
            lineNumber: 15,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
});
function dotColor(iea) {
    if (iea === null) return {
        color: 'var(--line-2)',
        pulse: false
    };
    if (iea < 30) return {
        color: '#22d3a0',
        pulse: false
    };
    if (iea < 50) return {
        color: '#facc15',
        pulse: false
    };
    if (iea < 70) return {
        color: '#fb923c',
        pulse: false
    };
    return {
        color: '#f43f5e',
        pulse: true
    };
}
const ROW_VARIANTS = {
    hidden: {
        opacity: 0,
        x: -8
    },
    show: (i)=>({
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                delay: i * 0.03,
                ease: 'easeOut'
            }
        })
};
function AtlasPage() {
    const [countries, setCountries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) {
            setCountries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOCK_COUNTRIES"]);
            setLoading(false);
            return;
        }
        //TURBOPACK unreachable
        ;
    }, []);
    const filtered = countries.filter((c)=>!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.iso3.toLowerCase().includes(search.toLowerCase()));
    const panelOpen = !!selected;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: `264px 1fr${panelOpen ? ' 372px' : ''}`,
            height: '100%',
            transition: 'grid-template-columns .35s var(--ease)',
            overflow: 'hidden'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: 'var(--bg-2)',
                    borderRight: '1px solid var(--line-2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '14px 16px 10px',
                            borderBottom: '1px solid var(--line)',
                            flexShrink: 0
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            height: 1,
                                            background: 'var(--accent)',
                                            opacity: 0.25
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 86,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: 'var(--mono)',
                                            fontSize: 8,
                                            letterSpacing: '0.22em',
                                            textTransform: 'uppercase',
                                            color: 'var(--accent)'
                                        },
                                        children: "Ranking IEA"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 87,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            height: 1,
                                            background: 'var(--accent)',
                                            opacity: 0.25
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 90,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 8,
                                    color: 'var(--text-4)',
                                    textAlign: 'center',
                                    marginBottom: 10,
                                    letterSpacing: '0.07em'
                                },
                                children: loading ? '…' : `${countries.length} países · 2023`
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: search,
                                onChange: (e)=>setSearch(e.target.value),
                                placeholder: "Buscar país…",
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
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(app)/atlas/page.tsx",
                        lineNumber: 83,
                        columnNumber: 9
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
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '12px 14px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 4
                                },
                                children: Array.from({
                                    length: 12
                                }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 36,
                                            background: 'var(--bg-3)',
                                            backgroundImage: 'linear-gradient(90deg, transparent 25%, var(--bg-4) 50%, transparent 75%)',
                                            backgroundSize: '200% 100%',
                                            animation: 'shimmer 1.5s infinite'
                                        }
                                    }, i, false, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 117,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: "hidden",
                                animate: "show",
                                children: filtered.map((c, i)=>{
                                    const dot = dotColor(c.iea);
                                    const active = c.iso3 === selected;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        custom: i,
                                        variants: ROW_VARIANTS,
                                        onClick: ()=>setSelected(active ? null : c.iso3),
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: '24px 22px 1fr 50px 10px',
                                            gap: 6,
                                            alignItems: 'center',
                                            padding: '8px 14px 8px 16px',
                                            cursor: 'pointer',
                                            borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                                            background: active ? 'var(--bg-4)' : 'transparent',
                                            boxShadow: active ? 'inset 0 0 20px rgba(56,189,248,.04)' : 'none',
                                            borderBottom: '1px solid var(--line)',
                                            transition: 'background .12s, border-left-color .12s'
                                        },
                                        onHoverStart: ()=>{},
                                        whileHover: active ? {} : {
                                            backgroundColor: 'rgba(16,30,52,1)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 8.5,
                                                    color: 'var(--text-4)',
                                                    textAlign: 'right'
                                                },
                                                children: String(i + 1).padStart(2, '0')
                                            }, void 0, false, {
                                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                                lineNumber: 144,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 12,
                                                    textAlign: 'center'
                                                },
                                                children: c.flag
                                            }, void 0, false, {
                                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                                lineNumber: 147,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 12.5,
                                                    color: active ? 'var(--text)' : 'var(--text-2)',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    transition: 'color .12s'
                                                },
                                                children: c.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                                lineNumber: 148,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: 'var(--mono)',
                                                    fontSize: 11,
                                                    fontWeight: 500,
                                                    textAlign: 'right',
                                                    color: active ? 'var(--accent)' : 'var(--text-2)',
                                                    transition: 'color .12s'
                                                },
                                                children: c.iea !== null ? c.iea.toFixed(1) : '—'
                                            }, void 0, false, {
                                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                                lineNumber: 151,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 7,
                                                    height: 7,
                                                    borderRadius: '50%',
                                                    background: dot.color,
                                                    animation: dot.pulse ? 'pulse 1.8s ease-in-out infinite' : 'none'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                                lineNumber: 154,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, c.iso3, true, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 126,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 121,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(app)/atlas/page.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/atlas/page.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'var(--bg)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LeafletMap, {
                        scores: countries,
                        selected: selected,
                        onSelect: (iso3)=>setSelected(iso3 === selected ? null : iso3),
                        severityColor: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2d$tokens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["severityColor"]
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/atlas/page.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: 14,
                            right: 14,
                            zIndex: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6
                        },
                        children: [
                            '+',
                            '−',
                            '⊙'
                        ].map((icon)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const map = window.__aletheiaMap;
                                    if (!map) return;
                                    if (icon === '+') map.zoomIn();
                                    else if (icon === '−') map.zoomOut();
                                    else map.fitBounds([
                                        [
                                            -58,
                                            -120
                                        ],
                                        [
                                            74,
                                            -30
                                        ]
                                    ]);
                                },
                                style: {
                                    width: 30,
                                    height: 30,
                                    background: 'rgba(11,21,38,.8)',
                                    border: '1px solid var(--line-2)',
                                    color: 'var(--text-3)',
                                    fontSize: 14,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backdropFilter: 'blur(4px)',
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
                                lineNumber: 179,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/atlas/page.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: 14,
                            right: 60,
                            zIndex: 10,
                            background: 'rgba(11,21,38,.8)',
                            border: '1px solid var(--line-2)',
                            padding: '7px 12px',
                            backdropFilter: 'blur(4px)'
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
                            lineNumber: 207,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/atlas/page.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            bottom: 14,
                            left: 14,
                            zIndex: 10,
                            background: 'rgba(11,21,38,.85)',
                            border: '1px solid var(--line-2)',
                            padding: '10px 14px',
                            backdropFilter: 'blur(4px)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontFamily: 'var(--mono)',
                                    fontSize: 7.5,
                                    color: 'var(--text-3)',
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    marginBottom: 7
                                },
                                children: "Índice IEA 2023 · Corrupción estimada"
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 214,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 132,
                                    height: 4,
                                    background: 'linear-gradient(to right, #22d3a0, #facc15, #fb923c, #f43f5e)',
                                    marginBottom: 4
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 217,
                                columnNumber: 11
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Bajo"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 219,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Moderado"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 219,
                                        columnNumber: 30
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Alto"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 219,
                                        columnNumber: 51
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Crítico"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(app)/atlas/page.tsx",
                                        lineNumber: 219,
                                        columnNumber: 68
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(app)/atlas/page.tsx",
                                lineNumber: 218,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(app)/atlas/page.tsx",
                        lineNumber: 213,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(app)/atlas/page.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        x: 372,
                        opacity: 0
                    },
                    animate: {
                        x: 0,
                        opacity: 1
                    },
                    exit: {
                        x: 372,
                        opacity: 0
                    },
                    transition: {
                        duration: 0.35,
                        ease: [
                            0.22,
                            1,
                            0.36,
                            1
                        ]
                    },
                    style: {
                        borderLeft: '1px solid var(--line-2)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$atlas$2f$CountryPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        iso3: selected,
                        onClose: ()=>setSelected(null)
                    }, void 0, false, {
                        fileName: "[project]/app/(app)/atlas/page.tsx",
                        lineNumber: 235,
                        columnNumber: 13
                    }, this)
                }, "panel", false, {
                    fileName: "[project]/app/(app)/atlas/page.tsx",
                    lineNumber: 227,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(app)/atlas/page.tsx",
                lineNumber: 225,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(app)/atlas/page.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_0fv.te3._.js.map