import TopNav from '@/components/nav/TopNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>
      <TopNav />
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {children}
      </div>
    </div>
  )
}
