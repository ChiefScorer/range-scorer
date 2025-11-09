import { useEffect, useMemo, useState } from 'react'
import { db } from '../db'

type Stage = 'Practical' | 'Barricade' | 'Mover' | 'Plates'

interface Props {
  compId?: string
  compName?: string
  stage?: Stage
}

export default function ScorePad({
  compId = 'COMP-001',
  compName = 'Demo Shooter',
  stage = 'Practical'
}: Props) {

  // simple in-memory counters for current string
  const [points, setPoints] = useState(0)
  const [xCount, setX] = useState(0)
  const [penalties, setPen] = useState(0)
  const [stringNo, setStringNo] = useState(1)

  // big button helper
  const add = (n: number) => setPoints(v => Math.max(0, v + n))
  const addPenalty = (n: number) => setPen(v => Math.max(0, v + n))

  const clearCurrent = () => { setPoints(0); setX(0); setPen(0) }

  const save = async () => {
    await db.scores.add({
      id: crypto.randomUUID(),
      compId,
      compName,
      stage,
      stringNo,
      points,
      xCount,
      penalties,
      createdAt: Date.now()
    })
    // advance to next string, reset counters
    setStringNo(n => n + 1)
    clearCurrent()
    // small feedback
    alert('Saved string ' + (stringNo))
  }

  // keyboard shortcuts (optional)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'x' || e.key === 'X') setX(x => x + 1)
      if (e.key === '1') add(10)
      if (e.key === '2') add(8)
      if (e.key === '3') add(5)
      if (e.key === '-') add(-1)           // subtract a point if needed
      if (e.key === 'p' || e.key === 'P') addPenalty(1)
      if (e.key === 's' || e.key === 'S') save()
      if (e.key === 'c' || e.key === 'C') clearCurrent()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [points, xCount, penalties, stringNo])

  // quick totals preview of this string
  const netPoints = useMemo(() => Math.max(0, points - penalties), [points, penalties])

  return (
    <div style={{maxWidth: 460, margin: '24px auto', padding: 16, fontFamily: 'system-ui'}}>
      <h2 style={{margin: '0 0 8px'}}>Score Entry</h2>
      <div style={{opacity: .8, fontSize: 14, marginBottom: 12}}>
        Shooter: <b>{compName}</b> ({compId}) · Event: <b>{stage}</b> · String: <b>{stringNo}</b>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom: 12}}>
        <div style={tile}><div style={label}>Points</div><div style={big}>{points}</div></div>
        <div style={tile}><div style={label}>X-Count</div><div style={big}>{xCount}</div></div>
        <div style={tile}><div style={label}>Penalties</div><div style={big}>-{penalties}</div></div>
        <div style={tile}><div style={label}>Net</div><div style={big}>{netPoints}</div></div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <button style={btn} onClick={()=>add(10)}>+10</button>
        <button style={btn} onClick={()=>add(8)}>+8</button>
        <button style={btn} onClick={()=>add(5)}>+5</button>
        <button style={btn} onClick={()=>setX(x => x + 1)}>+X</button>
        <button style={btn} onClick={()=>addPenalty(1)}>-1 Proc</button>
        <button style={btn} onClick={clearCurrent}>Clear</button>
      </div>

      <button style={{...btn, width:'100%', marginTop: 16}} onClick={save}>Save String</button>

      <p style={{marginTop: 12, fontSize: 12, opacity:.7}}>
        Tips: press <code>1</code>/<code>2</code>/<code>3</code> for 10/8/5, <code>X</code> for X-count, <code>P</code> for penalty, <code>S</code> to save.
      </p>
    </div>
  )
}

const tile: React.CSSProperties = {
  background:'#f4f6f8',
  border:'1px solid #e3e6ea',
  borderRadius:12,
  padding:'12px 10px',
  textAlign:'center'
}
const label: React.CSSProperties = { fontSize:12, opacity:.7, marginBottom:6 }
const big: React.CSSProperties = { fontSize:26, fontWeight:700 }
const btn: React.CSSProperties = {
  padding:'14px 10px',
  borderRadius:12,
  border:'1px solid #cfd6de',
  background:'#fff',
  cursor:'pointer',
  fontSize:18
}