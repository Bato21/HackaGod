(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/atlas/LeafletMap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeafletMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// NOTE: requires `npm install topojson-client @types/topojson-client`
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
// ISO3 alpha → ISO numeric (Natural Earth 110m codes) for LATAM
const ISO3_TO_NUMERIC = {
    MEX: 484,
    GTM: 320,
    BLZ: 84,
    HND: 340,
    SLV: 222,
    NIC: 558,
    CRI: 188,
    PAN: 591,
    CUB: 192,
    JAM: 388,
    HTI: 332,
    DOM: 214,
    TTO: 780,
    BRB: 52,
    LCA: 662,
    VCT: 670,
    GRD: 308,
    ATG: 28,
    COL: 170,
    VEN: 862,
    GUY: 328,
    SUR: 740,
    ECU: 218,
    PER: 604,
    BRA: 76,
    BOL: 68,
    PRY: 600,
    CHL: 152,
    ARG: 32,
    URY: 858,
    USA: 840,
    CAN: 124,
    GBR: 826,
    ESP: 724,
    FRA: 250,
    DEU: 276,
    ITA: 380,
    PRT: 620
};
const NUMERIC_TO_ISO3 = Object.fromEntries(_c1 = Object.entries(ISO3_TO_NUMERIC).map(_c = ([k, v])=>[
        v,
        k
    ]));
_c2 = NUMERIC_TO_ISO3;
// Divergent palette per spec
function ieaFill(iea) {
    if (iea === null) return '#1e293b';
    if (iea <= 0) return '#7f1d1d';
    if (iea <= 20) return '#dc2626';
    if (iea <= 35) return '#f97316';
    if (iea <= 50) return '#facc15';
    if (iea <= 65) return '#a3e635';
    if (iea <= 80) return '#0891b2';
    return '#0e7490';
}
// Minimal topojson.feature() — avoids external dependency
function topoFeatures(topo, objectName) {
    const obj = topo.objects[objectName];
    if (!obj) return {
        type: 'FeatureCollection',
        features: []
    };
    const { scale = [
        1,
        1
    ], translate = [
        0,
        0
    ] } = topo.transform ?? {};
    function dequantizeRing(arcs, ring) {
        let x = 0;
        let y = 0;
        return ring.map((arcIdx)=>{
            const reversed = arcIdx < 0;
            const rawArc = arcs[reversed ? ~arcIdx : arcIdx];
            const pts = reversed ? [
                ...rawArc
            ].reverse() : rawArc;
            return pts.map((pt)=>{
                x += pt[0] ?? 0;
                y += pt[1] ?? 0;
                return [
                    x * scale[0] + translate[0],
                    y * scale[1] + translate[1]
                ];
            });
        }).flat();
    }
    function geomToGeoJSON(geom) {
        if (geom.type === 'Polygon') {
            const rings = geom.arcs.map((ring)=>dequantizeRing(topo.arcs, ring));
            return {
                type: 'Polygon',
                coordinates: rings
            };
        }
        if (geom.type === 'MultiPolygon') {
            const polys = geom.arcs.map((poly)=>poly.map((ring)=>dequantizeRing(topo.arcs, ring)));
            return {
                type: 'MultiPolygon',
                coordinates: polys
            };
        }
        if (geom.type === 'Point') {
            return {
                type: 'Point',
                coordinates: geom.coordinates
            };
        }
        return null;
    }
    return {
        type: 'FeatureCollection',
        features: obj.geometries.map((g)=>{
            const geometry = geomToGeoJSON(g);
            if (!geometry) return null;
            return {
                type: 'Feature',
                id: g.id,
                properties: g.properties ?? {},
                geometry
            };
        }).filter(Boolean)
    };
}
function LeafletMap({ scores, selected, rangeMin, rangeMax, onSelect, onHover, prevScores }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const geoLayerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scoreMap = {};
    scores.forEach((c)=>{
        scoreMap[c.iso3] = c.iea;
    });
    const nameMap = {};
    scores.forEach((c)=>{
        nameMap[c.iso3] = c.name;
    });
    // Init map once
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LeafletMap.useEffect": ()=>{
            if (!containerRef.current || mapRef.current) return;
            __turbopack_context__.A("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript, async loader)").then({
                "LeafletMap.useEffect": async (L)=>{
                    if (!containerRef.current || mapRef.current) return;
                    // Fix webpack icon paths
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    delete L.Icon.Default.prototype._getIconUrl;
                    L.Icon.Default.mergeOptions({
                        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
                    });
                    const map = L.map(containerRef.current, {
                        zoomControl: false,
                        attributionControl: true,
                        minZoom: 2,
                        maxZoom: 8,
                        scrollWheelZoom: true
                    });
                    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
                        subdomains: 'abcd',
                        attribution: '© <a href="https://carto.com">CARTO</a>',
                        maxZoom: 19
                    }).addTo(map);
                    map.fitBounds([
                        [
                            -58,
                            -120
                        ],
                        [
                            74,
                            -30
                        ]
                    ]);
                    map.setMaxBounds([
                        [
                            -85,
                            -220
                        ],
                        [
                            85,
                            220
                        ]
                    ]);
                    mapRef.current = map;
                    window.__aletheiaMap = map;
                    // Load and render GeoJSON choropleth
                    try {
                        const res = await fetch('/countries-110m.json');
                        const topo = await res.json();
                        const geo = topoFeatures(topo, 'countries');
                        const layer = L.geoJSON(geo, {
                            style: {
                                "LeafletMap.useEffect.layer": (feature)=>{
                                    const numId = Number(feature?.id ?? 0);
                                    const iso3 = NUMERIC_TO_ISO3[numId];
                                    const iea = iso3 ? scoreMap[iso3] ?? null : null;
                                    const inRange = iea === null || iea >= rangeMin && iea <= rangeMax;
                                    const isSelected = iso3 === selected;
                                    return {
                                        fillColor: ieaFill(iea),
                                        fillOpacity: isSelected ? 0.95 : inRange ? 0.78 : 0.20,
                                        color: isSelected ? 'rgba(6,182,212,0.9)' : 'rgba(241,245,249,0.15)',
                                        weight: isSelected ? 2 : 0.5
                                    };
                                }
                            }["LeafletMap.useEffect.layer"],
                            onEachFeature: {
                                "LeafletMap.useEffect.layer": (feature, layerFeat)=>{
                                    const numId = Number(feature.id ?? 0);
                                    const iso3 = NUMERIC_TO_ISO3[numId];
                                    if (!iso3) return;
                                    layerFeat.on('mouseover', {
                                        "LeafletMap.useEffect.layer": (e)=>{
                                            const iea = scoreMap[iso3] ?? null;
                                            const prev = prevScores?.[iso3] ?? null;
                                            onHover({
                                                iso3,
                                                name: nameMap[iso3] ?? iso3,
                                                iea,
                                                year: 2024,
                                                delta: iea !== null && prev !== null ? iea - prev : null,
                                                x: e.originalEvent.clientX,
                                                y: e.originalEvent.clientY
                                            });
                                            if (iso3 !== selected) {
                                                ;
                                                layerFeat.setStyle({
                                                    fillOpacity: 0.92,
                                                    color: 'rgba(6,182,212,0.9)',
                                                    weight: 1.5
                                                });
                                            }
                                        }
                                    }["LeafletMap.useEffect.layer"]);
                                    layerFeat.on('mousemove', {
                                        "LeafletMap.useEffect.layer": (e)=>{
                                            const iea = scoreMap[iso3] ?? null;
                                            const prev = prevScores?.[iso3] ?? null;
                                            onHover({
                                                iso3,
                                                name: nameMap[iso3] ?? iso3,
                                                iea,
                                                year: 2024,
                                                delta: iea !== null && prev !== null ? iea - prev : null,
                                                x: e.originalEvent.clientX,
                                                y: e.originalEvent.clientY
                                            });
                                        }
                                    }["LeafletMap.useEffect.layer"]);
                                    layerFeat.on('mouseout', {
                                        "LeafletMap.useEffect.layer": ()=>{
                                            onHover(null);
                                            if (iso3 !== selected) {
                                                const iea = scoreMap[iso3] ?? null;
                                                const inRange = iea === null || iea >= rangeMin && iea <= rangeMax;
                                                layerFeat.setStyle({
                                                    fillOpacity: inRange ? 0.78 : 0.20,
                                                    color: 'rgba(241,245,249,0.15)',
                                                    weight: 0.5
                                                });
                                            }
                                        }
                                    }["LeafletMap.useEffect.layer"]);
                                    layerFeat.on('click', {
                                        "LeafletMap.useEffect.layer": ()=>{
                                            if (scoreMap[iso3] !== undefined) onSelect(iso3);
                                        }
                                    }["LeafletMap.useEffect.layer"]);
                                }
                            }["LeafletMap.useEffect.layer"]
                        }).addTo(map);
                        geoLayerRef.current = layer;
                    } catch (err) {
                        console.error('Failed to load GeoJSON', err);
                    }
                }
            }["LeafletMap.useEffect"]);
            return ({
                "LeafletMap.useEffect": ()=>{
                    mapRef.current?.remove();
                    mapRef.current = null;
                    geoLayerRef.current = null;
                }
            })["LeafletMap.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["LeafletMap.useEffect"], []);
    // Update fill styles when scores / selection / range change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LeafletMap.useEffect": ()=>{
            const layer = geoLayerRef.current;
            if (!layer) return;
            layer.eachLayer({
                "LeafletMap.useEffect": (l)=>{
                    const lf = l;
                    if (!lf.feature) return;
                    const numId = Number(lf.feature.id ?? 0);
                    const iso3 = NUMERIC_TO_ISO3[numId];
                    const iea = iso3 ? scoreMap[iso3] ?? null : null;
                    const inRange = iea === null || iea >= rangeMin && iea <= rangeMax;
                    const isSelected = iso3 === selected;
                    lf.setStyle({
                        fillColor: ieaFill(iea),
                        fillOpacity: isSelected ? 0.95 : inRange ? 0.78 : 0.20,
                        color: isSelected ? 'rgba(6,182,212,0.9)' : 'rgba(241,245,249,0.15)',
                        weight: isSelected ? 2 : 0.5
                    });
                }
            }["LeafletMap.useEffect"]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["LeafletMap.useEffect"], [
        scores,
        selected,
        rangeMin,
        rangeMax
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        style: {
            width: '100%',
            height: '100%',
            background: '#060d1c'
        }
    }, void 0, false, {
        fileName: "[project]/components/atlas/LeafletMap.tsx",
        lineNumber: 279,
        columnNumber: 5
    }, this);
}
_s(LeafletMap, "sdfZwy7zQeyCOYqxbpEDlCaCI78=");
_c3 = LeafletMap;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "NUMERIC_TO_ISO3$Object.fromEntries$Object.entries(ISO3_TO_NUMERIC).map");
__turbopack_context__.k.register(_c1, "NUMERIC_TO_ISO3$Object.fromEntries");
__turbopack_context__.k.register(_c2, "NUMERIC_TO_ISO3");
__turbopack_context__.k.register(_c3, "LeafletMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/atlas/LeafletMap.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/atlas/LeafletMap.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_atlas_LeafletMap_tsx_0ea79y4._.js.map