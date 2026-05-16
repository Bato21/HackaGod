'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const SECTIONS = [
  { id: 'que-es',       label: '¿Qué es Aletheia?'               },
  { id: 'iea',          label: 'El Índice Estructural (IEA)'      },
  { id: 'bic',          label: 'La Banda de Incertidumbre Cívica' },
  { id: 'pilares',      label: 'Los 5 Pilares'                    },
  { id: 'tipologias',   label: 'Tipologías de Corrupción'         },
  { id: 'fuentes',      label: 'Fuentes de Datos'                 },
  { id: 'agentes',      label: 'Agentes de IA'                    },
  { id: 'limitaciones', label: 'Limitaciones'                     },
  { id: 'participar',   label: 'Cómo Participar'                  },
]

const PILLAR_DATA = [
  { id: 'fiscal',        name: 'Disciplina Fiscal',         weight: '25%', desc: 'Mide la transparencia, consistencia y trazabilidad del gasto público. Incluye indicadores de adjudicación directa, deuda no auditada y transferencias sin rendición.' },
  { id: 'social',        name: 'Inversión Social',          weight: '20%', desc: 'Evalúa la coherencia entre el gasto social declarado y los indicadores objetivos de bienestar. Detecta discrepancias estadísticas y desvíos.' },
  { id: 'transparency',  name: 'Transparencia Institucional', weight: '30%', desc: 'Analiza el acceso a información pública, la existencia de auditorías independientes y la calidad de los reportes gubernamentales.' },
  { id: 'stability',     name: 'Estabilidad Sectorial',     weight: '15%', desc: 'Mide la rotación no programada de funcionarios clave, renuncia de cargos reguladores y patrones de discontinuidad institucional.' },
  { id: 'judicial',      name: 'Independencia Judicial',    weight: '10%', desc: 'Índice compuesto de imparcialidad del sistema judicial en casos de corrupción pública, basado en tipologías documentadas.' },
]

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} style={{
      fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900,
      color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.2,
      margin: '40px 0 16px', scrollMarginTop: 80,
    }}>
      {children}
    </h2>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text-2)',
      lineHeight: 1.72, margin: '0 0 16px',
    }}>
      {children}
    </p>
  )
}

function Disclaimer() {
  return (
    <div style={{
      background: 'rgba(250,204,21,0.06)',
      border: '1px solid rgba(250,204,21,0.2)',
      borderRadius: 10, padding: '14px 18px', marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ color: '#facc15', fontSize: 16, flexShrink: 0, marginTop: 2 }}>⚠</span>
        <div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#facc15', display: 'block', marginBottom: 4 }}>
            DATOS ILUSTRATIVOS
          </span>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.55, margin: 0 }}>
            Todos los índices, puntuaciones, titulares y cifras en esta plataforma son <strong style={{ color: 'var(--text-2)' }}>ejemplos generados con plantillas determinísticas</strong> para demostrar el formato y la interoperabilidad del sistema. No corresponden a hechos reales. La metodología descrita a continuación refleja cómo funcionaría el sistema con datos reales.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function MetodologiaPage() {
  const [activeSection, setActiveSection] = useState('que-es')

  useEffect(() => {
    function handler() {
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top < 120) {
          setActiveSection(s.id)
          break
        }
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', height: '100%', overflow: 'hidden', background: 'var(--bg)' }}
    >
      {/* TOC Sidebar */}
      <div style={{
        width: 220, flexShrink: 0,
        background: 'var(--bg-2)', borderRight: '1px solid var(--line-2)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        padding: '24px 0',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'var(--text-4)', padding: '0 16px 12px',
        }}>
          Contenido
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {SECTIONS.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={e => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{
                display: 'block', padding: '7px 16px',
                fontFamily: 'var(--sans)', fontSize: 12.5,
                color: activeSection === s.id ? 'var(--accent)' : 'var(--text-3)',
                textDecoration: 'none',
                borderLeft: `2px solid ${activeSection === s.id ? 'var(--accent)' : 'transparent'}`,
                background: activeSection === s.id ? 'rgba(56,189,248,0.04)' : 'transparent',
                transition: 'all .15s',
              }}
              onMouseEnter={e => { if (activeSection !== s.id) (e.currentTarget as HTMLElement).style.color = 'var(--text-2)' }}
              onMouseLeave={e => { if (activeSection !== s.id) (e.currentTarget as HTMLElement).style.color = 'var(--text-3)' }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 60px 80px' }}>
        <div style={{ maxWidth: 720 }}>

          {/* Page header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>
              METODOLOGÍA · ALETHEIA
            </div>
            <h1 style={{
              fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 900,
              color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1,
              margin: '0 0 16px',
            }}>
              Cómo funciona<br />
              <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>el índice</em>
            </h1>
            <P>Aletheia es una plataforma de análisis de integridad institucional para América Latina y el Caribe. Esta página documenta el sistema de índices, los agentes de inteligencia artificial involucrados, y las limitaciones importantes que deben considerarse al interpretar los resultados.</P>
            <Disclaimer />
          </div>

          <H2 id="que-es">¿Qué es Aletheia?</H2>
          <P>Aletheia es un sistema de monitoreo de corrupción estructural diseñado para 29 países de América Latina y el Caribe, con datos ilustrativos que cubren el período 2015–2024. Combina análisis estadístico, fuentes de datos públicas y agentes de inteligencia artificial para construir un índice compuesto de integridad institucional.</P>
          <P>La plataforma está concebida como un punto de partida para la investigación periodística, académica y ciudadana. El foro integrado permite que la comunidad de usuarios aporte contexto, señale anomalías y construya narrativas colectivas alrededor de los datos.</P>
          <P>El nombre proviene del concepto griego de verdad no-velada: aquello que se desvela o descubre. Una metáfora apropiada para la transparencia que la plataforma intenta facilitar.</P>

          <H2 id="iea">El Índice Estructural (IEA)</H2>
          <P>El Índice Estructural de Anomalías (IEA) es la medida principal de Aletheia. Varía entre 0 y 100, donde valores más bajos indican menor corrupción estimada y valores más altos indican mayor corrupción estructural. Esta escala invertida —respecto a otros índices de integridad que puntúan "más alto = más limpio"— fue adoptada para facilitar la lectura visual en el mapa coroplético.</P>
          <P>El IEA es un índice compuesto calculado a partir de cinco pilares, cada uno con una ponderación diferente. Los valores son re-normalizados anualmente para mantener la comparabilidad inter-temporal, usando como ancla los países con datos más estables.</P>

          <div style={{
            background: 'var(--bg-2)', border: '1px solid var(--line-2)',
            borderRadius: 10, padding: '16px 20px', marginBottom: 20,
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
              FÓRMULA SIMPLIFICADA
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)', letterSpacing: '0.02em' }}>
              IEA = Σ (pilar<sub style={{ fontSize: 9 }}>i</sub> × peso<sub style={{ fontSize: 9 }}>i</sub>) + BIC<sub style={{ fontSize: 9 }}>adj</sub>
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text-3)', marginTop: 8, lineHeight: 1.5 }}>
              Donde BIC<sub>adj</sub> es el ajuste por la Banda de Incertidumbre Cívica, que amplía o contrae el valor central según la volatilidad histórica del país.
            </div>
          </div>

          <H2 id="bic">La Banda de Incertidumbre Cívica (BIC)</H2>
          <P>La BIC es un intervalo de confianza metodológico que rodea al valor puntual del IEA. Refleja el grado de incertidumbre en la estimación, causado por datos faltantes, inconsistencias en fuentes o alta volatilidad histórica de un país.</P>
          <P>Un país con BIC estrecha tiene datos más consistentes y el valor central es más confiable. Un país con BIC amplia (por ejemplo, Venezuela con BIC 80–94) indica que la puntuación real podría variar significativamente.</P>
          <P>La BIC se calcula mediante bootstrap estadístico sobre las series de datos de cada pilar, con 1.000 iteraciones por país por año. El intervalo reportado es el percentil 10–90.</P>

          <H2 id="pilares">Los 5 Pilares</H2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {PILLAR_DATA.map(p => (
              <div key={p.id} style={{
                background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                borderRadius: 10, padding: '14px 18px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{p.name}</span>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 9.5, fontWeight: 700,
                    color: 'var(--accent)', background: 'rgba(6,182,212,0.1)',
                    border: '1px solid rgba(6,182,212,0.2)', padding: '2px 8px', borderRadius: 4,
                  }}>{p.weight}</span>
                </div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.55, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>

          <H2 id="tipologias">Tipologías de Corrupción</H2>
          <P>Aletheia clasifica los patrones de riesgo detectados en siete tipologías principales, inspiradas en la taxonomía del International Anti-Corruption Resource Center (IACRC):</P>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { name: 'Contratación directa',    icon: '📋' },
              { name: 'Transferencias irregulares', icon: '💸' },
              { name: 'Captura estatal',          icon: '🏛' },
              { name: 'Opacidad financiera',      icon: '🔒' },
              { name: 'Colapso institucional',    icon: '🏚' },
              { name: 'Empresa pública',          icon: '🏭' },
              { name: 'Desvío gasto social',      icon: '📉' },
            ].map(t => (
              <div key={t.name} style={{
                background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                borderRadius: 8, padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text-2)' }}>{t.name}</span>
              </div>
            ))}
          </div>

          <H2 id="fuentes">Fuentes de Datos</H2>
          <P>En un despliegue con datos reales, Aletheia integraría las siguientes fuentes públicas primarias:</P>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
            {[
              'Contraloría General / Tribunal de Cuentas (por país)',
              'Portales de transparencia gubernamental',
              'Base de datos de licitaciones públicas (OCDS)',
              'Reportes del FMI: Artículo IV y FSAP',
              'Índice de Percepción de Corrupción (Transparency International)',
              'Bases de la CEPAL sobre gasto social',
              'Resoluciones judiciales de casos de corrupción (scraped)',
              'Artículos de prensa de medios especializados (RSS)',
            ].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text-3)' }}>
                <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span> {s}
              </div>
            ))}
          </div>

          <H2 id="agentes">Agentes de IA</H2>
          <P>Aletheia utiliza dos sistemas de IA en su pipeline de generación de datos ilustrativos:</P>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              {
                name: 'Mistral 7B',
                role: 'Generación de señales',
                desc: 'Genera descripciones de señales de riesgo y titulares de noticias ilustrativas a partir de plantillas determinísticas. Opera con temperatura baja para maximizar consistencia.',
              },
              {
                name: 'Claude (Anthropic)',
                role: 'Análisis y síntesis',
                desc: 'Proporciona análisis de contexto para países, revisión de coherencia en scores y generación del texto de la sección "Insight Engine" visible en el foro.',
              },
            ].map(a => (
              <div key={a.name} style={{
                background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                borderRadius: 10, padding: '14px 18px',
              }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--accent)', fontWeight: 700, marginBottom: 4 }}>{a.name}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>{a.role}</div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-3)', lineHeight: 1.55, margin: 0 }}>{a.desc}</p>
              </div>
            ))}
          </div>

          <H2 id="limitaciones">Limitaciones y Datos Ilustrativos</H2>
          <Disclaimer />
          <P>Además del carácter ilustrativo de los datos, existen limitaciones metodológicas estructurales que aplicarían incluso con datos reales:</P>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {[
              'Los índices de percepción de corrupción miden percepciones, no hechos verificados. Pueden estar influenciados por ciclos mediáticos.',
              'La comparación inter-país asume equivalencia institucional que no siempre existe (sistemas presidencialistas vs. parlamentarios, federales vs. unitarios).',
              'Los datos de contratación pública tienen distintos niveles de desagregación según el país, lo que afecta la comparabilidad del pilar fiscal.',
              'La volatilidad de la BIC en países con alta inestabilidad política hace que el intervalo de confianza sea tan amplio que el valor central pierde significado estadístico.',
              'El período 2015–2024 excluye reformas anteriores que pueden ser relevantes para entender la trayectoria de largo plazo.',
            ].map((lim, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.55,
              }}>
                <span style={{ color: 'var(--text-4)', fontFamily: 'var(--mono)', fontSize: 10, marginTop: 2, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}.
                </span>
                {lim}
              </div>
            ))}
          </div>

          <H2 id="participar">Cómo Participar</H2>
          <P>Aletheia es una plataforma de investigación colaborativa. Hay tres formas de contribuir:</P>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {[
              { icon: '💬', title: 'Foro',           desc: 'Participa en conversaciones sobre países, gobiernos y casos concretos. Tus aportes de contexto enriquecen el análisis colectivo.' },
              { icon: '🔔', title: 'Suscripciones',  desc: 'Suscríbete a países o tipologías para recibir notificaciones cuando el índice cambia o aparecen nuevas señales de riesgo.' },
              { icon: '📢', title: 'Movimientos',    desc: 'Responde a señales de urgencia con firmas y declaraciones. Los movimientos generan presión documental ciudadana.' },
            ].map(item => (
              <div key={item.title} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                borderRadius: 10, padding: '14px 18px',
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{item.title}</div>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'var(--bg-2)', border: '1px solid var(--line-2)',
            borderRadius: 10, padding: '16px 20px',
            fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text-4)', lineHeight: 1.55,
          }}>
            Versión metodológica: 0.4-beta · Período de datos: 2015–2024 · Países cubiertos: 29 · Región: América Latina y el Caribe · Generado con plantillas determinísticas — no corresponde a hechos reales.
          </div>
        </div>
      </div>
    </motion.div>
  )
}
