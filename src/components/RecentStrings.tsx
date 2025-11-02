import { useEffect, useState } from 'react'
import { db } from '../db'
import type { ScoreEntry } from '../db'

export default function RecentStrings() {
  const [rows, setRows] = useState<ScoreEntry[]>([])

  useEffect(() => {
    const load = async () => {
      const all = await db.scores.orderBy('createdAt').reverse().limit(10).toArray()
      setRows(all)
    }
    load()
    const id = setInterval(load, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{maxWidth: 460, margin: '0 auto 24px', padding: '0 16px', fontFamily:'system-ui'}}>
      <h3 style={{margin:'16px 0 8px'}}>Recent Strings</h3>
      {rows.length === 0 && <div style={{opacity:.7}}>No strings yet.</div>}
      <ul>
        {rows.map(r => (
          <li key={r.id} style={{margin:'6px 0'}}>
            {new Date(r.createdAt).toLocaleTimeString()} — {r.compName} · {r.stage} · str #{r.stringNo} ·
            Pts {r.points} (X {r.xCount}) · Pen -{r.penalties} · Net {r.points - r.penalties}
          </li>
        ))}
      </ul>
    </div>
  )
}