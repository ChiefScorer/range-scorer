import { useEffect, useMemo, useState } from 'react'
import { db, type TEntry, type TScoreEntry } from '../db'
import { EVENTS } from '../constants/meta'

type Row = {
  entryId: string
  name: string
  division: string
  grade?: string
  platesPts: number; platesX: number
  barricadePts: number; barricadeX: number
  practicalPts: number; practicalX: number
  moverPts: number; moverX: number
  totalPts: number; totalX: number
}

export default function Results() {
  const [entries, setEntries] = useState<TEntry[]>([])
  const [scores, setScores] = useState<TScoreEntry[]>([])

  useEffect(() => {
    const load = async () => {
      const [es, ss] = await Promise.all([
        db.entries.toArray(),
        db.scores.toArray()
      ])
      setEntries(es)
      setScores(ss)
    }
    load()
    const id = setInterval(load, 1000) // light auto-refresh while testing
    return () => clearInterval(id)
  }, [])

  const rows = useMemo<Row[]>(() => {
    const byEntry = new Map<string, Row>()
    const ensure = (e: TEntry): Row => {
      if (!byEntry.has(e.id)) {
        byEntry.set(e.id, {
          entryId: e.id, name: `#${e.compNo} ${e.name}`, division: e.division, grade: e.grade,
          platesPts:0, platesX:0, barricadePts:0, barricadeX:0, practicalPts:0, practicalX:0, moverPts:0, moverX:0,
          totalPts:0, totalX:0
        })
      }
      return byEntry.get(e.id)!
    }

    // seed all entries so zeros appear even without scores
    for (const e of entries) ensure(e)

    for (const s of scores) {
      const e = entries.find(x => x.id === s.entryId)
      if (!e) continue
      const r = ensure(e)
      const net = Math.max(0, s.points - s.penalties)
      switch (s.event) {
        case 'Plates': r.platesPts += net; r.platesX += s.xCount; break
        case 'Barricade': r.barricadePts += net; r.barricadeX += s.xCount; break
        case 'Practical': r.practicalPts += net; r.practicalX += s.xCount; break
        case 'Mover': r.moverPts += net; r.moverX += s.xCount; break
      }
      r.totalPts += net
      r.totalX += s.xCount
    }

    return Array.from(byEntry.values())
      .sort((a,b)=> b.totalPts - a.totalPts || b.totalX - a.totalX || a.name.localeCompare(b.name))
  }, [entries, scores])

  return (
    <div style={{maxWidth: 980, margin:'24px auto', padding:'0 16px', fontFamily:'system-ui'}}>
      <h2 style={{margin:'0 0 12px'}}>Results</h2>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <Th>Rank</Th><Th>Name</Th><Th>Division</Th><Th>Grade</Th>
              <Th>Plates</Th><Th>Barricade</Th><Th>Practical</Th><Th>Mover</Th>
              <Th>Total</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length===0 && (
              <tr><td colSpan={9} style={{padding:12, opacity:.7}}>No entries yet.</td></tr>
            )}
            {rows.map((r, i)=>(
              <tr key={r.entryId} style={{borderTop:'1px solid #e6e9ee'}}>
                <Td>{i+1}</Td>
                <Td>{r.name}</Td>
                <Td>{r.division}</Td>
                <Td>{r.grade ?? ''}</Td>
                <Td>{fmt(r.platesPts, r.platesX)}</Td>
                <Td>{fmt(r.barricadePts, r.barricadeX)}</Td>
                <Td>{fmt(r.practicalPts, r.practicalX)}</Td>
                <Td>{fmt(r.moverPts, r.moverX)}</Td>
                <Td style={{fontWeight:700}}>{fmt(r.totalPts, r.totalX)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{marginTop:8, fontSize:12, opacity:.7}}>
        Format is <b>score-X</b> (e.g., <code>480-48</code>). Ranked by Total, then X-count, then name.
      </p>
    </div>
  )
}

function fmt(points:number, x:number){ return `${points}-${x}` }
function Th({children}:{children:any}){ return <th style={{textAlign:'left', padding:'8px 10px', background:'#f7f8fa', borderBottom:'1px solid #e6e9ee', fontWeight:600}}>{children}</th> }
function Td({children}:{children:any}){ return <td style={{padding:'8px 10px'}}>{children}</td> }