import { useEffect, useState } from 'react'
import { db, type TEntry } from '../db'

export default function CompetitorSelector({
  value,
  onChange
}: {
  value?: string // entryId
  onChange: (entryId: string, entry: TEntry | undefined) => void
}) {
  const [list, setList] = useState<TEntry[]>([])

  useEffect(() => {
    const load = async () => {
      const all = await db.entries.orderBy('createdAt').toArray()
      setList(all)
      if (!value && all.length > 0) onChange(all[0].id, all[0])
    }
    load()
  }, [])

  return (
    <select
      value={value || ''}
      onChange={(e) => {
        const id = e.target.value
        onChange(id, list.find(x => x.id === id))
      }}
      style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #cfd6de' }}
      aria-label="Select competitor–division"
    >
      {list.length === 0 && <option value="">No entries yet</option>}
      {list.map(e => (
        <option key={e.id} value={e.id}>
          #{e.compNo} · {e.name} — {e.division}{e.grade ? ` (${e.grade})` : ''}
        </option>
      ))}
    </select>
  )
}