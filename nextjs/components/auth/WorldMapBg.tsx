'use client'
import { useEffect, useRef } from 'react'

const ARCS = [
  { startLat: -33.45, startLng: -70.65, endLat: 40.42,  endLng: -3.70  },
  { startLat: -15.78, startLng: -47.93, endLat: 48.86,  endLng:  2.35  },
  { startLat:   4.71, startLng: -74.07, endLat: 51.51,  endLng: -0.13  },
  { startLat: -12.05, startLng: -77.04, endLat: 52.52,  endLng: 13.41  },
  { startLat:  19.43, startLng: -99.13, endLat: 40.71,  endLng:-74.01  },
  { startLat: -34.60, startLng: -58.38, endLat:  1.29,  endLng: 36.82  },
  { startLat:  -0.23, startLng: -78.52, endLat: 35.69,  endLng:139.69  },
  { startLat:  10.48, startLng: -66.90, endLat: 59.91,  endLng: 10.75  },
]

function project(lng: number, lat: number, W: number, H: number): [number, number] {
  const x = ((lng + 180) / 360) * W
  const sinLat = Math.sin((lat * Math.PI) / 180)
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * H
  return [x, y]
}

function bezier(t: number, x1: number, y1: number, cx: number, cy: number, x2: number, y2: number): [number, number] {
  const u = 1 - t
  return [u*u*x1 + 2*u*t*cx + t*t*x2, u*u*y1 + 2*u*t*cy + t*t*y2]
}

export default function WorldMapBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useRef<{ mounted: boolean; arcs: Array<{ progress: number } & typeof ARCS[0]>; raf: number | null; topo: unknown }>({
    mounted: true, arcs: [], raf: null, topo: null,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    state.current.mounted = true

    function setSize() {
      if (!canvas) return
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    setSize()
    window.addEventListener('resize', setSize)

    state.current.arcs = ARCS.map(d => ({ ...d, progress: 0 }))

    function drawTopo(ctx: CanvasRenderingContext2D, topo: unknown, W: number, H: number) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const topojson = (window as unknown as { topojson?: { feature: (t: unknown, o: unknown) => { features: unknown[] } } }).topojson
      if (!topojson) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const features = topojson.feature(topo, (topo as any).objects.countries).features as any[]
      features.forEach((f: any) => {
        if (!f.geometry) return
        const polys: number[][][][] =
          f.geometry.type === 'Polygon' ? [f.geometry.coordinates]
          : f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : []
        polys.forEach(poly => {
          poly.forEach(ring => {
            const fixed: number[][] = [ring[0].slice()]
            for (let i = 1; i < ring.length; i++) {
              let lng = ring[i][0]
              const diff = lng - fixed[fixed.length - 1][0]
              if (diff > 180) lng -= 360
              else if (diff < -180) lng += 360
              fixed.push([lng, ring[i][1]])
            }
            const lngs = fixed.map(p => p[0])
            if (Math.max(...lngs) - Math.min(...lngs) > 270) return
            ctx.beginPath()
            fixed.forEach(([lng, lat], i) => {
              const [x, y] = project(lng, lat, W, H)
              i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
            })
            ctx.closePath()
            ctx.fillStyle   = 'rgba(14,165,233,0.03)'
            ctx.strokeStyle = 'rgba(56,189,248,0.13)'
            ctx.lineWidth   = 0.4
            ctx.fill()
            ctx.stroke()
          })
        })
      })
    }

    function draw() {
      if (!state.current.mounted || !canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      if (state.current.topo) drawTopo(ctx, state.current.topo, W, H)

      const now = Date.now()
      state.current.arcs.forEach(arc => {
        const [x1, y1] = project(arc.startLng, arc.startLat, W, H)
        const [x2, y2] = project(arc.endLng,   arc.endLat,   W, H)
        const dist = Math.hypot(x2 - x1, y2 - y1)
        const cx = (x1 + x2) / 2
        const cy = Math.min(y1, y2) - dist * 0.38
        const t = arc.progress
        const N = 64

        ctx.beginPath()
        for (let i = 0; i <= N; i++) {
          const [bx, by] = bezier(i / N, x1, y1, cx, cy, x2, y2)
          i === 0 ? ctx.moveTo(bx, by) : ctx.lineTo(bx, by)
        }
        ctx.strokeStyle = 'rgba(56,189,248,0.08)'
        ctx.lineWidth   = 0.8
        ctx.setLineDash([3, 6])
        ctx.stroke()
        ctx.setLineDash([])

        if (t > 0) {
          const steps = Math.max(2, Math.floor(N * t))
          ctx.beginPath()
          for (let i = 0; i <= steps; i++) {
            const [bx, by] = bezier(i / N, x1, y1, cx, cy, x2, y2)
            i === 0 ? ctx.moveTo(bx, by) : ctx.lineTo(bx, by)
          }
          ctx.strokeStyle = 'rgba(14,165,233,0.65)'
          ctx.lineWidth   = 1.6
          ctx.stroke()

          const [hx, hy] = bezier(t, x1, y1, cx, cy, x2, y2)
          const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 12)
          g.addColorStop(0, 'rgba(56,189,248,0.55)')
          g.addColorStop(1, 'rgba(56,189,248,0)')
          ctx.beginPath()
          ctx.arc(hx, hy, 12, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()

          ctx.beginPath()
          ctx.arc(hx, hy, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(186,230,253,0.95)'
          ctx.fill()
        }

        ;[[x1, y1], [x2, y2]].forEach(([px, py]) => {
          const pulse = 0.35 + 0.3 * Math.sin(now / 650 + px * 0.015)
          ctx.beginPath()
          ctx.arc(px, py, 5, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(56,189,248,${pulse.toFixed(2)})`
          ctx.lineWidth   = 1
          ctx.stroke()
          ctx.beginPath()
          ctx.arc(px, py, 2.2, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(56,189,248,0.9)'
          ctx.fill()
        })
      })

      state.current.raf = requestAnimationFrame(draw)
    }

    fetch('/countries-110m.json')
      .then(r => r.json())
      .then(topo => { if (state.current.mounted) state.current.topo = topo })
      .catch(() => {})

    // Animate arcs with simple JS since GSAP not available in Next.js
    state.current.arcs.forEach((arc, i) => {
      const duration = 3000
      const delay    = i * 720
      const repeatDelay = 600
      let start: number | null = null

      function animate(ts: number) {
        if (!state.current.mounted) return
        if (start === null) start = ts
        const elapsed = ts - start
        const cycle   = duration + repeatDelay
        const t = (elapsed % cycle) / duration
        arc.progress = Math.min(1, t <= 1 ? easeInOut(t) : 0)
        requestAnimationFrame(animate)
      }

      setTimeout(() => requestAnimationFrame(animate), delay)
    })

    function easeInOut(t: number) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }

    draw()

    return () => {
      state.current.mounted = false
      window.removeEventListener('resize', setSize)
      if (state.current.raf) cancelAnimationFrame(state.current.raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-75"
    />
  )
}
