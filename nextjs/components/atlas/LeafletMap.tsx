'use client'
// NOTE: requires `npm install topojson-client @types/topojson-client`
import { useEffect, useRef } from 'react'
import type { Map as LMap, GeoJSON as LGeoJSONLayer } from 'leaflet'
import type { TooltipInfo } from './CountryTooltip'

// ISO3 alpha → ISO numeric (Natural Earth 110m codes) for LATAM
const ISO3_TO_NUMERIC: Record<string, number> = {
  MEX: 484, GTM: 320, BLZ:  84, HND: 340, SLV: 222, NIC: 558,
  CRI: 188, PAN: 591, CUB: 192, JAM: 388, HTI: 332, DOM: 214,
  TTO: 780, BRB:  52, LCA: 662, VCT: 670, GRD: 308, ATG:  28,
  COL: 170, VEN: 862, GUY: 328, SUR: 740,
  ECU: 218, PER: 604, BRA:  76, BOL:  68, PRY: 600,
  CHL: 152, ARG:  32, URY: 858,
  USA: 840, CAN: 124, GBR: 826, ESP: 724, FRA: 250,
  DEU: 276, ITA: 380, PRT: 620,
}
const NUMERIC_TO_ISO3: Record<number, string> = Object.fromEntries(
  Object.entries(ISO3_TO_NUMERIC).map(([k, v]) => [v, k])
)

export type CountryScore = {
  iso3:  string
  name:  string
  lat:   number
  lng:   number
  iea:   number | null
}

type Props = {
  scores:     CountryScore[]
  selected:   string | null
  rangeMin:   number
  rangeMax:   number
  onSelect:   (iso3: string) => void
  onHover:    (info: TooltipInfo | null) => void
  prevScores?: Record<string, number>
}

// Divergent palette per spec
function ieaFill(iea: number | null): string {
  if (iea === null) return '#1e293b'
  if (iea <= 0)    return '#7f1d1d'
  if (iea <= 20)   return '#dc2626'
  if (iea <= 35)   return '#f97316'
  if (iea <= 50)   return '#facc15'
  if (iea <= 65)   return '#a3e635'
  if (iea <= 80)   return '#0891b2'
  return '#0e7490'
}

type TopoArc = number[]
interface Topology {
  type: 'Topology'
  arcs: TopoArc[][]
  transform?: { scale: [number, number]; translate: [number, number] }
  objects: Record<string, TopoGeomCollection>
}
interface TopoGeomCollection {
  type: 'GeometryCollection'
  geometries: TopoGeometry[]
}
interface TopoGeometry {
  type: string
  id?: number | string
  properties?: Record<string, unknown>
  arcs?: unknown
  coordinates?: unknown
}

// Minimal topojson.feature() — avoids external dependency
function topoFeatures(topo: Topology, objectName: string): GeoJSON.FeatureCollection {
  const obj = topo.objects[objectName]
  if (!obj) return { type: 'FeatureCollection', features: [] }

  const { scale = [1, 1], translate = [0, 0] } = topo.transform ?? {}

  function dequantizeRing(arcs: TopoArc[][], ring: number[]): [number, number][] {
    let x = 0; let y = 0
    return ring.map(arcIdx => {
      const reversed = arcIdx < 0
      const rawArc   = arcs[reversed ? ~arcIdx : arcIdx]
      const pts      = reversed ? [...rawArc].reverse() : rawArc
      return pts.map((pt: TopoArc) => {
        x += pt[0] ?? 0; y += pt[1] ?? 0
        return [x * scale[0] + translate[0], y * scale[1] + translate[1]] as [number, number]
      })
    }).flat()
  }

  function geomToGeoJSON(geom: TopoGeometry): GeoJSON.Geometry | null {
    if (geom.type === 'Polygon') {
      const rings = (geom.arcs as number[][]).map(ring => dequantizeRing(topo.arcs, ring))
      return { type: 'Polygon', coordinates: rings }
    }
    if (geom.type === 'MultiPolygon') {
      const polys = (geom.arcs as number[][][]).map(poly =>
        poly.map(ring => dequantizeRing(topo.arcs, ring))
      )
      return { type: 'MultiPolygon', coordinates: polys }
    }
    if (geom.type === 'Point') {
      return { type: 'Point', coordinates: geom.coordinates as [number, number] }
    }
    return null
  }

  return {
    type: 'FeatureCollection',
    features: obj.geometries
      .map(g => {
        const geometry = geomToGeoJSON(g)
        if (!geometry) return null
        return {
          type: 'Feature' as const,
          id: g.id,
          properties: g.properties ?? {},
          geometry,
        }
      })
      .filter(Boolean) as GeoJSON.Feature[],
  }
}

export default function LeafletMap({ scores, selected, rangeMin, rangeMax, onSelect, onHover, prevScores }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<LMap | null>(null)
  const geoLayerRef  = useRef<LGeoJSONLayer | null>(null)

  const scoreMap: Record<string, number | null> = {}
  scores.forEach(c => { scoreMap[c.iso3] = c.iea })

  const nameMap: Record<string, string> = {}
  scores.forEach(c => { nameMap[c.iso3] = c.name })

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import('leaflet').then(async L => {
      if (!containerRef.current || mapRef.current) return

      // Fix webpack icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current!, {
        zoomControl:        false,
        attributionControl: true,
        minZoom:            2,
        maxZoom:            8,
        scrollWheelZoom:    true,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains:  'abcd',
        attribution: '© <a href="https://carto.com">CARTO</a>',
        maxZoom:     19,
      }).addTo(map)

      map.fitBounds([[-58, -120], [74, -30]])
      map.setMaxBounds([[-85, -220], [85, 220]])
      mapRef.current = map
      ;(window as unknown as Record<string, unknown>).__aletheiaMap = map

      // Load and render GeoJSON choropleth
      try {
        const res   = await fetch('/countries-110m.json')
        const topo  = await res.json() as Topology
        const geo   = topoFeatures(topo, 'countries')

        const layer = L.geoJSON(geo, {
          style: feature => {
            const numId  = Number(feature?.id ?? 0)
            const iso3   = NUMERIC_TO_ISO3[numId]
            const iea    = iso3 ? (scoreMap[iso3] ?? null) : null
            const inRange = iea === null || (iea >= rangeMin && iea <= rangeMax)
            const isSelected = iso3 === selected
            return {
              fillColor:   ieaFill(iea),
              fillOpacity: isSelected ? 0.95 : (inRange ? 0.78 : 0.20),
              color:       isSelected ? 'rgba(6,182,212,0.9)' : 'rgba(241,245,249,0.15)',
              weight:      isSelected ? 2 : 0.5,
            }
          },
          onEachFeature: (feature, layerFeat) => {
            const numId = Number(feature.id ?? 0)
            const iso3  = NUMERIC_TO_ISO3[numId]
            if (!iso3) return

            layerFeat.on('mouseover', (e: L.LeafletMouseEvent) => {
              const iea  = scoreMap[iso3] ?? null
              const prev = prevScores?.[iso3] ?? null
              onHover({
                iso3, name: nameMap[iso3] ?? iso3,
                iea, year: 2024,
                delta: (iea !== null && prev !== null) ? iea - prev : null,
                x: e.originalEvent.clientX,
                y: e.originalEvent.clientY,
              })
              if (iso3 !== selected) {
                ;(layerFeat as unknown as L.Path).setStyle({ fillOpacity: 0.92, color: 'rgba(6,182,212,0.9)', weight: 1.5 })
              }
            })

            layerFeat.on('mousemove', (e: L.LeafletMouseEvent) => {
              const iea  = scoreMap[iso3] ?? null
              const prev = prevScores?.[iso3] ?? null
              onHover({
                iso3, name: nameMap[iso3] ?? iso3,
                iea, year: 2024,
                delta: (iea !== null && prev !== null) ? iea - prev : null,
                x: e.originalEvent.clientX,
                y: e.originalEvent.clientY,
              })
            })

            layerFeat.on('mouseout', () => {
              onHover(null)
              if (iso3 !== selected) {
                const iea     = scoreMap[iso3] ?? null
                const inRange = iea === null || (iea >= rangeMin && iea <= rangeMax)
                ;(layerFeat as unknown as L.Path).setStyle({
                  fillOpacity: inRange ? 0.78 : 0.20,
                  color:       'rgba(241,245,249,0.15)',
                  weight:      0.5,
                })
              }
            })

            layerFeat.on('click', () => {
              if (scoreMap[iso3] !== undefined) onSelect(iso3)
            })
          },
        }).addTo(map)

        geoLayerRef.current = layer
      } catch (err) {
        console.error('Failed to load GeoJSON', err)
      }
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current    = null
      geoLayerRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update fill styles when scores / selection / range change
  useEffect(() => {
    const layer = geoLayerRef.current
    if (!layer) return
    layer.eachLayer((l: unknown) => {
      const lf = l as L.GeoJSON & { feature?: GeoJSON.Feature }
      if (!lf.feature) return
      const numId     = Number(lf.feature.id ?? 0)
      const iso3      = NUMERIC_TO_ISO3[numId]
      const iea       = iso3 ? (scoreMap[iso3] ?? null) : null
      const inRange   = iea === null || (iea >= rangeMin && iea <= rangeMax)
      const isSelected = iso3 === selected
      ;(lf as unknown as L.Path).setStyle({
        fillColor:   ieaFill(iea),
        fillOpacity: isSelected ? 0.95 : (inRange ? 0.78 : 0.20),
        color:       isSelected ? 'rgba(6,182,212,0.9)' : 'rgba(241,245,249,0.15)',
        weight:      isSelected ? 2 : 0.5,
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scores, selected, rangeMin, rangeMax])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', background: '#060d1c' }} />
  )
}
