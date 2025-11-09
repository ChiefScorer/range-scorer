import { useState } from 'react'
import ScorePad from './components/ScorePad'
import RecentStrings from './components/RecentStrings'
import Leaderboard from './components/Leaderboard'
import ExportButton from './components/ExportButton'
import UpdateBanner from './UpdateBanner'
import EventSelector from './components/EventSelector'
import CompetitorSelector from './components/CompetitorSelector'
import CompetitorEntry from './components/CompetitorEntry'
import type { EventName } from './constants/events'
import type { TCompetitor } from './db'

export default function App() {
  const [tab, setTab] = useState<'score' | 'board'>('score')
  const [eventName, setEventName] = useState<EventName>('Practical')

  const [compId, setCompId] = useState<string | undefined>(undefined)
  const [comp, setComp] = useState<TCompetitor | undefined>(undefined)
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <header
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          padding: 12,
          borderBottom: '1px solid #e6e9ee',
          flexWrap: 'wrap'
        }}
      >
        <h1 style={{ fontSize: 18, margin: 0 }}>🏆 Range Scorer</h1>

        {/* Event selector */}
        <EventSelector value={eventName} onChange={setEventName} />

        {/* Competitor selector */}
        <CompetitorSelector
          value={compId}
          onChange={(id, c) => { setCompId(id); setComp(c) }}
        />

        <button onClick={() => setShowAdd(s => !s)} style={chipBtn}>
          {showAdd ? 'Close' : 'Add Competitor'}
        </button>

        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => setTab('score')} style={tabBtn(tab === 'score')}>Score</button>
          <button onClick={() => setTab('board')} style={tabBtn(tab === 'board')}>Leaderboard</button>
          <ExportButton />
        </nav>
      </header>

      {/* Optional inline add form */}
      {showAdd && (
        <div style={{ maxWidth: 760, margin: '12px auto 0', padding: '0 12px' }}>
          <CompetitorEntry onCreated={(c) => { setCompId(c.id); setComp(c) }} />
        </div>
      )}

      {tab === 'score' ? (
        <>
          {comp ? (
            <ScorePad
              compId={comp.id}
              compName={`#${comp.compNo} ${comp.name}`}
              stage={eventName}
            />
          ) : (
            <div style={{ maxWidth: 460, margin: '24px auto', padding: 16 }}>
              <h3>No competitor selected</h3>
              <p>Add a competitor, or choose one from the selector above.</p>
            </div>
          )}
          <RecentStrings />
        </>
      ) : (
        <Leaderboard />
      )}

      <UpdateBanner />
    </div>
  )
}

const tabBtn = (active: boolean): React.CSSProperties => ({
  padding: '8px 12px',
  border: '1px solid #cfd6de',
  borderRadius: 8,
  background: active ? '#eef3ff' : '#fff',
  cursor: 'pointer'
})

const chipBtn: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 999,
  border: '1px solid #cfd6de',
  background: '#fff',
  cursor: 'pointer'
}