import { useEffect, useMemo, useState } from 'react'
import { db } from '../db'
import type { EventName } from '../constants/meta'

export default function ScorePad({
  entryLabel,    // '#12 Jane — Metallic'
  entryId,       // Entry.id
  event
}: {
  entryLabel: string
  entryId: string
  event: EventName
}) {
  const [points, setPoints] = useState(0)
  const [xCount, setX] = useState(0)
  const [penalties, setPen] = useState(0)
  const [stringNo, setStringNo] = useState(1)

  const add = (n:number)=> setPoints(v=>Math.max(0, v+n))
  const addPenalty = (n:number)=> setPen(v=>Math.max(0, v+n))
  const clearCurrent = ()=>{ setPoints(0); setX(0); setPen(0) }

  const save = async ()=>{
    await db.scores.add({
      id: crypto.randomUUID(),
      entryId,
      event,
      stringNo,
      points,
      xCount,
      penalties,
      createdAt: Date.now()
    })
    setStringNo(n=>n+1)
    clearCurrent()
    alert(`Saved ${event} string ${stringNo}`)
  }

  useEffect(()=>{ const onKey=(e:KeyboardEvent)=>{
    if (e.key==='x'||e.key==='X') setX(x=>x+1)
    if (e.key==='1') add(10)
    if (e.key==='2') add(8)
    if (e.key==='3') add(5)
    if (e.key==='-') add(-1)
    if (e.key==='p'||e.key==='P') addPenalty(1)
    if (e.key==='s'||e.key==='S') save()
    if (e.key==='c'||e.key==='C') clearCurrent()
  }; window.addEventListener('keydown', onKey); return ()=>window.removeEventListener('keydown', onKey)},[points,xCount,penalties,stringNo])

  const netPoints = useMemo(()=>Math.max(0, points - penalties),[points,penalties])

  return (
    <div style={{maxWidth: 460, margin: '24px auto', padding: 16, fontFamily: 'system-ui'}}>
      <h2 style={{margin:'0 0 8px'}}>Score Entry</h2>
      <div style={{opacity:.8, fontSize:14, marginBottom:12}}>
        {entryLabel} · Event: <b>{event}</b> · String: <b>{stringNo}</b>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12}}>
        <Tile label="Points" value={points} />
        <Tile label="X-Count" value={xCount} />
        <Tile label="Penalties" value={-penalties} />
        <Tile label="Net" value={netPoints} />
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <button onClick={()=>add(10)}>+10</button>
        <button onClick={()=>add(8)}>+8</button>
        <button onClick={()=>add(5)}>+5</button>
        <button onClick={()=>setX(x=>x+1)}>+X</button>
        <button onClick={()=>addPenalty(1)}>-1 Proc</button>
        <button onClick={clearCurrent}>Clear</button>
      </div>

      <button style={{marginTop:16, width:'100%'}} onClick={save}>Save String</button>
    </div>
  )
}

function Tile({label, value}:{label:string; value:number}) {
  return (
    <div style={{background:'#f4f6f8', border:'1px solid #e3e6ea', borderRadius:12, padding:'12px 10px', textAlign:'center'}}>
      <div style={{fontSize:12, opacity:.7, marginBottom:6}}>{label}</div>
      <div style={{fontSize:26, fontWeight:700}}>{value}</div>
    </div>
  )
}