import { useState } from 'react'
import { addCompetitor, addEntry, type TCompetitor } from '../db'
import { DIVISIONS, GRADES, type DivisionName, type GradeName, type GenderCat, type AgeCat, type CompetitionCat } from '../constants/meta'

export default function CompetitorEntry({
  onCreated
}: { onCreated?: (entryId: string) => void }) {
  const [name, setName] = useState('')
  const [gender, setGender] = useState<GenderCat | undefined>(undefined)
  const [ageCat, setAgeCat] = useState<AgeCat | undefined>(undefined)
  const [compCat, setCompCat] = useState<CompetitionCat | undefined>(undefined)

  const [division, setDivision] = useState<DivisionName>('Open')
  const [grade, setGrade] = useState<GradeName | undefined>(undefined)

  const [busy, setBusy] = useState(false)

  const canSave = name.trim().length > 0 && !!division && !busy

  const save = async () => {
    if (!canSave) return
    setBusy(true)
    try {
      const comp: TCompetitor = await addCompetitor({ name, gender, ageCat, compCat })
      const entry = await addEntry({ competitor: comp, division, grade })
      alert(`Created #${comp.compNo} ${comp.name} — ${division}${grade ? ` (${grade})` : ''}`)
      onCreated?.(entry.id)
      // clear
      setName(''); setGender(undefined); setAgeCat(undefined); setCompCat(undefined); setGrade(undefined)
    } catch (e:any) {
      alert(e.message ?? 'Could not create competitor entry.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ display:'grid', gap:8, border:'1px solid #e3e6ea', borderRadius:12, padding:12 }}>
      <h3 style={{ margin:0 }}>Add Competitor & Entry</h3>

      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" />

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
        <select value={gender ?? ''} onChange={e=>setGender((e.target.value || undefined) as GenderCat)}>
          <option value="">Gender (optional)</option>
          <option>Man</option><option>Woman</option>
        </select>
        <select value={ageCat ?? ''} onChange={e=>setAgeCat((e.target.value || undefined) as AgeCat)}>
          <option value="">Age (optional)</option>
          <option>Junior</option><option>Senior</option><option>Grand Senior</option>
        </select>
        <select value={compCat ?? ''} onChange={e=>setCompCat((e.target.value || undefined) as CompetitionCat)}>
          <option value="">Competition Cat (optional)</option>
          <option>Civilian</option><option>Service</option><option>Law Enforcement</option>
        </select>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
        <select value={division} onChange={e=>setDivision(e.target.value as DivisionName)}>
          {DIVISIONS.map(d=><option key={d}>{d}</option>)}
        </select>
        <select value={grade ?? ''} onChange={e=>setGrade((e.target.value || undefined) as GradeName)}>
          <option value="">Grade (optional)</option>
          {GRADES.map(g=><option key={g}>{g}</option>)}
        </select>
      </div>

      <button disabled={!canSave} onClick={save} style={{ padding:'8px 12px', borderRadius:8 }}>
        {busy ? 'Saving…' : 'Save Competitor & Entry'}
      </button>

      <p style={{ margin:0, fontSize:12, opacity:.7 }}>
        A competitor may have multiple entries (one per division). Duplicate division for the same person is blocked.
      </p>
    </div>
  )
}