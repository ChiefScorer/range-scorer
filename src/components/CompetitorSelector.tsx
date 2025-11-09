import { useEffect, useState } from 'react'
import { db, type TCompetitor } from '../db'

export default function CompetitorSelector({
  value,
  onChange
}: {
  value?: string            // competitor id
  onChange: (id: string, c: TCompetitor | undefined) => void
}) {
  const [list, setList] = useState<TCompetitor[]>([])

  useEffect(() => {
    const load = async () => {
      const all = await db.competitors.orderBy('compNo').toArray()
      setList(all)
      if (!value && all.length > 0) onChange(all[0].id, all[0]) // default to first
    }
    load()
  }, [])

  const current = list.find(c => c.id === value)

  return (
    <select
      value={value || ''}
      onChange={(e) => {
        const id = e.target.value
        const c = list.find(x => x.id === id)
        onChange(id, c)
      }}
      style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #cfd6de' }}
      aria-label="Select competitor"
    >
      {list.length === 0 && <option value="">No competitors yet</option>}
      {list.map(c => (
        <option key={c.id} value={c.id}>
          #{c.compNo} · {c.name}
          {c.division ? ` · ${c.division}` : ''}{c.category ? ` · ${c.category}` : ''}
        </option>
      ))}
    </select>
  )
}