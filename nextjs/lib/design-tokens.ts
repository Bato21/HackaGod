export const TOKENS = {
  surface: {
    base:    '#070d1a',
    elevated:'#0d1729',
    raised:  '#152138',
    overlay: 'rgba(13,23,41,0.85)',
    glass:   'rgba(21,33,56,0.6)',
    white:   '#ffffff',
  },
  gradient: {
    primary:        'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)',
    primaryReverse: 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)',
    accent:         'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  },
  brand: {
    cyan:   '#06b6d4',
    blue:   '#3b82f6',
    indigo: '#6366f1',
    violet: '#8b5cf6',
  },
  text: {
    primary:  '#f1f5f9',
    secondary:'#cbd5e1',
    dim:      '#94a3b8',
    faint:    '#64748b',
    onLight:  '#0f172a',
  },
  border: {
    subtle:  'rgba(148,163,184,0.1)',
    default: 'rgba(148,163,184,0.2)',
    strong:  'rgba(148,163,184,0.4)',
    glow:    'rgba(59,130,246,0.5)',
  },
  severity: {
    clean:   '#06b6d4',
    low:     '#3b82f6',
    medium:  '#a855f7',
    high:    '#f59e0b',
    critical:'#ef4444',
    noData:  '#1e293b',
  },
  motion: {
    fast:   150,
    base:   300,
    slow:   600,
    cinema: 900,
    easing: {
      inOut:  [0.4, 0, 0.2, 1] as const,
      out:    [0, 0, 0.2, 1]   as const,
      spring: { type: 'spring', stiffness: 100, damping: 20 } as const,
    },
  },
} as const

export function severityColor(iea: number | null): string {
  if (iea === null || iea === undefined) return TOKENS.severity.noData
  if (iea >= 80) return TOKENS.severity.clean
  if (iea >= 60) return TOKENS.severity.low
  if (iea >= 40) return TOKENS.severity.medium
  if (iea >= 20) return TOKENS.severity.high
  return TOKENS.severity.critical
}

export function severityLabel(iea: number | null): string {
  if (iea === null || iea === undefined) return 'Sin datos'
  if (iea >= 80) return 'Transparente'
  if (iea >= 60) return 'Bajo riesgo'
  if (iea >= 40) return 'Riesgo moderado'
  if (iea >= 20) return 'Alto riesgo'
  return 'Crítico'
}
