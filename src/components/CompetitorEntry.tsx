import { useState } from 'react'
import { addCompetitor, type TCompetitor } from '../db'

export default function CompetitorEntry({
  onCreated
}: { onCreated?: (c: TCompetitor) => void }) {
  const [name, setName] = useState('')
  const [division, setDivision] = useState('')
  const [category, setCategory] = useState('')
  const [team, setTeam] = useState('')
  const [busy, setBusy] = useState(false)

  const canSave = name.trim().length > 0 && !busy

  const save = async () => {
    if (!canSave) return
    setBusy(true)
    try {
      const c = await addCompetitor({ name, division, category, team })
      onCreated?.(c)
      setName(''); setDivision(''); setCategory(''); setTeam('')
      alert(`Created competitor #${c.compNo} – ${c.name}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ display:'grid', gap:8, border:'1px solid #e3e6ea', borderRadius:12, padding:12 }}>
      <h3 style={{ margin:0 }}>Add Competitor</h3>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" />
      <input value={division} onChange={e=>setDivision(e.target.value)} placeholder="Division (e.g., Open, Production…)" />
      <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category (e.g., Lady, Senior…)" />
      <input value={team} onChange={e=>setTeam(e.target.value)} placeholder="Team (optional)" />
      <button disabled={!canSave} onClick={save} style={{ padding:'8px 12px', borderRadius:8 }}>
        {busy ? 'Saving…' : 'Save Competitor'}
      </button>
      <p style={{ margin:0, fontSize:12, opacity:.7 }}>Number is auto-assigned sequentially (1,2,3…).</p>
    </div>
  )
}