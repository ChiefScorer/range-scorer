import { useState } from 'react'
import ScorePad from './components/ScorePad'
import RecentStrings from './components/RecentStrings'
import Results from './components/Results'
import ExportButton from './components/ExportButton'
import UpdateBanner from './UpdateBanner'
import EventSelector from './components/EventSelector'
import CompetitorSelector from './components/CompetitorSelector'
import CompetitorEntry from './components/CompetitorEntry'
import type { EventName } from './constants/meta'
import type { TEntry } from './db'

export default function App() {
  const [tab, setTab] = useState<'score' | 'board'>('score')
  const [eventName, setEventName] = useState<EventName>('Plates')

  const [entryId, setEntryId] = useState<string | undefined>(undefined)
  const [entry, setEntry] = useState<TEntry | undefined>(undefined)
  const [showAdd, setShowAdd] = useState(false)

  const entryLabel = entry ? `#${entry.compNo} ${entry.name} — ${entry.division}${entry.grade ? ` (${entry.grade})` : ''}` : 'No entry selected'

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <header style={{ display:'flex', gap:12, alignItems:'center', padding:12, borderBottom:'1px solid #e6e9ee', flexWrap:'wrap' }}>
        <h1 style={{ fontSize: 18, margin: 0 }}>🏆 Range Scorer</h1>

        <EventSelector value={eventName} onChange={setEventName} />

        <CompetitorSelector
          value={entryId}
          onChange={(id, e) => { setEntryId(id); setEntry(e) }}
        />

        <button onClick={() => setShowAdd(s => !s)} style={chipBtn}>
          {showAdd ? 'Close' : 'Add Competitor'}
        </button>

        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => setTab('score')} style={tabBtn(tab === 'score')}>Score</button>
          <button onClick={() => setTab('board')} style={tabBtn(tab === 'board')}>Results</button>
          <ExportButton />
        </nav>
      </header>

      {showAdd && (
        <div style={{ maxWidth: 760, margin: '12px auto 0', padding: '0 12px' }}>
          <CompetitorEntry onCreated={(newEntryId) => {
            setEntryId(newEntryId)
            // the selector will refresh and provide the full entry on next change cycle
          }} />
        </div>
      )}

      {tab === 'score' ? (
        <>
          {entry && entryId ? (
            <ScorePad entryLabel={entryLabel} entryId={entryId} event={eventName} />
          ) : (
            <div style={{ maxWidth: 460, margin: '24px auto', padding: 16 }}>
              <h3>No competitor–division selected</h3>
              <p>Add an entry (competitor + division), or choose one from the selector above.</p>
            </div>
          )}
          <RecentStrings />
        </>
      ) : (
        <Results />
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