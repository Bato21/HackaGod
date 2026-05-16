import { createClient } from '@supabase/supabase-js'

const URL  = 'https://yiqxyfesywdswtcjaqeq.supabase.co'
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcXh5ZmVzeXdkc3d0Y2phcWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTE3NzYsImV4cCI6MjA5NDQ2Nzc3Nn0.26aatH3JqmPzGEsQbp7kSvNP8KVYiIrnazD38qLWq_c'

export const supabase = createClient(URL, ANON)

export type Country = {
  id: string
  iso_alpha2: string
  iso_alpha3: string
  name_es: string
  name_en: string
  region: string
  latitude: number
  longitude: number
  flag_emoji: string
  active: boolean
}

export type IeaScore = {
  id: string
  country_id: string
  period: string
  iea_score: number
  pillar_scores: Record<string, number>
  bic_score: number | null
  bic_low: number | null
  bic_high: number | null
  bic_volatility: 'low' | 'medium' | 'high' | null
}

export type RiskSignal = {
  id: string
  country_id: string
  pattern_type: string
  description: string
  severity: number
  active: boolean
  detected_at: string
}

export type ForumThread = {
  id: string
  country_id: string | null
  title: string
  body: string | null
  alert_level: 'watch' | 'alert' | 'urgent'
  reply_count: number
  pinned: boolean
  created_at: string
}

export type ForumReply = {
  id: string
  thread_id: string
  body: string
  created_by: string
  upvotes: number
  is_analyst: boolean
  created_at: string
}
