import { useState } from 'react'
import ScorePad from './components/ScorePad'
import RecentStrings from './components/RecentStrings'
import Leaderboard from './components/Leaderboard'
import ExportButton from './components/ExportButton'
import UpdateBanner from './UpdateBanner'

export default function App() {
  const [tab, setTab] = useState<'score' | 'board'>('score')

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <header
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          padding: 12,
          borderBottom: '1px solid #e6e9ee'
        }}
      >
        <h1 style={{ fontSize: 18, margin: 0 }}>🏆 Range Scorer</h1>
        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            onClick={() => setTab('score')}
            style={tabBtn(tab === 'score')}
          >
            Score
          </button>
          <button
            onClick={() => setTab('board')}
            style={tabBtn(tab === 'board')}
          >
            Leaderboard
          </button>
          <ExportButton />
        </nav>
      </header>

      {tab === 'score' ? (
        <>
          <ScorePad
            compId="COMP-001"
            compName="Demo Shooter"
            stage="Practical"
          />
          <RecentStrings />
        </>
      ) : (
        <Leaderboard />
      )}

      {/* ✅ Always render the update banner at the bottom */}
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