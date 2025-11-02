import { useEffect, useMemo, useState } from 'react'
import { db } from '../db'
import type { ScoreEntry } from '../db'

type Stage = 'All' | 'Practical' | 'Barricade' | 'Mover' | 'Plates'

export default function Leaderboard() {
  const [rows, setRows] = useState<ScoreEntry[]>([])
  const [stage, setStage] = useState<Stage>('All')

  useEffect(() => {
    let alive = true
    const load = async () => {
      const all = await db.scores.toArray()
      if (alive) setRows(all)
    }
    load()
    const id = setInterval(load, 1000) // light auto-refresh while testing
    return () => { alive = false; clearInterval(id) }
  }, [])

  const data = useMemo(() => {
    const filt = stage === 'All' ? rows : rows.filter(r => r.stage === stage)
    // group by competitor
    const map = new Map<string, {
      compId: string,
      compName: string,
      total: number,
      xTotal: number,
      strings: number
    }>()
    for (const r of filt) {
      const key = r.compId
      if (!map.has(key)) map.set(key, { compId: r.compId, compName: r.compName, total: 0, xTotal: 0, strings: 0 })
      const g = map.get(key)!
      const net = Math.max(0, r.points - r.penalties)
      g.total += net
      g.xTotal += r.xCount
      g.strings += 1
    }
    return Array.from(map.values())
      .sort((a,b) => b.total - a.total || b.xTotal - a.xTotal || a.compName.localeCompare(b.compName))
  }, [rows, stage])

  return (
    <div style={{maxWidth: 720, margin: '24px auto', padding: '0 16px', fontFamily:'system-ui'}}>
      <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:12}}>
        <h2 style={{margin:'0'}}>Leaderboard</h2>
        <select value={stage} onChange={e=>setStage(e.target.value as Stage)}>
          <option>All</option>
          <option>Practical</option>
          <option>Barricade</option>
          <option>Mover</option>
          <option>Plates</option>
        </select>
      </div>

      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th style={th}>#</th>
              <th style={th}>Comp</th>
              <th style={th}>Name</th>
              <th style={th}>Strings</th>
              <th style={th}>X</th>
              <th style={th}>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr><td colSpan={6} style={{padding:12, opacity:.7}}>No scores yet.</td></tr>
            )}
            {data.map((r, i) => (
              <tr key={r.compId} style={{borderTop:'1px solid #e6e9ee'}}>
                <td style={td}>{i+1}</td>
                <td style={td}>{r.compId}</td>
                <td style={td}>{r.compName}</td>
                <td style={td}>{r.strings}</td>
                <td style={td}>{r.xTotal}</td>
                <td style={{...td, fontWeight:700}}>{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const th: React.CSSProperties = { textAlign:'left', padding:'8px 10px', background:'#f7f8fa', borderBottom:'1px solid #e6e9ee', fontWeight:600 }
const td: React.CSSProperties = { padding:'8px 10px' }